import fitz  # pymupdf
import os
import json

chapter_names_11 = {
    "kebo101": "The Living World",
    "kebo102": "Biological Classification",
    "kebo103": "Plant Kingdom",
    "kebo104": "Animal Kingdom",
    "kebo105": "Morphology of Flowering Plants",
    "kebo106": "Anatomy of Flowering Plants",
    "kebo107": "Structural Organisation in Animals",
    "kebo108": "Cell The Unit of Life",
    "kebo109": "Biomolecules",
    "kebo110": "Cell Cycle and Cell Division",
    "kebo111": "Photosynthesis in Higher Plants",
    "kebo112": "Respiration in Plants",
    "kebo113": "Plant Growth and Development",
    "kebo114": "Breathing and Exchange of Gases",
    "kebo115": "Body Fluids and Circulation",
    "kebo116": "Excretory Products and their Elimination",
    "kebo117": "Locomotion and Movement",
    "kebo118": "Neural Control and Coordination",
    "kebo119": "Chemical Coordination and Integration",
}

chapter_names_12 = {
    "lebo101": "Reproduction in Organisms",
    "lebo102": "Sexual Reproduction in Flowering Plants",
    "lebo103": "Reproductive Health",
    "lebo104": "Principles of Inheritance and Variation",
    "lebo105": "Molecular Basis of Inheritance",
    "lebo106": "Evolution",
    "lebo107": "Human Health and Disease",
    "lebo108": "Microbes in Human Welfare",
    "lebo109": "Biotechnology Principles and Processes",
    "lebo110": "Biotechnology and its Applications",
    "lebo111": "Organisms and Populations",
    "lebo112": "Ecosystem",
    "lebo113": "Biodiversity and Conservation",
}

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()

def process_folder(folder_path, chapter_names, class_num):
    results = []
    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith(".pdf"):
            name = filename.replace(".pdf", "")
            if name in chapter_names:
                chapter = chapter_names[name]
                pdf_path = os.path.join(folder_path, filename)
                print(f"Extracting: {filename} → {chapter}")
                text = extract_text_from_pdf(pdf_path)
                results.append({
                    "file": filename,
                    "class": class_num,
                    "subject": "Biology",
                    "chapter": chapter,
                    "text": text
                })
            else:
                print(f"Skipping: {filename} (not in chapter list)")
    return results

# ── CHANGE THESE PATHS IF YOUR FOLDERS ARE NAMED DIFFERENTLY ──
folder_11   = r"C:\Users\qures\Desktop\NCERT-PDFs\class 11th bio"
folder_12   = r"C:\Users\qures\Desktop\NCERT-PDFs\class 12th bio"
output_file = r"C:\Users\qures\Desktop\NCERT-PDFs\biology_ncert.json"

print("Starting extraction...\n")
all_data = []
all_data += process_folder(folder_11, chapter_names_11, 11)
all_data += process_folder(folder_12, chapter_names_12, 12)

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print(f"\n✅ Done! Extracted {len(all_data)} chapters")
print(f"📁 Saved to: {output_file}")