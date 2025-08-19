import type { FC } from "react";
import { Navbar, Footer } from "../components";

const patternCategories = [
  {
    title: "📍 Anchors",
    patterns: [
      { regex: "^", description: "Matches start of line" },
      { regex: "$", description: "Matches end of line" },
    ],
  },
  {
    title: "🔤 Character Classes",
    patterns: [
      { regex: ".", description: "Matches any character except newline" },
      { regex: "\\d", description: "Matches any digit (0-9)" },
      { regex: "\\w", description: "Matches word character (letters, digits, _)" },
    ],
  },
  {
    title: "➕ Quantifiers",
    patterns: [
      { regex: "*", description: "0 or more repetitions" },
      { regex: "+", description: "1 or more repetitions" },
      { regex: "?", description: "0 or 1 repetition (optional)" },
    ],
  },
  {
    title: "🎯 Groups & Alternation",
    patterns: [
      { regex: "(...)", description: "Capturing group" },
      { regex: "|", description: "Alternation (OR)" },
    ],
  },
];

const Patterns: FC = () => {
  return (
    <main className="bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          📚 Supported Regex Patterns
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {patternCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800"
            >
              <h2 className="text-xl font-semibold text-blue-400 mb-4">
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.patterns.map((p, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-800 rounded border border-slate-700"
                  >
                    <code className="text-emerald-400 font-mono text-lg block">
                      {p.regex}
                    </code>
                    <p className="text-slate-400 text-sm">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-slate-500 text-sm">
          ⚡ More advanced patterns coming soon...
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Patterns;
