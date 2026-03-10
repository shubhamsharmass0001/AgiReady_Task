"use client";

import { useState, useEffect } from "react";
import { Download, RefreshCw, MessageSquare, BrainCircuit, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientResults({ form }: { form: any }) {
    const router = useRouter();
    const [generating, setGenerating] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGenerateInsights = async () => {
        setGenerating(true);
        try {
            await fetch(`/api/forms/${form.id}/analyze`, { method: "POST" });
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="animate-fade-in pb-20">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{form.title} - Results</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>{form.responses.length} responses total</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href={`/api/forms/${form.id}/export`} className="btn-secondary" download>
                        <Download size={16} /> Export CSV
                    </a>
                    <Link href={`/dashboard/forms/${form.id}/edit`} className="btn-secondary">
                        Edit Form
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                {/* AI Insights Panel */}
                <div className="glass-card" style={{ flex: '1 1 300px', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1, color: 'var(--primary)' }}>
                        <BrainCircuit size={100} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', position: 'relative', zIndex: 10 }}>
                        <BrainCircuit size={20} /> AI Insights
                    </h2>

                    {form.analytics ? (
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{ marginBottom: '2rem', padding: '1.25rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                    <Activity size={14} /> Overall Sentiment Score
                                </div>
                                <div style={{ fontSize: '3rem', fontWeight: 800, color: form.analytics.sentimentScore >= 7 ? '#4ade80' : form.analytics.sentimentScore <= 4 ? '#ef4444' : '#eab308' }}>
                                    {form.analytics.sentimentScore}<span style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>/10</span>
                                </div>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Key Themes Detected</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                    {JSON.parse(form.analytics.keyThemes || "[]").map((t: string, i: number) => (
                                        <span key={i} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', color: 'var(--foreground)', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 500 }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Executive Summary</div>
                                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--foreground)' }}>{form.analytics.generatedSummary}</p>
                            </div>
                            <button onClick={handleGenerateInsights} disabled={generating} className="btn-secondary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}>
                                <RefreshCw size={12} className={generating ? "animate-spin" : ""} /> {generating ? "Analyzing..." : "Refresh Insights"}
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 0', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1rem' }}>No AI insights generated yet.</p>
                            <button onClick={handleGenerateInsights} disabled={generating || form.responses.length === 0} className="btn-primary">
                                {generating ? "Analyzing with AI..." : "Generate Insights"}
                            </button>
                            {form.responses.length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--destructive)', marginTop: '0.5rem' }}>Need at least 1 response.</p>}
                        </div>
                    )}
                </div>

                {/* Responses Table */}
                <div className="glass-card" style={{ flex: '2 1 500px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageSquare size={20} /> Latest Responses
                    </h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.875rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>Date</th>
                                    {form.fields.slice(0, 3).map((f: any) => (
                                        <th key={f.id} style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--muted-foreground)', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {f.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {form.responses.length === 0 ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>No responses yet.</td></tr>
                                ) : (
                                    form.responses.slice(0, 10).map((res: any) => (
                                        <tr key={res.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                                                {mounted ? new Date(res.createdAt).toLocaleDateString() : '...'}
                                            </td>
                                            {form.fields.slice(0, 3).map((f: any) => {
                                                const ans = res.answers.find((a: any) => a.fieldId === f.id);
                                                return <td key={f.id} style={{ padding: '0.75rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ans?.value}>{ans?.value || "-"}</td>
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {form.responses.length > 10 && (
                        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Showing 10 most recent. Download CSV for all data.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
