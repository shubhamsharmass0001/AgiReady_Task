"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                // Automatically sign in after successful registration
                const signInRes = await signIn("credentials", {
                    redirect: false,
                    email: form.email,
                    password: form.password,
                });

                if (signInRes?.error) {
                    setError(signInRes.error);
                } else {
                    router.push("/dashboard");
                }
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 animate-fade-in">
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="page-title" style={{ textAlign: 'center', fontSize: '1.75rem' }}>Join FormFlow</h1>
                <p className="page-description" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    Create intelligent forms powered by AI
                </p>

                {error && (
                    <div style={{ color: 'var(--destructive)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex-col gap-4" style={{ display: 'flex' }}>
                    <div>
                        <label className="form-label" htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            className="input-field"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <div className="flex items-center my-6" style={{ width: '100%' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)', opacity: 0.5 }}></div>
                    <span style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>or continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)', opacity: 0.5 }}></div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                        style={{ padding: '0.75rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                    <button
                        onClick={() => signIn('apple', { callbackUrl: '/dashboard' })}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                        style={{ padding: '0.75rem', fontSize: '0.9rem', background: 'var(--foreground)', border: 'none', color: 'var(--background)' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.24 10.88c-.04-2.4 1.96-3.56 2.05-3.61-1.12-1.63-2.86-1.87-3.48-1.9-1.48-.15-2.88.88-3.64.88-.75 0-1.92-.85-3.13-.82-1.57.03-3.03.92-3.84 2.33-1.65 2.86-.42 7.09 1.19 9.42.78 1.14 1.7 2.41 2.94 2.36 1.18-.04 1.65-.77 3.09-.77 1.45 0 1.88.77 3.12.75 1.27-.03 2.06-1.16 2.83-2.29.9-1.31 1.27-2.58 1.29-2.65-.03-.01-2.42-.93-2.46-3.7zM14.71 4.54c.64-.78 1.08-1.87.97-2.96-.94.04-2.1.63-2.76 1.42-.58.7-.1.08-1.83.97-1.87.05v.06c1 .07 2.23-.55 2.88-1.34z" />
                        </svg>
                        Apple
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: 'var(--foreground)', textDecoration: 'underline' }}>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
