// server.ts
import express from 'express';
import cors from 'cors';
import { matchPattern } from '../engine/patternMatcher';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); 

// Types
interface MatchRequest {
  pattern: string;
  content: string;
  // Remove flags since your engine doesn't support them yet
}

interface MatchResult {
  matches: Array<{
    text: string;
    index: number;
    line: number;
    matchedPortion: string; // What part actually matched
  }>;
  totalMatches: number;
  success: boolean;
  error?: string;
}

function processMatches(content: string, pattern: string): MatchResult {
  try {
    const lines = content.split('\n');
    const matches: any[] = [];
    let totalMatches = 0;

    lines.forEach((line, lineIndex) => {
      if (matchPattern(line, pattern)) {
        matches.push({
          text: line.trim(), 
          index: 0, 
          line: lineIndex + 1,
          matchedPortion: line.trim() 
        });
        totalMatches++;
      }
    });

    return {
      matches,
      totalMatches,
      success: true
    };
  } catch (error) {
    return {
      matches: [],
      totalMatches: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Pattern matching failed'
    };
  }
}

app.post('/api/match', (req, res) => {
  const { pattern, content }: MatchRequest = req.body;

  if (!pattern) {
    return res.status(400).json({
      success: false,
      error: 'Pattern is required'
    });
  }

  if (!content) {
    return res.status(400).json({
      success: false,
      error: 'Content is required'
    });
  }

  const result = processMatches(content, pattern);
  res.json(result);
});

app.post('/api/validate', (req, res) => {
  const { pattern } = req.body;

  try {
    matchPattern('', pattern);
    res.json({ valid: true });
  } catch (error) {
    res.json({ 
      valid: false, 
      error: error instanceof Error ? error.message : 'Invalid pattern for custom engine'
    });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Regex Engine API running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints:`);
  console.log(`   POST /api/match - Test regex pattern`);
  console.log(`   POST /api/validate - Validate pattern`);
});

export default app;