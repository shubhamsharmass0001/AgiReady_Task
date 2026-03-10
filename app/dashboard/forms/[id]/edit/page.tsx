"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, Share2 } from "lucide-react";

type FieldType = "short_text" | "long_text" | "multiple_choice" | "rating";

interface Field {
    id?: string;
    type: FieldType;
    label: string;
    options: string;
    required: boolean;
    order: number;
    conditionalLogic?: string;
}

export default function FormEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [form, setForm] = useState<any>(null);
    const [fields, setFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch(`/api/forms/${id}`)
            .then(res => res.json())
            .then(data => {
                setForm(data);
                setFields(data.fields || []);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-8">Loading form...</div>;
    if (!form) return <div className="p-8">Form not found.</div>;

    const handleSave = async (publishStatus?: boolean) => {
        setSaving(true);
        const isPublished = publishStatus !== undefined ? publishStatus : form.isPublished;

        await fetch(`/api/forms/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: form.title,
                description: form.description,
                isPublished,
                webhookUrl: form.webhookUrl,
                fields: fields.map((f, i) => ({ ...f, order: i })),
            }),
        });

        setForm({ ...form, isPublished });
        setSaving(false);
    };

    const addField = (type: FieldType) => {
        const newField: Field = {
            type,
            label: "",
            options: type === "multiple_choice" ? JSON.stringify(["Option 1"]) : "",
            required: false,
            order: fields.length,
            conditionalLogic: ""
        };
        setFields([...fields, newField]);
    };

    const updateField = (index: number, updates: Partial<Field>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    return (
        <div className="flex gap-8 h-full animate-fade-in mx-auto w-full max-w-[1200px]" style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
            {/* Main Editor */}
            <div className="flex-1 overflow-auto pb-20" style={{ flex: 1 }}>
                <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Edit Form</h1>
                    <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                        {form.isPublished && (
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/f/${form.id}`);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="btn-secondary"
                            >
                                <Share2 size={16} /> {copied ? "Copied!" : "Copy Link"}
                            </button>
                        )}
                        <button onClick={() => handleSave()} disabled={saving} className="btn-secondary">
                            <Save size={16} />
                            {saving ? "Saving..." : "Save Draft"}
                        </button>
                        <button
                            onClick={() => handleSave(!form.isPublished)}
                            disabled={saving}
                            className="btn-primary"
                            style={{ backgroundColor: form.isPublished ? 'var(--secondary)' : 'var(--primary)', border: form.isPublished ? '1px solid var(--border)' : 'none' }}
                        >
                            {form.isPublished ? "Unpublish" : "Publish"}
                        </button>
                    </div>
                </div>

                <div className="glass-card mb-8" style={{ marginBottom: '2rem' }}>
                    <input
                        type="text"
                        className="w-full bg-transparent border-none text-3xl font-bold mb-4 outline-none placeholder-muted"
                        style={{ fontSize: '2rem', fontWeight: 700, outline: 'none', background: 'transparent', width: '100%', marginBottom: '1rem', color: 'var(--foreground)' }}
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        placeholder="Form Title"
                    />
                    <textarea
                        className="w-full bg-transparent border-none outline-none resize-none placeholder-muted"
                        style={{ fontSize: '1rem', outline: 'none', background: 'transparent', width: '100%', minHeight: '60px', color: 'var(--muted-foreground)' }}
                        value={form.description || ""}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Form description (optional)"
                    />

                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Webhook Integration</label>
                        <input
                            type="url"
                            className="input-field w-full"
                            style={{ fontSize: '0.9rem' }}
                            value={form.webhookUrl || ""}
                            onChange={e => setForm({ ...form, webhookUrl: e.target.value })}
                            placeholder="https://your-webhook.url/hook (Optional)"
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>A POST request containing the form response will be sent to this URL upon submission.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {fields.map((field, index) => (
                        <div key={index} className="glass-card flex gap-4" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div className="flex flex-col gap-4 flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, padding: '0.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Question Title</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ fontSize: '1.15rem', fontWeight: 600, background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '0.875rem 1rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                                        value={field.label}
                                        onChange={e => updateField(index, { label: e.target.value })}
                                        placeholder="Type your question here..."
                                        autoFocus={field.label === ""}
                                    />
                                </div>

                                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Respondent Preview</div>
                                    {field.type === "short_text" && (
                                        <input disabled className="input-field" style={{ opacity: 0.6, cursor: 'not-allowed', background: 'transparent' }} placeholder="Short answer text" />
                                    )}
                                    {field.type === "long_text" && (
                                        <textarea disabled className="input-field" style={{ opacity: 0.6, cursor: 'not-allowed', background: 'transparent' }} rows={2} placeholder="Long answer text" />
                                    )}
                                    {field.type === "rating" && (
                                        <div style={{ color: 'var(--muted-foreground)' }}>⭐⭐⭐⭐⭐ Rating (1-5 stars)</div>
                                    )}
                                    {field.type === "multiple_choice" && (
                                        <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {JSON.parse(field.options || "[]").map((opt: string, optIdx: number) => (
                                                <div key={optIdx} className="flex gap-2 items-center" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid var(--border)' }}></div>
                                                    <input
                                                        type="text"
                                                        className="input-field"
                                                        style={{ padding: '0.25rem 0.5rem' }}
                                                        value={opt}
                                                        onChange={e => {
                                                            const newOpts = JSON.parse(field.options);
                                                            newOpts[optIdx] = e.target.value;
                                                            updateField(index, { options: JSON.stringify(newOpts) });
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newOpts = JSON.parse(field.options).filter((_: any, i: number) => i !== optIdx);
                                                            updateField(index, { options: JSON.stringify(newOpts) });
                                                        }}
                                                        style={{ color: 'var(--destructive)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                                                    >×</button>
                                                </div>
                                            ))}
                                            <button
                                                className="text-sm text-primary mt-2 text-left"
                                                style={{ color: 'var(--primary)', cursor: 'pointer', textAlign: 'left', background: 'rgba(59, 130, 246, 0.1)', border: 'none', marginTop: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', width: 'max-content', fontWeight: 500 }}
                                                onClick={() => {
                                                    const newOpts = JSON.parse(field.options || "[]");
                                                    newOpts.push(`Option ${newOpts.length + 1}`);
                                                    updateField(index, { options: JSON.stringify(newOpts) });
                                                }}
                                            >
                                                + Add Option
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {/* Conditional Logic UI moved under field items so it isn't squeezed */}
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>Conditional Logic</span>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Show this field if:</span>
                                        <select
                                            className="input-field"
                                            style={{ fontSize: '0.85rem', padding: '0.4rem', width: '200px' }}
                                            value={field.conditionalLogic ? JSON.parse(field.conditionalLogic).dependsOnField : ""}
                                            onChange={e => {
                                                const val = e.target.value;
                                                const prevRule = field.conditionalLogic ? JSON.parse(field.conditionalLogic) : {};

                                                if (val === "") {
                                                    updateField(index, { conditionalLogic: "" });
                                                } else {
                                                    updateField(index, { conditionalLogic: JSON.stringify({ ...prevRule, dependsOnField: val, expectedValue: "" }) });
                                                }
                                            }}
                                        >
                                            <option value="">Always (No logic)</option>
                                            {fields.slice(0, index).filter(f => f.type === 'multiple_choice').map((prevField, i) => (
                                                <option key={i} value={prevField.label || `Question ${i + 1}`}>
                                                    {prevField.label || `Question ${i + 1}`}
                                                </option>
                                            ))}
                                        </select>

                                        {field.conditionalLogic && JSON.parse(field.conditionalLogic).dependsOnField && (
                                            <>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Equals:</span>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    style={{ fontSize: '0.85rem', padding: '0.4rem', width: '200px' }}
                                                    placeholder="Target answer..."
                                                    value={JSON.parse(field.conditionalLogic).expectedValue || ""}
                                                    onChange={e => {
                                                        const prevRule = JSON.parse(field.conditionalLogic || "{}");
                                                        updateField(index, { conditionalLogic: JSON.stringify({ ...prevRule, expectedValue: e.target.value }) });
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 items-center justify-start border-l pl-6 ml-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '1.5rem', minWidth: '100px' }}>
                                <button onClick={() => removeField(index)} style={{ color: 'var(--destructive)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', transition: 'all 0.2s', opacity: 0.8 }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0.8'}>
                                    <Trash2 size={20} />
                                </button>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', width: '100%' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>Required</span>
                                    <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={e => updateField(index, { required: e.target.checked })}
                                        style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {fields.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', color: 'var(--muted-foreground)' }}>
                            No fields added yet. Choose a field type from the sidebar to get started.
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Tool panel */}
            <div style={{ width: '250px' }}>
                <div className="glass-card" style={{ position: 'sticky', top: '2rem' }}>
                    <h3 style={{ fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', margin: 0 }}>Add Field</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button onClick={() => addField('short_text')} className="btn-secondary" style={{ justifyContent: 'flex-start', width: '100%' }}><Plus size={14} /> Short Text</button>
                        <button onClick={() => addField('long_text')} className="btn-secondary" style={{ justifyContent: 'flex-start', width: '100%' }}><Plus size={14} /> Long Text</button>
                        <button onClick={() => addField('multiple_choice')} className="btn-secondary" style={{ justifyContent: 'flex-start', width: '100%' }}><Plus size={14} /> Multiple Choice</button>
                        <button onClick={() => addField('rating')} className="btn-secondary" style={{ justifyContent: 'flex-start', width: '100%' }}><Plus size={14} /> Rating</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
