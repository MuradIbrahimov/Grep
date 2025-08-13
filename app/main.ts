import * as fs from "fs";
import * as path from "path";
import { matchPattern } from "./patternMatcher.js";

const args = process.argv;

if (args[2] !== "-r" && args[2] !== "-E") {
  console.error("Expected first argument to be '-r' or '-E'");
  process.exit(1);
}

let recursive = false;
let patternArgIndex = 2;
if (args[2] === "-r") {
  recursive = true;
  patternArgIndex = 3;
}

const pattern = args[patternArgIndex + 1];
const paths = args.slice(patternArgIndex + 2);
let lines: string[] = [];
let matched = false;

function getFiles(p:string):string[]{
  let results: string[]=[];
  const stats= fs.statSync(p);
  if (stats.isFile()) {
    results.push(p);
  } else if (stats.isDirectory()) {
   const entries = fs.readdirSync(p);
   for (const entry of entries){
    results.push(...getFiles(path.join(p, entry)));
   }
    }
return results;
  }



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


if (paths.length === 0) {
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
