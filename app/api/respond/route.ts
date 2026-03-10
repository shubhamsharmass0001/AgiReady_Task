import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { formId, answers } = await req.json();

        const form = await prisma.form.findUnique({ where: { id: formId, isPublished: true } });

        if (!form) {
            return NextResponse.json({ message: "Form not open or does not exist" }, { status: 400 });
        }

        const response = await prisma.response.create({
            data: {
                formId,
                answers: {
                    create: answers.map((a: any) => ({
                        fieldId: a.fieldId,
                        value: a.value
                    }))
                }
            },
            include: {
                answers: true
            }
        });

        // Trigger Webhook if configured
        if (form.webhookUrl) {
            try {
                // Fire and forget (don't await broadly to avoid slowing down the user response)
                fetch(form.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: "form_response.created",
                        formId: form.id,
                        formTitle: form.title,
                        responseId: response.id,
                        answers: response.answers,
                        submittedAt: response.createdAt,
                    })
                }).catch(e => console.error("Failed to fire webhook:", e));
            } catch (e) {
                console.error("Webhook execution error", e);
            }
        }

        return NextResponse.json({ success: true, responseId: response.id });
    } catch (err) {
        console.error("Response error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
