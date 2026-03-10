import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;

    const form = await prisma.form.findUnique({
        where: { id },
        include: {
            fields: { orderBy: { order: "asc" } },
            responses: { include: { answers: true }, orderBy: { createdAt: "desc" } }
        }
    });

    if (!form || form.userId !== session.user.id) return new NextResponse("Not Found", { status: 404 });

    let csvContent = "";

    // Header row
    const headers = ["Response ID", "Submitted At", ...form.fields.map(f => `"${f.label.replace(/"/g, '""')}"`)];
    csvContent += headers.join(",") + "\n";

    // Rows
    form.responses.forEach(res => {
        const row = [
            `"${res.id}"`,
            `"${res.createdAt.toISOString()}"`,
            ...form.fields.map(f => {
                const answer = res.answers.find(a => a.fieldId === f.id);
                const val = answer ? answer.value.replace(/"/g, '""') : "";
                return `"${val}"`;
            })
        ];
        csvContent += row.join(",") + "\n";
    });

    return new NextResponse(csvContent, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv"`
        }
    });
}
