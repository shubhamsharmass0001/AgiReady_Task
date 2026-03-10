import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, description } = await req.json();

        const form = await prisma.form.create({
            data: {
                title,
                description,
                userId: session.user.id,
            },
        });

        return NextResponse.json(form, { status: 201 });
    } catch (error) {
        console.error("Error creating form:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
