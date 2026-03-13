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
    <div className="landing-container">
      {/* Background gradients */}
      <div className="bg-glow blob-1"></div>
      <div className="bg-glow blob-2"></div>
      <div className="bg-glow blob-3"></div>

      <nav className="nav-header">
        <div className="nav-logo">
          <div className="logo-icon"></div>
          <span>FormFlow</span>
        </div>
        <div className="nav-links">
          <Link href="/login" className="nav-link">Log In</Link>
          <Link href="/signup" className="btn-primary hover-lift">Get Started Free</Link>
        </div>
      </nav>

      <main className="hero-section">
        {/* 3D Floating Shapes */}
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>

        <div className="hero-content animate-slide-up">
          <div className="pill-badge">
            <span className="pill-dot"></span> Next-gen Form Builder
          </div>
          
          <h1 className="hero-title">
            Forms that <span className="text-gradient">think</span> for you.
          </h1>
          
          <p className="hero-subtitle">
            Create stunning conversational forms in seconds. Collect responses instantly and unlock AI-powered insights automatically. 
          </p>
          
          <div className="hero-actions">
            <Link href="/signup" className="btn-primary btn-lg hover-lift">
              Start Building Free
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link href="/login" className="btn-secondary btn-lg hover-lift">
              View Demo
            </Link>
          </div>
          <div className="hero-trust">No credit card required. Free forever.</div>
        </div>

      </main>
    </div>
  );
}
