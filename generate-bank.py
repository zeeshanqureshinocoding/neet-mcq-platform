import google.generativeai as genai
import json
import time
import random
import os

# Your Gemini API key
GEMINI_API_KEY = "AIzaSyCZWKCzufarZE0bgPmKVUK5CD6SQaT_CXI"

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

# Load NCERT content
with open(r"C:\Users\qures\Desktop\NCERT-PDFs\biology_ncert.json", "r", encoding="utf-8") as f:
    ncert_data = json.load(f)

chapter_weights = {
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
}

question_types = [
    {
        "type": "direct_fact",
        "label": "Direct Fact MCQ",
        "prompt": "Generate a DIRECT FACT based MCQ. Test straightforward memory. Example: 'Which of the following is correct about [topic]?'",
        "weight": 30
    },
    {
        "type": "sequence",
        "label": "Sequence/Order MCQ",
        "prompt": "Generate a SEQUENCE/ORDER MCQ. Students arrange steps in correct order. Options like 'A→B→C→D'. Example: 'The correct sequence of [process] is:'",
        "weight": 12
    },
    {
        "type": "assertion_reason",
        "label": "Assertion-Reason",
        "prompt": """Generate an ASSERTION-REASON question.
Format EXACTLY:
Assertion (A): [statement]
Reason (R): [statement]
Options MUST be exactly:
A) Both A and R are true and R is the correct explanation of A
B) Both A and R are true but R is NOT the correct explanation of A
C) A is true but R is false
D) A is false but R is true""",
        "weight": 15
    },
    {
        "type": "match_column",
        "label": "Match the Column",
        "prompt": """Generate a MATCH THE COLUMN question.
Format:
Match Column I with Column II:
Column I / Column II
A. [item] / i. [match]
B. [item] / ii. [match]
C. [item] / iii. [match]
D. [item] / iv. [match]
Options: matching combos like 'A-ii, B-iii, C-i, D-iv'""",
        "weight": 13
    },
    {
        "type": "multi_statement",
        "label": "Multi-Statement MCQ",
        "prompt": """Generate a MULTI-STATEMENT question.
Format:
Consider the following statements:
i. [statement]
ii. [statement]
iii. [statement]
Which of the above statements is/are correct?
Options: 'i and ii only', 'ii and iii only', 'i only', 'All of the above'""",
        "weight": 15
    },
    {
        "type": "hots",
        "label": "HOTS Question",
        "prompt": "Generate a HIGH ORDER THINKING SKILL (HOTS) question. Test DEEP UNDERSTANDING and APPLICATION. Still strictly from NCERT text. Example: 'If [condition], what would happen to [process]?'",
        "weight": 10
    },
    {
        "type": "diagram_based",
        "label": "Diagram/Process Based",
        "prompt": "Generate a DIAGRAM/PROCESS BASED question about a biological process or structure from the text.",
        "weight": 5
    },
]

def select_weighted_chapter():
    weighted = []
    for chapter in ncert_data:
        weight = chapter_weights.get(chapter["chapter"], 3)
        for _ in range(weight):
            weighted.append(chapter)
    return random.choice(weighted)

def select_weighted_type():
    total = sum(t["weight"] for t in question_types)
    rand = random.random() * total
    for t in question_types:
        rand -= t["weight"]
        if rand <= 0:
            return t
    return question_types[-1]

def get_excerpt(text):
    paragraphs = [p for p in text.split('\n') if len(p.strip()) > 100]
    if not paragraphs:
        sentences = [s for s in text.split('.') if len(s.strip()) > 50]
        start = random.randint(0, max(0, len(sentences) - 8))
        return '.'.join(sentences[start:start+8]).strip()
    start = random.randint(0, max(0, len(paragraphs) - 3))
    return '\n'.join(paragraphs[start:start+3]).strip()

def generate_question():
    chapter = select_weighted_chapter()
    qtype = select_weighted_type()
    excerpt = get_excerpt(chapter["text"])

    prompt = f"""You are an expert NEET exam question generator.

NCERT Source Text (Class {chapter['class']}, Chapter: "{chapter['chapter']}"):
\"\"\"
{excerpt}
\"\"\"

TASK: {qtype['prompt']}

STRICT RULES:
1. Question must be based ONLY on the above NCERT text
2. Every word must be traceable to NCERT
3. No outside information
4. Options must be clearly distinct
5. Only ONE correct answer
6. Match NEET exam difficulty and style

Respond in EXACT JSON format only — no extra text, no markdown:
{{
  "question": "complete question here",
  "options": ["option A", "option B", "option C", "option D"],
  "correct": 0,
  "explanation": "explanation referencing NCERT text",
  "chapter": "{chapter['chapter']}",
  "class": {chapter['class']},
  "subject": "Biology",
  "questionType": "{qtype['label']}",
  "ncertLine": "specific NCERT line this is based on"
}}

correct = index of correct answer (0=A, 1=B, 2=C, 3=D)"""

    response = model.generate_content(prompt)
    text = response.text.strip()
    clean = text.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)

# Output file
output_path = r"public\question-bank.json"
os.makedirs("public", exist_ok=True)

# Load existing questions if any
if os.path.exists(output_path):
    with open(output_path, "r", encoding="utf-8") as f:
        all_questions = json.load(f)
    print(f"Loaded {len(all_questions)} existing questions")
else:
    all_questions = []

# Generate questions
TARGET = 50  # Generate 50 questions per run
SUCCESS = 0
FAIL = 0

print(f"\nGenerating {TARGET} questions...\n")

for i in range(TARGET):
    try:
        print(f"[{i+1}/{TARGET}] Generating...", end=" ")
        q = generate_question()
        all_questions.append(q)
        SUCCESS += 1
        print(f"✅ {q['chapter']} — {q['questionType']}")

        # Save after every question
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(all_questions, f, ensure_ascii=False, indent=2)

        # Wait to respect rate limits (3 seconds between requests)
        time.sleep(3)

    except Exception as e:
        FAIL += 1
        print(f"❌ Error: {e}")
        time.sleep(10)  # Wait longer on error

print(f"\n✅ Done! Generated {SUCCESS} questions, {FAIL} failed")
print(f"📁 Total questions in bank: {len(all_questions)}")
print(f"💾 Saved to: {output_path}")