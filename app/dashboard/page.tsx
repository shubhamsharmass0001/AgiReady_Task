import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ListTodo, MoreVertical, Edit2, Share2, BarChart2 } from "lucide-react";
import CreateFormButton from "@/components/create-form-button";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const forms = await prisma.form.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { responses: true },
            },
        },
    });

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-10" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, rgba(30, 30, 34, 0.6) 0%, rgba(20, 20, 24, 0.8) 100%)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.15), transparent 50%)', zIndex: 0 }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--foreground)', letterSpacing: '-0.03em' }}>Your Forms</h2>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.05rem', fontWeight: 500 }}>Manage and analyze your responsive forms in one place</p>
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <CreateFormButton />
                </div>
            </div>

            {forms.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center p-12 text-center" style={{ minHeight: '300px' }}>
                    <ListTodo size={48} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground)' }}>No forms yet</h3>
                    <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', maxWidth: '300px', lineHeight: 1.6 }}>
                        Create your first form to start collecting responses and unlock AI insights.
                    </p>
                    <CreateFormButton />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem' }}>
                    {forms.map((form) => (
                        <div key={form.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: form.isPublished ? 'linear-gradient(90deg, #4ade80, #22c55e)' : 'linear-gradient(90deg, #a1a1aa, #52525b)', opacity: 0.8 }}></div>
                            <div className="flex justify-between items-start mb-5" style={{ marginTop: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0, color: 'var(--foreground)', lineHeight: 1.3 }}>{form.title}</h3>
                                <div style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem', border: form.isPublished ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(255,255,255,0.1)', background: form.isPublished ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255,255,255,0.05)', color: form.isPublished ? '#4ade80' : 'var(--muted-foreground)', borderRadius: '999px', fontWeight: 500 }}>
                                    {form.isPublished ? 'Published' : 'Draft'}
                                </div>
                            </div>

                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', marginBottom: '2rem', flex: 1, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {form.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center gap-2 mb-5" style={{ fontSize: '0.85rem', color: 'var(--foreground)', fontWeight: 500 }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem', borderRadius: '6px', color: 'var(--primary)' }}>
                                    <BarChart2 size={16} />
                                </div>
                                {form._count.responses} response{form._count.responses !== 1 ? 's' : ''} captured
                            </div>

                            <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <Link href={`/dashboard/forms/${form.id}/edit`} className="btn-secondary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.03)' }}>
                                    <Edit2 size={16} /> Edit
                                </Link>
                                <Link href={`/dashboard/forms/${form.id}/results`} className="btn-secondary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem', background: 'var(--primary)', color: 'white', border: 'none' }}>
                                    <BarChart2 size={16} /> Results
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
