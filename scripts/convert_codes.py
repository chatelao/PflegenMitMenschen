import pandas as pd
import json
import os
import glob
import re

DOCS_DIR = "docs"
OUTPUT_FILE = os.path.join(DOCS_DIR, "codes.json")

def find_file(pattern):
    files = glob.glob(os.path.join(DOCS_DIR, "*.xlsx"))
    for f in files:
        if pattern in f:
            return f
    return None

def extract_pauschalen(file_path):
    print(f"Processing Pauschalen: {file_path}")
    try:
        df = pd.read_excel(file_path, sheet_name="Tarifkatalog", header=None)
    except Exception as e:
        print(f"Error reading excel: {e}")
        return []

    codes = []

    for i, row in df.iterrows():
        if i < 5: continue

        code = row[1]
        desc = row[2]
        tp = row[4]

        if pd.isna(code):
            continue

        code_str = str(code).strip()

        # Pauschalen codes seem to always start with 'C' (e.g. C12.10A)
        # We explicitly ignore headers like 'I', 'Prae-Cap', 'Fehler-Fallgruppen', 'Cap...'
        if not code_str.startswith("C"):
            continue

        # Also filter if it contains spaces (just in case)
        if " " in code_str:
            continue

        try:
            tp_val = float(tp)
        except:
            tp_val = None

        codes.append({
            "code": code_str,
            "description": str(desc).strip() if pd.notna(desc) else "",
            "tax_points": tp_val,
            "type": "pauschale"
        })
    return codes

def extract_tardoc(file_path):
    print(f"Processing TARDOC: {file_path}")
    try:
        df = pd.read_excel(file_path, sheet_name="Tarifpositionen", header=4)
    except Exception as e:
        print(f"Error reading excel: {e}")
        return []

    df.columns = df.columns.astype(str).str.strip().str.replace('\n', '')

    if 'L-Nummer' not in df.columns:
        print(f"Error: 'L-Nummer' not found in columns: {df.columns}")
        return []

    codes = []

    for _, row in df.iterrows():
        code = row['L-Nummer']
        desc = row['Bezeichnung']

        if pd.isna(code):
            continue

        code_str = str(code).strip()

        # TARDOC format: XX.XX.XXXX
        if not re.match(r"^[A-Z]{2}\.\d{2}\.\d{4}$", code_str):
            continue

        codes.append({
            "code": code_str,
            "description": str(desc).strip() if pd.notna(desc) else "",
            "type": "tardoc"
        })
    return codes

def main():
    if not os.path.exists(DOCS_DIR):
        print(f"Directory {DOCS_DIR} does not exist.")
        return

    pauschalen_file = find_file("Pauschalen")
    tardoc_file = find_file("TARDOC")

    all_data = []

    if pauschalen_file:
        all_data.extend(extract_pauschalen(pauschalen_file))
    else:
        print("No Pauschalen file found.")

    if tardoc_file:
        all_data.extend(extract_tardoc(tardoc_file))
    else:
        print("No TARDOC file found.")

    with open(OUTPUT_FILE, "w", encoding='utf-8') as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)

    print(f"Generated {OUTPUT_FILE} with {len(all_data)} entries.")

if __name__ == "__main__":
    main()
