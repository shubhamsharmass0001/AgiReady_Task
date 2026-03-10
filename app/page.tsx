import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 animate-fade-in">
      <h1 className="page-title" style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1.1 }}>
        Forms that <span style={{ color: 'var(--primary)' }}>think</span> for you.
      </h1>
      <p className="page-description" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
        Create beautiful forms, share them instantly, and get AI-powered insights from your responses automatically.
      </p>

      <div className="flex gap-4">
        <Link href="/signup" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }}>
          Get Started Free
        </Link>
        <Link href="/login" className="btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }}>
          Log In
        </Link>
      </div>

      {/* Decorative mockup visual */}
      <div className="mt-16 glass-card" style={{ width: '100%', maxWidth: '900px', height: '400px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.3 }}></div>
        <div style={{ position: 'absolute', bottom: '-80px', right: '-20px', width: '300px', height: '300px', borderRadius: '50%', background: '#a855f7', filter: 'blur(100px)', opacity: 0.2 }}></div>

        <div className="flex-col gap-4 p-8" style={{ display: 'flex', height: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '30%', height: '24px', background: 'var(--border)', borderRadius: '4px' }}></div>
          <div style={{ width: '60%', height: '40px', background: 'var(--input)', borderRadius: '8px', marginTop: '1rem' }}></div>
          <div style={{ width: '80%', height: '80px', background: 'var(--input)', borderRadius: '8px' }}></div>
          <div style={{ width: '120px', height: '40px', background: 'var(--primary)', borderRadius: '8px', marginTop: '1rem' }}></div>
        </div>
      </div>
    </div>
  );
}
