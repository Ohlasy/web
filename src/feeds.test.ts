import {
  RSSFeed,
  renderFeed,
  renderPodcastFeed,
  iTunesPodcastShow,
} from "./feeds";

const normalizeWhitespace = (str: string) =>
  str
    .split(/\n/)
    .map((s) => s.replace(/^\s*/, ""))
    .filter((s) => s !== "")
    .join("\n");

test("Normalize whitespace", () => {
  expect(
    normalizeWhitespace(`
    foo
    `)
  ).toBe("foo");
});

test("Render regular RSS feed", () => {
  const now = new Date();
  const feed: RSSFeed = {
    title: "Ohlasy",
    description: "Foo bar",
    link: "https://ohlasy.info",
    selfLink: "https://ohlasy.info/feed.xml",
    language: "cs",
    copyright: "Ohlasy, z.s.",
    managingEditor: "mrA",
    webMaster: "mrB",
    ttl: 1,
    image: "https://i.ohlasy.info/i/waibo6c.png",
    items: [
      {
        title: "Foo",
        link: "https://ohlasy.info/foo",
        description: "Bar",
        author: "zoul@ohlasy.info",
        pubDate: now,
        guid: {
          value: "https://ohlasy.info/foo",
          isPermaLink: true,
        },
        enclosure: {
          url: "https://data.ohlasy.info/foo",
          type: "audio/mpeg",
          length: 1000,
        },
      },
    ],
  };
  expect(normalizeWhitespace(renderFeed(feed))).toBe(
    normalizeWhitespace(`
      <?xml version="1.0"?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
          <channel>
              <title>Ohlasy</title>
              <description>Foo bar</description>
              <link>https://ohlasy.info</link>
              <atom:link href="https://ohlasy.info/feed.xml" rel="self" type="application/rss+xml"/>
              <language>cs</language>
              <copyright>Ohlasy, z.s.</copyright>
              <managingEditor>mrA</managingEditor>
              <webMaster>mrB</webMaster>
              <ttl>1</ttl>
              <image href="https://i.ohlasy.info/i/waibo6c.png"/>
              <item>
                <title>Foo</title>
                <description><![CDATA[Bar]]></description>
                <link>https://ohlasy.info/foo</link>
                <guid isPermaLink="true">https://ohlasy.info/foo</guid>
                <author>zoul@ohlasy.info</author>
                <pubDate>${now.toUTCString()}</pubDate>
                <enclosure url="https://data.ohlasy.info/foo" type="audio/mpeg" length="1000"/>
              </item>
          </channel>
      </rss>
      `)
  );
});

test("Render podcast feed", () => {
  const now = new Date();
  const feed: iTunesPodcastShow = {
    title: "Ohlasy",
    description: "Foo bar",
    link: "https://ohlasy.info",
    selfLink: "https://ohlasy.info/feed.xml",
    language: "cs",
    copyright: "Ohlasy, z.s.",
    author: "Ohlasy",
    ttl: 1,
    category: "News & Politics",
    explicit: false,
    owner: "zoul@ohlasy.info",
    image: "https://i.ohlasy.info/i/waibo6c.png",
    items: [
      {
        title: "Foo",
        image: "https://i.ohlasy.info/i/waibo6c.png",
        duration: "60",
        description: "Bar",
        author: "zoul@ohlasy.info",
        pubDate: now,
        guid: {
          value: "https://ohlasy.info/foo",
          isPermaLink: true,
        },
        enclosure: {
          url: "https://data.ohlasy.info/foo",
          type: "audio/mpeg",
          length: 1000,
        },
      },
    ],
  };
  expect(normalizeWhitespace(renderPodcastFeed(feed))).toBe(
    normalizeWhitespace(`
    <?xml version="1.0"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
        <channel>
            <title>Ohlasy</title>
            <description>Foo bar</description>
            <link>https://ohlasy.info</link>
            <atom:link href="https://ohlasy.info/feed.xml" rel="self" type="application/rss+xml"/>
            <language>cs</language>
            <image href="https://i.ohlasy.info/i/waibo6c.png"/>
            <copyright>Ohlasy, z.s.</copyright>
            <ttl>1</ttl>
            <itunes:image href="https://i.ohlasy.info/i/waibo6c.png"/>
            <itunes:category text="News &amp; Politics"/>
            <itunes:explicit>false</itunes:explicit>
            <itunes:author>Ohlasy</itunes:author>
            <itunes:owner>
                <itunes:email>zoul@ohlasy.info</itunes:email>
            </itunes:owner>
            <item>
                <title>Foo</title>
                <description><![CDATA[Bar]]></description>
                <guid isPermaLink="true">https://ohlasy.info/foo</guid>
                <author>zoul@ohlasy.info</author>
                <pubDate>${now.toUTCString()}</pubDate>
                <itunes:image href="https://i.ohlasy.info/i/waibo6c.png"/>
                <itunes:duration>60</itunes:duration>
                <enclosure url="https://data.ohlasy.info/foo" type="audio/mpeg" length="1000"/>
          </item>
    </channel>
    </rss>
    `)
  );
});
