import { getSignedResizedImage, stripMarkdown, tilde } from "./utils";

test("Image resizing", () => {
  expect(
    getSignedResizedImage(
      "https://i.ohlasy.info/i/53173baa.jpg",
      640,
      "oovah1Ch"
    )
  ).toBe(
    "https://nahledy.ohlasy.info/?src=https://i.ohlasy.info/i/53173baa.jpg&width=640&proof=73bcf420ab6236793b3fda3bc5a2bf779ad50c13"
  );
});

test("Markdown stripping", () => {
  expect(stripMarkdown("foo")).toBe("foo");
  expect(stripMarkdown("*foo*")).toBe("foo");
  expect(stripMarkdown("## foo")).toBe("foo");
  expect(stripMarkdown("[foo](http://foo.com)")).toBe("foo");
});

test("Single-letter prepositions", () => {
  expect(tilde("k lesu")).toBe("k lesu");
  expect(tilde("jdu k lesu")).toBe("jdu k lesu");
  expect(tilde("U zabořenýho mlénka")).toBe("U zabořenýho mlénka");
});
