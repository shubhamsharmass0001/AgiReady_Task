import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, Plus, Settings } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            {/* Sidebar */}
            <aside className="w-64 hidden md:flex flex-col" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(24, 24, 27, 0.4)', backdropFilter: 'blur(16px)', width: '260px', zIndex: 20 }}>
                <div className="p-6 flex items-center" style={{ height: '76px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>FormFlow</h2>
                    </div>
                </div>
                <nav className="p-4 flex-col gap-2" style={{ display: 'flex' }}>
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded" style={{ borderRadius: '10px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', fontWeight: 500 }}>
                        <LayoutDashboard size={18} />
                        <span>Workspace</span>
                    </Link>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
                <header className="p-6 flex justify-between items-center" style={{ height: '76px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
                    <div>
                        <h1 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 500, color: 'var(--muted-foreground)' }}>
                            Welcome back, <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{session.user?.name || "User"}</span>
                        </h1>
                    </div>
                    <div className="flex gap-4 items-center" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link href="/api/auth/signout" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <LogOut size={16} />
                            Sign Out
                        </Link>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-6 md:p-10">
                    <div className="w-full mx-auto" style={{ maxWidth: '1600px' }}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
