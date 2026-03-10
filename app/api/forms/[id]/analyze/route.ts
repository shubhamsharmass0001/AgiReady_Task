import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI, Type, Schema } from "@google/genai";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy_key_for_build" });
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const form = await prisma.form.findUnique({
            where: { id },
            include: {
                fields: true,
                responses: { include: { answers: true } }
            }
        });

        if (!form || form.userId !== session.user.id) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        if (form.responses.length === 0) {
            return NextResponse.json({ message: "No responses to analyze" }, { status: 400 });
        }

        // Format open-ended data for AI
        const textData = form.responses.map(res => {
            const texts = res.answers
                .filter(a => {
                    const field = form.fields.find(f => f.id === a.fieldId);
                    return field?.type === 'long_text' || field?.type === 'short_text';
                })
                .map(a => `<Q>${form.fields.find(f => f.id === a.fieldId)?.label}</Q><A>${a.value}</A>`);
            return texts.join("\n");
        }).filter(t => t.length > 0).join("\n---\n");

        if (!textData) {
            return NextResponse.json({ message: "No text data to analyze (only structured fields present)" }, { status: 400 });
        }

        const responseSchema: Schema = {
            type: Type.OBJECT,
            properties: {
                sentimentScore: {
                    type: Type.NUMBER,
                    description: "Float 0.0 to 10.0 representing overall sentiment, where 0 is extremely negative and 10 is extremely positive",
                },
                keyThemes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                    description: "Array of strings, max 5, summarizing the most common themes in 3-5 words each",
                },
                generatedSummary: {
                    type: Type.STRING,
                    description: "A comprehensive 3 paragraph executive summary of the responses. Synthesize the core feedback patterns. DO NOT mention individual names.",
                },
            },
            required: ["sentimentScore", "keyThemes", "generatedSummary"],
        };

        const completion = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Here are the form responses to analyze:\n${textData}`,
            config: {
                systemInstruction: "You are an expert product data analyst. Analyze these form responses critically. Calculate a highly precise sentiment score between 0.0 and 10.0 (where 5.0 is truly neutral, <4 is mostly negative, >7 is mostly positive). Identify max 5 ultra-specific key themes (e.g. 'Slow API Loading' instead of just 'API Performance') in 3-5 words each. Finally, write a professional executive summary synthesizing the data patterns without mentioning individual respondent names.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const aiOutputText = completion.text || "{}";
        const aiOutput = JSON.parse(aiOutputText);

        const summary = await prisma.analyticsSummary.upsert({
            where: { formId: form.id },
            update: {
                sentimentScore: aiOutput.sentimentScore,
                keyThemes: JSON.stringify(aiOutput.keyThemes),
                generatedSummary: aiOutput.generatedSummary,
            },
            create: {
                formId: form.id,
                sentimentScore: aiOutput.sentimentScore,
                keyThemes: JSON.stringify(aiOutput.keyThemes),
                generatedSummary: aiOutput.generatedSummary,
            }
        });

        return NextResponse.json(summary);
    } catch (err) {
        console.error("AI Analysis Error:", err);
        return NextResponse.json({ message: "Error during AI generation" }, { status: 500 });
    }
}
