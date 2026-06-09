import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify, clamp } from "../dist/index.js";

test("slugify normalizes text", () => {
  assert.equal(slugify("  Héllo, World!  "), "hello-world");
});

test("clamp keeps values in range", () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-3, 0, 10), 0);
  assert.equal(clamp(42, 0, 10), 10);
});

test("clamp rejects an inverted range", () => {
  assert.throws(() => clamp(1, 10, 0), RangeError);
});
