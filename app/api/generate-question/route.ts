import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const chapterWeights: Record<string, number> = {
  "Molecular Basis of Inheritance": 10,
  "Principles of Inheritance and Variation": 9,
  "Human Reproduction": 8,
  "Sexual Reproduction in Flowering Plants": 8,
  "Evolution": 8,
  "Human Health and Disease": 7,
  "Neural Control and Coordination": 7,
  "Chemical Coordination and Integration": 7,
  "Organisms and Populations": 7,
  "Ecosystem": 7,
  "Reproductive Health": 7,
  "Cell The Unit of Life": 8,
  "Biomolecules": 7,
  "Cell Cycle and Cell Division": 7,
  "Photosynthesis in Higher Plants": 6,
  "Respiration in Plants": 6,
  "Body Fluids and Circulation": 6,
  "Excretory Products and their Elimination": 6,
  "Biotechnology Principles and Processes": 6,
  "Biotechnology and its Applications": 6,
  "Biodiversity and Conservation": 6,
  "Plant Kingdom": 6,
  "Animal Kingdom": 6,
  "Digestion and Absorption": 5,
  "Breathing and Exchange of Gases": 5,
  "Locomotion and Movement": 5,
  "Morphology of Flowering Plants": 5,
  "Biological Classification": 5,
  "Microbes in Human Welfare": 5,
  "Strategies for Enhancement in Food Production": 5,
  "The Living World": 4,
  "Anatomy of Flowering Plants": 4,
  "Structural Organisation in Animals": 4,
  "Mineral Nutrition": 4,
  "Plant Growth and Development": 4,
  "Reproduction in Organisms": 6,
};

const questionTypes = [
  {
    type: "direct_fact",
    label: "Direct Fact MCQ",
    prompt: `Generate a DIRECT FACT based MCQ. Test straightforward memory and understanding.
Example style: "Which of the following is correct about [topic]?"`,
    weight: 30
  },
  {
    type: "sequence",
    label: "Sequence/Order MCQ",
    prompt: `Generate a SEQUENCE/ORDER MCQ where students arrange steps or events in correct order.
Options should be sequences like "A→B→C→D".
Example style: "The correct sequence of [process] is:"`,
    weight: 12
  },
  {
    type: "assertion_reason",
    label: "Assertion-Reason",
    prompt: `Generate an ASSERTION-REASON question.
Format EXACTLY:
"Assertion (A): [statement]
Reason (R): [statement]"
Options MUST always be:
A) Both A and R are true and R is the correct explanation of A
B) Both A and R are true but R is NOT the correct explanation of A
C) A is true but R is false
D) A is false but R is true`,
    weight: 15
  },
  {
    type: "match_column",
    label: "Match the Column",
    prompt: `Generate a MATCH THE COLUMN question.
Format:
"Match Column I with Column II:
Column I / Column II
A. [item] / i. [match]
B. [item] / ii. [match]
C. [item] / iii. [match]
D. [item] / iv. [match]"
Options: matching combos like "A-ii, B-iii, C-i, D-iv"`,
    weight: 13
  },
  {
    type: "multi_statement",
    label: "Multi-Statement MCQ",
    prompt: `Generate a MULTI-STATEMENT question.
Format:
"Consider the following statements:
i. [statement]
ii. [statement]
iii. [statement]
Which of the above statements is/are correct?"
Options: "i and ii only", "ii and iii only", "i only", "All of the above"`,
    weight: 15
  },
  {
    type: "hots",
    label: "HOTS Question",
    prompt: `Generate a HIGH ORDER THINKING SKILL (HOTS) question.
Test DEEP UNDERSTANDING and APPLICATION — not just memory.
Still strictly based on the NCERT text provided.
Example: "If [condition], what would happen to [process]?"`,
    weight: 10
  },
  {
    type: "diagram_based",
    label: "Diagram/Process Based",
    prompt: `Generate a DIAGRAM/PROCESS BASED question about a biological process or structure.
Example: "In the process of [topic], which step correctly describes [part]?"`,
    weight: 5
  },
];

function selectWeightedRandom<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let rand = Math.random() * total;
  for (const item of items) {
    rand -= item.weight;
    if (rand <= 0) return item;
  }
  return items[items.length - 1];
}

function selectWeightedChapter(data: any[]): any {
  const weighted: any[] = [];
  for (const chapter of data) {
    const weight = chapterWeights[chapter.chapter] || 3;
    for (let i = 0; i < weight; i++) weighted.push(chapter);
  }
  return weighted[Math.floor(Math.random() * weighted.length)];
}

function getRandomExcerpt(text: string): string {
  const paragraphs = text.split('\n').filter(p => p.trim().length > 100);
  if (paragraphs.length === 0) {
    const sentences = text.split('.').filter(s => s.trim().length > 50);
    const start = Math.floor(Math.random() * Math.max(1, sentences.length - 8));
    return sentences.slice(start, start + 8).join('.').trim();
  }
  const start = Math.floor(Math.random() * Math.max(1, paragraphs.length - 3));
  return paragraphs.slice(start, start + 3).join('\n').trim();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedChapter = searchParams.get('chapter');
    const requestedType = searchParams.get('type');

    const jsonPath = 'C:\\Users\\qures\\Desktop\\NCERT-PDFs\\biology_ncert.json';
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const chapter = requestedChapter
      ? (data.find((c: any) => c.chapter === requestedChapter) || selectWeightedChapter(data))
      : selectWeightedChapter(data);

    const questionType = requestedType
      ? (questionTypes.find(t => t.type === requestedType) || selectWeightedRandom(questionTypes))
      : selectWeightedRandom(questionTypes);

    const excerpt = getRandomExcerpt(chapter.text);

    const prompt = `You are an expert NEET exam question generator with deep knowledge of NCERT Biology.

NCERT Source Text (Class ${chapter.class}, Chapter: "${chapter.chapter}"):
"""
${excerpt}
"""

TASK: ${questionType.prompt}

STRICT RULES:
1. Question must be based ONLY on the above NCERT text
2. Every word must be traceable to NCERT
3. No outside information
4. Options must be clearly distinct
5. Only ONE correct answer
6. Match NEET exam difficulty and style

Respond in EXACT JSON format only — no extra text, no markdown backticks:
{
  "question": "complete question here",
  "options": ["option A", "option B", "option C", "option D"],
  "correct": 0,
  "explanation": "explanation referencing NCERT text",
  "chapter": "${chapter.chapter}",
  "class": ${chapter.class},
  "subject": "Biology",
  "questionType": "${questionType.label}",
  "ncertLine": "specific NCERT line this is based on"
}

correct = index of correct answer (0=A, 1=B, 2=C, 3=D)`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const questionData = JSON.parse(cleanJson);

    return NextResponse.json({
      success: true,
      question: questionData,
      meta: {
        questionType: questionType.label,
        chapter: chapter.chapter,
        class: chapter.class
      }
    });

  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}