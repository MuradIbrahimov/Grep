import * as fs from "fs";
import { matchPattern } from "./patternMatcher.js";

const args = process.argv;

if (args[2] !== "-E") {
  console.error("Expected first argument to be '-E'");
  process.exit(1);
}

const pattern = args[3];
const filenames = args.slice(4)
let lines: string[] = [];
let matched = false;

function processLines(lines: string[], filename?: string) {
  for (const line of lines) {
    if (matchPattern(line, pattern)) {
      if (filename && filenames.length > 1) {
        console.log(`${filename}:${line}`);
      } else {
        console.log(line);
      }
      matched = true;
    }
  }
}

if (filenames.length === 0) {
  const stdinText = await Bun.stdin.text();
  const lines = stdinText.split("\n");
  processLines(lines);
} else {
  for (const filename of filenames) {
    const lines = fs.readFileSync(filename, "utf-8").split("\n");
    processLines(lines, filename);
  }
}

process.exit(matched ? 0 : 1);
