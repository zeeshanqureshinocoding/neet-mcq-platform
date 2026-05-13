'use client';
import { useState, useEffect } from 'react';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  chapter: string;
  class: number;
  subject: string;
  questionType: string;
  ncertLine: string;
}

export default function Practice() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  const fetchQuestion = async () => {
    setLoading(true);
    setSelected(null);
    setAnswered(false);
    setError('');
    try {
      const res = await fetch('/api/generate-question');
      const data = await res.json();
      if (data.success) {
        setQuestion(data.question);
      } else {
        setError('Failed to generate question. Please try again.');
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSelect = (index: number) => {
    if (answered || !question) return;
    setSelected(index);
    setAnswered(true);
    setTotal(t => t + 1);
    if (index === question.correct) setScore(s => s + 1);
  };

  const getOptionStyle = (index: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%', padding: '16px 20px', borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(255,255,255,0.05)',
      color: 'white', fontSize: '16px', textAlign: 'left',
      cursor: answered ? 'default' : 'pointer', marginBottom: '12px',
      transition: 'all 0.3s'
    };
    if (!answered || !question) return base;
    if (index === question.correct) return { ...base, background: 'rgba(34,197,94,0.3)', border: '1px solid #22c55e' };
    if (index === selected) return { ...base, background: 'rgba(239,68,68,0.3)', border: '1px solid #ef4444' };
    return base;
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', color: 'white', padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '750px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <a href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>← Home</a>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>
              ✅ {score} correct
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>
              📝 {total} attempted
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
            <p style={{ color: '#94a3b8', fontSize: '18px' }}>AI is generating your NCERT question...</p>
            <p style={{ color: '#475569', fontSize: '14px', marginTop: '8px' }}>Reading current NCERT Biology textbook</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <p style={{ color: '#ef4444', fontSize: '18px', marginBottom: '24px' }}>{error}</p>
            <button onClick={fetchQuestion} style={{
              background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
              border: 'none', borderRadius: '50px', padding: '12px 32px',
              fontSize: '16px', fontWeight: 'bold', color: 'white', cursor: 'pointer'
            }}>Try Again</button>
          </div>
        )}

        {/* Question */}
        {question && !loading && !error && (
          <>
            {/* Chapter + Type Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              <span style={{ background: 'rgba(56,189,248,0.2)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', color: '#38bdf8' }}>
                🔬 Class {question.class} — {question.chapter}
              </span>
              <span style={{ background: 'rgba(129,140,248,0.2)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', color: '#818cf8' }}>
                {question.questionType}
              </span>
            </div>

            {/* Question Box */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '28px', marginBottom: '20px'
            }}>
              <p style={{ fontSize: '11px', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Question
              </p>
              <p style={{ fontSize: '19px', lineHeight: '1.7', margin: 0 }}>{question.question}</p>
            </div>

            {/* Options */}
            <div style={{ marginBottom: '16px' }}>
              {question.options.map((opt, i) => (
                <button key={i} onClick={() => handleSelect(i)} style={getOptionStyle(i)}>
                  <span style={{ color: '#64748b', marginRight: '12px', fontWeight: 'bold' }}>
                    {['A', 'B', 'C', 'D'][i]}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {answered && (
              <div style={{
                background: selected === question.correct ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                border: `1px solid ${selected === question.correct ? '#22c55e' : '#ef4444'}`,
                borderRadius: '12px', padding: '20px', marginBottom: '16px'
              }}>
                <p style={{ margin: '0 0 8px', fontWeight: 'bold', fontSize: '16px', color: selected === question.correct ? '#22c55e' : '#ef4444' }}>
                  {selected === question.correct ? '✅ Correct!' : `❌ Incorrect! Correct answer: ${['A', 'B', 'C', 'D'][question.correct]}`}
                </p>
                <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  💡 {question.explanation}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  📖 {question.ncertLine}
                </p>
              </div>
            )}

            {/* Next Button */}
            {answered && (
              <button onClick={fetchQuestion} style={{
                width: '100%',
                background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                border: 'none', borderRadius: '12px', padding: '16px',
                fontSize: '16px', fontWeight: 'bold', color: 'white', cursor: 'pointer'
              }}>
                Next Question → (AI Generated)
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}