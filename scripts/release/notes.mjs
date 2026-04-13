#!/usr/bin/env node
import { readFileSync } from "fs";
import { execSync } from "child_process";

const changelog = readFileSync("docs/v4-changelog.md", "utf8");
const summary = changelog.split("\n").slice(0, 30).join("\n"); // first 30 lines
console.log(summary);
console.log("\n## Commits since v3.25.0\n");
const log = execSync("git log v3.25.0..HEAD --oneline").toString();
console.log(log);
