// main.ts
import { matchPattern } from './patternMatcher.js';

// Parse command line arguments
const args = process.argv;
const pattern = args[3];

// Read input from stdin
const inputLine: string = (await Bun.stdin.text()).trim();

// Validate arguments
if (args[2] !== "-E") {
  console.log("Expected first argument to be '-E'");
  process.exit(1);
}

console.error("Logs from your program will appear here!");

// Match pattern and exit with appropriate code
if (matchPattern(inputLine, pattern)) {
  process.exit(0);
} else {
  process.exit(1);
}