import * as fs from "fs";
import { matchPattern } from "./patternMatcher.js";

const args = process.argv;

if (args[2] !== "-E") {
  console.error("Expected first argument to be '-E'");
  process.exit(1);
}

const pattern = args[3];
const filename = args[4];
let lines: string[] = [];

if (filename) {
  lines = fs.readFileSync(filename, "utf-8").split("\n");
} else {
  const stdinText = await Bun.stdin.text();
  lines = stdinText.split("\n");
}

let matched = false;

for (const line of lines) {
  if (matchPattern(line, pattern)) {
    console.log(line); 
    matched = true;
  }
}

if (!matched) {
}
process.exit(matched ? 0 : 1);
