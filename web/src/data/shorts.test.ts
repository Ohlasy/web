import assert from "node:assert";
import test from "node:test";
import { decodeShort, decodeShorts, getAllShorts, parseYouTubeId } from "./shorts";

test("Parse YouTube ID from various URL forms", () => {
  assert.equal(
    parseYouTubeId("https://www.youtube.com/shorts/n_6CEdRoh7I"),
    "n_6CEdRoh7I",
  );
  assert.equal(
    parseYouTubeId("https://youtu.be/n_6CEdRoh7I"),
    "n_6CEdRoh7I",
  );
  assert.equal(
    parseYouTubeId("https://www.youtube.com/watch?v=n_6CEdRoh7I"),
    "n_6CEdRoh7I",
  );
});

test("Parsing throws on unparseable URLs", () => {
  // Not a valid URL at all
  assert.throws(() => parseYouTubeId("not a url"));
  // Valid URL but no recognizable video ID
  assert.throws(() => parseYouTubeId("https://www.youtube.com/"));
  assert.throws(() => parseYouTubeId("https://youtu.be/"));
  assert.throws(() => parseYouTubeId("https://www.youtube.com/watch?foo=bar"));
});

test("Decode a single short into its video ID", () => {
  assert.deepEqual(
    decodeShort({ url: "https://www.youtube.com/shorts/n_6CEdRoh7I" }),
    { id: "n_6CEdRoh7I" },
  );
});

test("Decode a list of shorts", () => {
  assert.deepEqual(
    decodeShorts([
      { url: "https://www.youtube.com/shorts/n_6CEdRoh7I" },
      { url: "https://youtu.be/FgTlWgi91Ko" },
    ]),
    [{ id: "n_6CEdRoh7I" }, { id: "FgTlWgi91Ko" }],
  );
});

test("Decoding fails on an invalid short URL", () => {
  assert.throws(() => decodeShort({ url: "https://example.com/foo" }));
});

test("Loading the shorts file resolves", () => {
  assert.doesNotReject(getAllShorts());
});
