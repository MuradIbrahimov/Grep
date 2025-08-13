# Regex Engine – A Custom Grep-like Tool

A fully custom-built regular expression engine written from scratch using **tokenization** and **Abstract Syntax Trees (AST)** — no reliance on existing regex libraries.  
Supports advanced features like **nested groups**, **backreferences**, **multi-line search**, and **recursive directory scanning**, making it function like a lightweight `grep` alternative.

---

## ✨ Features

- **Custom Regex Parser**
  - Built tokenizer to break down patterns into tokens.
  - AST-based execution for flexibility and maintainability.
- **Advanced Pattern Matching**
  - **Nested Groups** – e.g., `((\w+)\s+(\d+))` for complex pattern composition.
  - **Backreferences** – e.g., `(cat) \1` matches `cat cat`.
  - **Escaped Shorthand Patterns**:
    - `\d` – digits `[0-9]`
    - `\w` – word characters `[A-Za-z0-9_]`
  - **Anchors** – `^` and `$` for start/end of line.
  - **Quantifiers** – `*`, `+`, `?`
  - **Character Classes** – `[abc]`, `[^abc]`, ranges.
- **Search Capabilities**
  - **Simple input and pattern search**  
  - **Single file search**  
  - **Multi-file search**  
  - **Recursive directory search** with file filtering
- **CLI Tool**
  - Works like `grep` for fast terminal searches.

---

## 🛠 Architecture Overview

1. **Tokenizer (Lexer)**  
   Converts regex patterns into token streams (e.g., `(`, `\w+`, `)`, `*`, `\1`).

2. **AST Builder**  
   Constructs an abstract syntax tree from the token stream for structured evaluation.

3. **Pattern Matcher**  
   Executes the AST against input text using a backtracking algorithm.

4. **CLI Interface**  
   - Takes pattern + file(s) as arguments.  
   - Supports options like recursive search and multiline matching.

---

## 🚀 Example Usage

```bash
# Search for lines containing 'apple' in file.txt
./regex_engine -E "apple" file.txt

# Match words that start and end with the same word
./regex_engine -E "^(\w+) starts and ends with \1$" file.txt

# Recursive search for 'TODO' in a project folder
./regex_engine -r -E "TODO" ./src

# Find numbers followed by words
./regex_engine -E "(\d+)\s+(\w+)" notes.txt
```

---

## 📊 Performance
While not as optimized as `grep`, it demonstrates:
- **Efficient matching** for moderate file sizes
- Structured design for adding new regex features
---

## 🎯 Why This Project Matters
Most developers use existing regex libraries; this project shows **deep understanding of parsing, compiler theory, and algorithm design**:
- Lexer & parser implementation
- Tree-based pattern evaluation
- File I/O optimization for large searches
- Real-world CLI integration

---

## 📂 Project Structure

```
regex_engine/
├── app/
│   ├── tokenizer.ts
│   ├── main.ts
│   ├── matchAST.ts
│   └── parseAlternatives.ts
│   └── patternMatcher.ts
│ 
├── testFiles/
│   ├── test.txt
│
│
├── UI
├── README.md
└── Etc

```

---

## 🔮 Future Improvements
- Add **lookahead/lookbehind** support
- Implement `{m,n}` quantifiers
- Optimize for large file streaming
- Add **color highlighting** like `grep --color`
- Performance test

---

## 📜 License
MIT License – Feel free to fork, modify, and use for educational purposes.

---

Murad İbrahimov – 2025
