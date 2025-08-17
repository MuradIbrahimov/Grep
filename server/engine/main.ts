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


if (paths.length === 0) {
  const stdinText = await Bun.stdin.text();
  const lines = stdinText.split("\n");
  let matched = false;
  for (const line of lines) {
    if (matchPattern(line, pattern)) {
      console.log(line);
      matched = true;
    }
  }
  process.exit(matched ? 0 : 1);
}

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


  let allFiles: string[] = [];
    for (const p of paths) {
      if (recursive) {
        allFiles.push(...getFiles(p));
      } else {
        allFiles.push(p);
      }
}

function processLines(lines: string[], filenames: string) {
  for (const line of lines) {
    if (matchPattern(line, pattern)) {
      if (allFiles.length > 1) {        
        console.log(`${filenames}:${line}`);
      } else {
        console.log(line);
      }
      matched = true;
    }
  }
}

for (const file of allFiles){
  const lines = fs.readFileSync(file, "utf-8").split("\n");
  processLines(lines, file);
}
process.exit(matched ? 0 : 1);
