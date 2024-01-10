import { getResizedImageUrl, stripMarkdown, tilde } from "./utils";

test("Image resizing", () => {
  expect(getResizedImageUrl("https://i.ohlasy.info/i/53173baa.jpg", 640)).toBe(
    "/_next/image/?url=https%3A%2F%2Fi.ohlasy.info%2Fi%2F53173baa.jpg&w=640&q=75"
  );
});

test("Markdown stripping", () => {
  expect(stripMarkdown("foo")).toBe("foo");
  expect(stripMarkdown("*foo*")).toBe("foo");
  expect(stripMarkdown("## foo")).toBe("foo");
  expect(stripMarkdown("[foo](http://foo.com)")).toBe("foo");
});

test("Single-letter prepositions", () => {
  expect(tilde("k lesu", "~")).toBe("k~lesu");
  expect(tilde("jdu k lesu", "~")).toBe("jdu k~lesu");
  expect(tilde("U zabořenýho mlénka", "~")).toBe("U~zabořenýho mlénka");
  expect(tilde("Vepři v Boskovicích", "~")).toBe("Vepři v~Boskovicích");
});
