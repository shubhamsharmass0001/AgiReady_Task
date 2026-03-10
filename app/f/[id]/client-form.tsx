"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientForm({ form }: { form: any }) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Evaluate conditional logic rules
    const isFieldVisible = (field: any) => {
        if (!field.conditionalLogic) return true;
        try {
            const rules = JSON.parse(field.conditionalLogic);
            if (!rules.dependsOnField) return true;

            // Find the ID of the field we depend on by its label
            const dependentField = form.fields.find((f: any) => f.label === rules.dependsOnField);
            if (!dependentField) return true; // If we can't find it, show it to be safe

            // Check if the current answer for that field matches the expected value
            return answers[dependentField.id] === rules.expectedValue;
        } catch (e) {
            return true;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formattedAnswers = Object.entries(answers).map(([fieldId, value]) => ({
            fieldId,
            value
        }));

        try {
            const res = await fetch("/api/respond", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formId: form.id, answers: formattedAnswers }),
            });

            if (res.ok) {
                router.push(`/f/${form.id}/success`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card animate-fade-in mx-auto mt-12 mb-20" style={{ padding: '3rem', maxWidth: '800px', width: '100%' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>{form.title}</h1>
            {form.description && <p style={{ marginBottom: '3rem', color: 'var(--muted-foreground)', fontSize: '1.15rem', lineHeight: 1.6 }}>{form.description}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {form.fields.filter(isFieldVisible).map((field: any) => (
                    <div key={field.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'none' }}>
                        <label style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--foreground)' }}>
                            {field.label} {field.required && <span style={{ color: 'var(--destructive)', marginLeft: '0.25rem' }}>*</span>}
                        </label>

                        {field.type === "short_text" && (
                            <input
                                type="text"
                                className="input-field"
                                required={field.required}
                                onChange={e => setAnswers({ ...answers, [field.id]: e.target.value })}
                                placeholder="Your answer"
                                style={{ fontSize: '1.05rem', padding: '0.875rem' }}
                            />
                        )}

                        {field.type === "long_text" && (
                            <textarea
                                className="input-field"
                                rows={4}
                                required={field.required}
                                onChange={e => setAnswers({ ...answers, [field.id]: e.target.value })}
                                placeholder="Your answer"
                                style={{ fontSize: '1.05rem', padding: '0.875rem', resize: 'vertical' }}
                            />
                        )}

                        {field.type === "multiple_choice" && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                                {JSON.parse(field.options || "[]").map((opt: string, i: number) => (
                                    <label key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s', ...answers[field.id] === opt ? { borderColor: 'var(--primary)', background: 'rgba(59, 130, 246, 0.1)' } : {} }}>
                                        <input
                                            type="radio"
                                            name={field.id}
                                            value={opt}
                                            required={field.required}
                                            onChange={e => setAnswers({ ...answers, [field.id]: e.target.value })}
                                            style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
                                        />
                                        <span style={{ fontSize: '1.05rem' }}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {field.type === "rating" && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <label key={num} style={{ cursor: 'pointer', flex: 1 }}>
                                        <input
                                            type="radio"
                                            name={field.id}
                                            value={num.toString()}
                                            required={field.required}
                                            onChange={e => setAnswers({ ...answers, [field.id]: e.target.value })}
                                            style={{ display: 'none' }}
                                        />
                                        <div
                                            style={{
                                                height: '50px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRadius: 'var(--radius)',
                                                border: '1px solid',
                                                borderColor: answers[field.id] === num.toString() ? 'var(--primary)' : 'var(--border)',
                                                background: answers[field.id] === num.toString() ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                                color: answers[field.id] === num.toString() ? 'var(--primary-foreground)' : 'var(--foreground)',
                                                transition: 'all 0.2s ease',
                                                fontSize: '1.1rem',
                                                fontWeight: answers[field.id] === num.toString() ? 600 : 400
                                            }}
                                        >
                                            {num}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button type="submit" className="btn-primary mt-4" disabled={loading} style={{ alignSelf: 'flex-start', padding: '1.25rem 3rem', fontSize: '1.15rem', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)' }}>
                    {loading ? "Submitting..." : "Submit Response"}
                </button>
            </form>
        </div>
    );
}
