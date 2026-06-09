#!/usr/bin/env node
import { slugify } from "./index.js";

const input = process.argv.slice(2).join(" ");
if (!input) {
  console.error("usage: widget-utils <text to slugify>");
  process.exit(1);
}
console.log(slugify(input));
