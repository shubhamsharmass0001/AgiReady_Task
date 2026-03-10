import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CheckCircle2 } from "lucide-react";

export default async function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const form = await prisma.form.findUnique({
        where: { id },
        select: { title: true }
    });

    if (!form) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in" style={{ backgroundColor: 'var(--background)' }}>
            <div className="glass-card flex flex-col items-center text-center max-w-md w-full" style={{ padding: '3rem 2rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <CheckCircle2 size={32} style={{ color: '#22c55e' }} />
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                    Response recorded
                </h1>

                <p style={{ color: 'var(--muted-foreground)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>
                    Your response to <strong>{form.title}</strong> has been successfully submitted. Thank you!
                </p>

                <Link href={`/f/${id}`} className="btn-secondary" style={{ width: '100%', padding: '0.875rem' }}>
                    Submit another response
                </Link>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Powered by</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>FormFlow</span>
            </div>
        </div>
    );
}
