import { create } from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

const iTunesNS = "http://www.itunes.com/dtds/podcast-1.0.dtd";
const AtomNS = "http://www.w3.org/2005/Atom";

export type iTunesSupportedEnclosureType =
  | "audio/x-m4a"
  | "audio/mpeg"
  | "video/quicktime"
  | "video/mp4"
  | "video/x-m4v"
  | "application/pdf";

/**
 * An RSS2 feed
 *
 * https://validator.w3.org/feed/docs/rss2.html
 */
export interface RSSFeed {
  /**
   * The name of the channel. It’s how people refer to your service. If you have an
   * HTML website that contains the same information as your RSS file, the title of
   * your channel should be the same as the title of your website.
   */
  title: string;

  /** The URL to the HTML website corresponding to the channel */
  link: string;

  /**
   * The URL of this feed
   *
   * According to the RSS Advisory Board's Best Practices Profile, identifying a feed’s URL
   * within the feed makes it more portable, self-contained, and easier to cache. For these
   * reasons, a feed should contain an atom:link used for this purpose.
   */
  selfLink?: string;

  /** Phrase or sentence describing the channel */
  description: string;

  /** The language the channel is written in, such as `en-us` */
  language?: string;

  /** Copyright notice for content in the channel */
  copyright?: string;

  /** Number of minutes that indicates how long a channel can be cached before refreshing from the source */
  ttl?: number;

  /** Specifies a GIF, JPEG or PNG image that can be displayed with the channel */
  image?: string;

  /** Email address for person responsible for editorial content */
  managingEditor?: string;

  /** Email address for person responsible for technical issues relating to channel */
  webMaster?: string;

  /** Feed items */
  items?: RSSFeedItem[];
}

/** All elements of an item are optional, however at least one of title or description must be present */
export interface RSSFeedItem {
  /** The title of the item */
  title: string;

  /** The item synopsis */
  description: string;

  /** The URL of the item */
  link?: string;

  /** Email address of the author of the item */
  author?: string;

  /** Indicates when the item was published */
  pubDate?: Date;

  /** A string that uniquely identifies the item */
  guid?: {
    value: string;
    isPermaLink?: boolean;
  };

  /**
   * Describes a media object that is attached to the item
   *
   * It has three required attributes. `url` says where the enclosure is located,
   * `length` says how big it is in bytes, and `type` says what its type is, a standard
   * MIME type.
   */
  enclosure?: {
    url: string;
    type: string;
    length: number;
  };
}

//
// Podcast feeds as defined by iTunes
//

/**
 * iTunes Podcast Show
 *
 * https://podcasters.apple.com/support/823-podcast-requirements
 */
export interface iTunesPodcastShow extends RSSFeed {
  /**
   * The artwork for the show
   *
   * Artwork must be a minimum size of 1400 x 1400 pixels and a maximum size of 3000 x 3000 pixels,
   * in JPEG or PNG format, 72 dpi, with appropriate file extensions (.jpg, .png), and in the RGB
   * colorspace. These requirements are different from the standard RSS image tag specifications.
   */
  image: string;

  /**
   * The language spoken on the show
   *
   * Because Apple Podcasts is available in territories around the world, it is critical to specify
   * the language of a podcast. Apple Podcasts only supports values from the ISO 639 list (two-letter
   * language codes, with some possible modifiers, such as “en-us”).
   */
  language: string;

  /**
   * The show category information
   *
   * For a complete list of categories and subcategories, see
   * [Apple Podcast categories](https://podcasters.apple.com/support/1691-apple-podcasts-categories).
   */
  category: string;

  /** The podcast parental advisory information */
  explicit: boolean;

  /**
   * The group responsible for creating the show
   *
   * Show author most often refers to the parent company or network of a podcast,
   * but it can also be used to identify the host(s) if none exists.
   */
  author?: string;

  /**
   * The podcast owner contact information
   *
   * Include the email address of the owner in a nested <itunes:email> tag and the name of the owner
   * in a nested <itunes:name> tag.
   */
  owner?: string;

  /**
   * Podcast episodes
   *
   * You must have at least one episode for your show to be available on Apple Podcasts.
   */
  items: iTunesShowEpisode[];
}

export interface iTunesShowEpisode extends RSSFeedItem {
  /**
   * An episode title
   *
   * Don’t specify the episode number or season number in this tag.
   * Instead, specify those details in the appropriate tags (<itunes:episode>,
   * <itunes:season>). Also, don’t repeat the title of your show within
   * your episode title.
   */
  title: string;

  /**
   * The episode content, file size, and file type information
   */
  enclosure: {
    /**
     * The URL attribute points to your podcast media file
     *
     * The file extension specified within the URL attribute determines whether
     * or not content appears in the podcast directory. Supported file formats
     * include M4A, MP3, MOV, MP4, M4V, and PDF.
     */
    url: string;

    /**
     * The type attribute provides the correct category for the type of file you are using
     *
     * The type values for the supported file formats are: audio/x-m4a, audio/mpeg, video/quicktime,
     * video/mp4, video/x-m4v, and application/pdf.
     */
    type: iTunesSupportedEnclosureType;

    /** The length attribute is the file size in bytes */
    length: number;
  };

  /**
   * The duration of an episode
   *
   * Different duration formats are accepted however it is recommended to convert
   * the length of the episode into seconds.
   */
  duration?: string;

  /**
   * The episode artwork
   *
   * Specify your episode artwork using the href attribute in the <itunes:image> tag.
   *
   * Artwork must be a minimum size of 1400 x 1400 pixels and a maximum size of 3000 x 3000 pixels,
   * in JPEG or PNG format, 72 dpi, with appropriate file extensions (.jpg, .png), and in the RGB
   * colorspace. These requirements are different from the standard RSS image tag specifications.
   */
  image?: string;
}

//
// Feed rendering
//

export function renderFeed(feed: RSSFeed): string {
  let node = create({ version: "1.0" });

  node = node
    .ele("rss", { version: "2.0" })
    .att(AtomNS, "xmlns:atom", AtomNS)
    .ele("channel");

  node.ele("title").txt(feed.title);
  node.ele("description").txt(feed.description);
  node.ele("link").txt(feed.link);

  if (feed.selfLink) {
    node.ele(AtomNS, "link", {
      href: feed.selfLink,
      rel: "self",
      type: "application/rss+xml",
    });
  }

  addIf(node, "language", feed.language);
  addIf(node, "copyright", feed.copyright);
  addIf(node, "managingEditor", feed.managingEditor);
  addIf(node, "webMaster", feed.webMaster);
  addIf(node, "ttl", feed.ttl?.toString());

  if (feed.image) {
    node.ele("image", { href: feed.image });
  }

  feed.items?.forEach((item) => renderItem(node, item));

  return node.end({ prettyPrint: true });
}

export function renderPodcastFeed(feed: iTunesPodcastShow): string {
  let node = create({ version: "1.0" });

  node = node
    .ele("rss", { version: "2.0" })
    .att(AtomNS, "xmlns:atom", AtomNS)
    .att(iTunesNS, "xmlns:itunes", iTunesNS);

  node = node.ele("channel");

  node.ele("title").txt(feed.title);
  node.ele("description").txt(feed.description);
  node.ele("link").txt(feed.link);

  if (feed.selfLink) {
    node.ele(AtomNS, "link", {
      href: feed.selfLink,
      rel: "self",
      type: "application/rss+xml",
    });
  }

  node.ele("language").txt(feed.language);
  node.ele("image", { href: feed.image });

  addIf(node, "copyright", feed.copyright);
  addIf(node, "managingEditor", feed.managingEditor);
  addIf(node, "webMaster", feed.webMaster);
  addIf(node, "ttl", feed.ttl?.toString());

  node.ele(iTunesNS, "image", { href: feed.image });
  node.ele(iTunesNS, "category", { text: feed.category });
  node.ele(iTunesNS, "explicit").txt(`${feed.explicit}`);

  if (feed.author) {
    node.ele(iTunesNS, "author").txt(feed.author);
  }

  if (feed.owner) {
    node.ele(iTunesNS, "owner").ele(iTunesNS, "email").txt(feed.owner);
  }

  feed.items?.forEach((item) => renderItem(node, item));

  return node.end({ prettyPrint: true });
}

function renderItem(node: XMLBuilder, item: RSSFeedItem | iTunesShowEpisode) {
  node = node.ele("item");
  node.ele("title").txt(item.title);
  node.ele("description").dat(item.description);

  addIf(node, "link", item.link);

  if (item.guid) {
    node
      .ele("guid", { isPermaLink: item.guid.isPermaLink })
      .txt(item.guid.value);
  }
  if (item.author) {
    node.ele("author").txt(item.author);
  }
  if (item.pubDate) {
    node.ele("pubDate").txt(item.pubDate.toUTCString());
  }
  if ("image" in item && item.image) {
    node.ele(iTunesNS, "image", { href: item.image });
  }
  if ("duration" in item && item.duration) {
    node.ele(iTunesNS, "duration").txt(item.duration);
  }
  if (item.enclosure) {
    node.ele("enclosure", item.enclosure);
  }
}

const addIf = (node: XMLBuilder, elem: string, value: string | undefined) => {
  if (value) {
    node.ele(elem).txt(value);
  }
};
