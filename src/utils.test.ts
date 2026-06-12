import assert from "node:assert";
import test from "node:test";
import {
  getResizedImageUrl,
  looksLikeBotEmail,
  stripMarkdown,
  tilde,
} from "./utils";

test("Image resizing", () => {
  assert.equal(
    getResizedImageUrl("https://i.ohlasy.info/i/53173baa.jpg", 640),
    "/_next/image/?url=https%3A%2F%2Fi.ohlasy.info%2Fi%2F53173baa.jpg&w=640&q=75",
  );
});

test("Markdown stripping", () => {
  assert.equal(stripMarkdown("foo"), "foo");
  assert.equal(stripMarkdown("*foo*"), "foo");
  assert.equal(stripMarkdown("## foo"), "foo");
  assert.equal(stripMarkdown("[foo](http://foo.com)"), "foo");
});

test("Bot e-mail detection", () => {
  assert.equal(looksLikeBotEmail("user1234@gmail.com"), true);
  assert.equal(looksLikeBotEmail("iwan.u.jac.iy.a.8.2.8@gmail.com"), true);
  assert.equal(looksLikeBotEmail("other@gmail.com"), false);
  assert.equal(looksLikeBotEmail("joe1@gmail.com"), false);
  assert.equal(looksLikeBotEmail("joe.1@gmail.com"), false);
  assert.equal(looksLikeBotEmail("nice.joe.1@gmail.com"), false);
});

test("Single-letter prepositions", () => {
  assert.equal(tilde("k lesu", "~"), "k~lesu");
  assert.equal(tilde("jdu k lesu", "~"), "jdu k~lesu");
  assert.equal(tilde("U zabořenýho mlénka", "~"), "U~zabořenýho mlénka");
  assert.equal(tilde("Vepři v Boskovicích", "~"), "Vepři v~Boskovicích");
});
