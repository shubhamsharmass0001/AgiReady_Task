import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const form = await prisma.form.findUnique({
            where: { id },
            include: { fields: { orderBy: { order: "asc" } } },
        });

        if (!form || form.userId !== session.user.id) {
            return NextResponse.json({ message: "Not Found or Unauthorized" }, { status: 404 });
        }

        return NextResponse.json(form);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching form" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const formVerify = await prisma.form.findUnique({ where: { id } });
        if (!formVerify || formVerify.userId !== session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, description, isPublished, webhookUrl, fields } = await req.json();

        // Use a transaction to reliably update form and replace fields
        await prisma.$transaction(async (tx) => {
            // Update form metadata
            await tx.form.update({
                where: { id },
                data: { title, description, isPublished, webhookUrl },
            });

            // Simple implementation: delete all form fields and recreate them to match the new state
            await tx.field.deleteMany({
                where: { formId: id },
            });

            if (fields && fields.length > 0) {
                await tx.field.createMany({
                    data: fields.map((f: any, index: number) => ({
                        formId: id,
                        type: f.type,
                        label: f.label,
                        options: f.options || null,
                        required: f.required || false,
                        conditionalLogic: f.conditionalLogic || null,
                        order: index,
                    })),
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update form:", error);
        return NextResponse.json({ message: "Failed to update form" }, { status: 500 });
    }
}
