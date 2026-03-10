import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import ClientResults from "./client-results";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { id } = await params;

    const form = await prisma.form.findUnique({
        where: { id },
        include: {
            fields: { orderBy: { order: "asc" } },
            responses: {
                include: { answers: true },
                orderBy: { createdAt: "desc" },
            },
            analytics: true,
        },
    });

    if (!form || form.userId !== session.user.id) {
        return notFound();
    }

    return <ClientResults form={form} />;
}
