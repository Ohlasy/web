import { getSignedResizedImage } from "./utils";

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
