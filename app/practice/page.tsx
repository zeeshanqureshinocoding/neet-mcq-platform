'use client';
import { useState } from 'react';

const sampleQuestions = [
  {
    id: 1,
    subject: 'Biology',
    chapter: 'The Living World',
    question: 'Which of the following is NOT a characteristic of living organisms?',
    options: ['Growth and reproduction', 'Response to stimuli', 'Crystallization', 'Cellular organization'],
    correct: 2,
    ncertLine: 'NCERT Class 11 Biology, Chapter 1 — The Living World'
  },
  {
    id: 2,
    subject: 'Biology',
    chapter: 'The Living World',
    question: 'Taxonomy is the branch of science that deals with:',
    options: ['Study of fossils', 'Identification, nomenclature and classification of organisms', 'Study of cell structure', 'Study of heredity'],
    correct: 1,
    ncertLine: 'NCERT Class 11 Biology, Chapter 1 — The Living World'
  },
  {
    id: 3,
    subject: 'Biology',
    chapter: 'The Living World',
    question: 'The binomial nomenclature system was introduced by:',
    options: ['Charles Darwin', 'Gregor Mendel', 'Carolus Linnaeus', 'Robert Hooke'],
    correct: 2,
    ncertLine: 'NCERT Class 11 Biology, Chapter 1 — The Living World'
  }
];

export default function Practice() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = sampleQuestions[current];

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= sampleQuestions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const getOptionStyle = (index: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%', padding: '16px 20px', borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
      color: 'white', fontSize: '16px', textAlign: 'left',
      cursor: answered ? 'default' : 'pointer', marginBottom: '12px'
    };
    if (!answered) return base;
    if (index === q.correct) return { ...base, background: 'rgba(34,197,94,0.3)', border: '1px solid #22c55e' };
    if (index === selected) return { ...base, background: 'rgba(239,68,68,0.3)', border: '1px solid #ef4444' };
    return base;
  };

  if (finished) return (
    <main style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', color: 'white'
    }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎯</div>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Session Complete!</h1>
        <p style={{ fontSize: '24px', color: '#94a3b8', marginBottom: '30px' }}>
          You scored <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{score}</span> out of <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{sampleQuestions.length}</span>
        </p>
        <button onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); }}
          style={{
            background: 'linear-gradient(90deg, #38bdf8, #818cf8)', border: 'none',
            borderRadius: '50px', padding: '14px 40px', fontSize: '16px',
            fontWeight: 'bold', color: 'white', cursor: 'pointer'
          }}>Try Again</button>
      </div>
    </main>
  );

  return (
    <main style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', color: 'white', padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '700px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <span style={{ background: 'rgba(56,189,248,0.2)', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', color: '#38bdf8' }}>
            🔬 {q.subject} — {q.chapter}
          </span>
          <span style={{ color: '#64748b', fontSize: '14px', paddingTop: '6px' }}>{current + 1} / {sampleQuestions.length}</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '6px', marginBottom: '30px' }}>
          <div style={{
            background: 'linear-gradient(90deg, #38bdf8, #818cf8)', height: '6px', borderRadius: '10px',
            width: `${((current + 1) / sampleQuestions.length) * 100}%`
          }} />
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '30px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Question {current + 1}</p>
          <p style={{ fontSize: '20px', lineHeight: '1.6', margin: 0 }}>{q.question}</p>
        </div>
        <div>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(i)} style={getOptionStyle(i)}>
              <span style={{ color: '#64748b', marginRight: '12px', fontWeight: 'bold' }}>{['A', 'B', 'C', 'D'][i]}.</span>
              {opt}
            </button>
          ))}
        </div>
        {answered && (
          <div style={{
            background: selected === q.correct ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${selected === q.correct ? '#22c55e' : '#ef4444'}`,
            borderRadius: '12px', padding: '16px', marginBottom: '20px'
          }}>
            <p style={{ margin: '0 0 4px', fontWeight: 'bold', color: selected === q.correct ? '#22c55e' : '#ef4444' }}>
              {selected === q.correct ? '✅ Correct!' : '❌ Incorrect!'}
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>📖 {q.ncertLine}</p>
          </div>
        )}
        {answered && (
          <button onClick={handleNext} style={{
            width: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
            border: 'none', borderRadius: '12px', padding: '16px',
            fontSize: '16px', fontWeight: 'bold', color: 'white', cursor: 'pointer'
          }}>
            {current + 1 >= sampleQuestions.length ? 'See Results 🎯' : 'Next Question →'}
          </button>
        )}
      </div>
    </main>
  );
}