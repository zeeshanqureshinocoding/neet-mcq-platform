'use client';
import { useState, useEffect } from 'react';

interface ChapterStat {
  chapter: string;
  class: number;
  attempted: number;
  correct: number;
}

interface TypeStat {
  type: string;
  attempted: number;
  correct: number;
}

interface SessionData {
  chapterStats: Record<string, ChapterStat>;
  typeStats: Record<string, TypeStat>;
  totalAttempted: number;
  totalCorrect: number;
}

const emptySession: SessionData = {
  chapterStats: {},
  typeStats: {},
  totalAttempted: 0,
  totalCorrect: 0,
};

export default function Dashboard() {
  const [session, setSession] = useState<SessionData>(emptySession);

  useEffect(() => {
    const saved = localStorage.getItem('neet-stats');
    if (saved) setSession(JSON.parse(saved));
  }, []);

  const accuracy = session.totalAttempted > 0
    ? Math.round((session.totalCorrect / session.totalAttempted) * 100)
    : 0;

  const estimatedScore = Math.round((accuracy / 100) * 360);

  const chapterList = Object.values(session.chapterStats).sort((a, b) => {
    const accA = a.attempted > 0 ? a.correct / a.attempted : 0;
    const accB = b.attempted > 0 ? b.correct / b.attempted : 0;
    return accA - accB;
  });

  const typeList = Object.values(session.typeStats).sort((a, b) => {
    const accA = a.attempted > 0 ? a.correct / a.attempted : 0;
    const accB = b.attempted > 0 ? b.correct / b.attempted : 0;
    return accA - accB;
  });

  const getColor = (acc: number) => {
    if (acc >= 0.8) return '#22c55e';
    if (acc >= 0.5) return '#f59e0b';
    return '#ef4444';
  };

  const getLabel = (acc: number) => {
    if (acc >= 0.8) return '💪 Strong';
    if (acc >= 0.5) return '⚠️ Average';
    return '❌ Weak';
  };

  const scoreColor = estimatedScore >= 300 ? '#22c55e' : estimatedScore >= 200 ? '#f59e0b' : '#ef4444';

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      fontFamily: 'sans-serif', color: 'white', padding: '30px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <a href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>← Home</a>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0 4px',
              background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your Analytics
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Based on your practice sessions</p>
          </div>
          <button
            onClick={() => { localStorage.removeItem('neet-stats'); setSession(emptySession); }}
            style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444',
              borderRadius: '8px', padding: '8px 16px', color: '#ef4444',
              cursor: 'pointer', fontSize: '13px' }}>
            Reset Stats
          </button>
        </div>

        {session.totalAttempted === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>📊</div>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>No Data Yet!</h2>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>Practice some questions first to see your analytics.</p>
            <a href="/practice" style={{
              background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
              borderRadius: '50px', padding: '14px 36px',
              fontSize: '16px', fontWeight: 'bold', color: 'white', textDecoration: 'none'
            }}>Start Practicing →</a>
          </div>
        ) : (
          <>
            {/* Top Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total Attempted', value: session.totalAttempted, icon: '📝', color: '#38bdf8' },
                { label: 'Total Correct', value: session.totalCorrect, icon: '✅', color: '#22c55e' },
                { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯', color: '#f59e0b' },
                { label: 'Est. NEET Score', value: `${estimatedScore}/360`, icon: '🏆', color: scoreColor },
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '20px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* NEET Readiness Bar */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '24px', marginBottom: '32px'
            }}>
              <h2 style={{ fontSize: '18px', margin: '0 0 16px' }}>🏆 NEET Readiness</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8' }}>Estimated Biology Score</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: scoreColor }}>{estimatedScore} / 360</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '12px' }}>
                <div style={{
                  background: `linear-gradient(90deg, ${scoreColor}, #818cf8)`,
                  height: '12px', borderRadius: '10px',
                  width: `${(estimatedScore / 360) * 100}%`,
                  transition: 'width 1s'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: '#475569' }}>0</span>
                <span style={{ fontSize: '12px', color: '#f59e0b' }}>180 (Pass)</span>
                <span style={{ fontSize: '12px', color: '#22c55e' }}>300+ (Good)</span>
                <span style={{ fontSize: '12px', color: '#475569' }}>360</span>
              </div>
            </div>

            {/* Question Type Performance */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '24px', marginBottom: '32px'
            }}>
              <h2 style={{ fontSize: '18px', margin: '0 0 20px' }}>📋 Question Type Performance</h2>
              {typeList.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '14px' }}>No data yet!</p>
              ) : (
                typeList.map((t) => {
                  const acc = t.attempted > 0 ? t.correct / t.attempted : 0;
                  return (
                    <div key={t.type} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px' }}>{t.type}</span>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{t.correct}/{t.attempted}</span>
                          <span style={{ fontSize: '12px', color: getColor(acc) }}>{getLabel(acc)}</span>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '8px' }}>
                        <div style={{
                          background: getColor(acc), height: '8px', borderRadius: '10px',
                          width: `${acc * 100}%`, transition: 'width 1s'
                        }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chapter Performance */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '24px'
            }}>
              <h2 style={{ fontSize: '18px', margin: '0 0 20px' }}>📚 Chapter Performance (Weakest First)</h2>
              {chapterList.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '14px' }}>No data yet!</p>
              ) : (
                chapterList.map((c) => {
                  const acc = c.attempted > 0 ? c.correct / c.attempted : 0;
                  return (
                    <div key={c.chapter} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px' }}>
                          <span style={{ color: '#475569', fontSize: '12px', marginRight: '8px' }}>Class {c.class}</span>
                          {c.chapter}
                        </span>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{c.correct}/{c.attempted}</span>
                          <span style={{ fontSize: '12px', color: getColor(acc) }}>{getLabel(acc)}</span>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '8px' }}>
                        <div style={{
                          background: getColor(acc), height: '8px', borderRadius: '10px',
                          width: `${acc * 100}%`, transition: 'width 1s'
                        }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}