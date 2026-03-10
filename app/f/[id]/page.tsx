import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientForm from "./client-form";

export default async function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const form = await prisma.form.findUnique({
        where: { id, isPublished: true },
        include: { fields: { orderBy: { order: "asc" } } },
    });

    if (!form) {
        return notFound();
    }

    return (
        <div className="min-h-screen p-4 md:p-8 flex justify-center" style={{ backgroundColor: 'var(--background)' }}>
            <div className="w-full" style={{ maxWidth: '700px' }}>
                <ClientForm form={form} />
            </div>
        </div>
    );
}
