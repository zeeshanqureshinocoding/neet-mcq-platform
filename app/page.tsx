'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <div style={{ fontSize: '60px', marginBottom: '10px' }}>🧬</div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '10px',
          background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          NEET MCQ Platform
        </h1>
        <p style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '40px' }}>
          AI-powered practice strictly from NCERT — Class 11 & 12
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[
            { icon: '🔬', label: 'Biology', chapters: '38 Chapters' },
            { icon: '⚗️', label: 'Chemistry', chapters: '30 Chapters' },
            { icon: '⚡', label: 'Physics', chapters: '30 Chapters' },
          ].map((subject) => (
            <div
              key={subject.label}
              onClick={() => router.push('/practice')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '30px 20px',
                cursor: 'pointer',
              }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>{subject.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{subject.label}</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '5px' }}>{subject.chapters}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/practice')}
          style={{
            background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
            border: 'none',
            borderRadius: '50px',
            padding: '16px 48px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer'
          }}>
          Start Practicing →
        </button>

        <p style={{ marginTop: '20px', fontSize: '13px', color: '#475569' }}>
          Questions generated strictly from NCERT textbooks • PYQ pattern analysis included
        </p>
      </div>
    </main>
  );
}