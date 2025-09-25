import assert from "node:assert";
import test from "node:test";
import { getUrlPathFragmentsForFileSystemPath } from "./server-utils";

test("Map filesystem path to URL", () => {
  const path = "/somewhere/content/articles/2022/3/2022-3-9-kultura.md";
  assert.deepEqual(getUrlPathFragmentsForFileSystemPath(path), [
    "2022",
    "03",
    "kultura.html",
  ]);
});
