import { renderFeed, RSSFeed, RSSFeedItem } from "src/feeds";
import { buildUrlForDay, decodeIncidentFeed, IncidentReport } from "./upstream";
import { absolute } from "src/routing";

export async function GET(): Promise<Response> {
  const feedUrl = buildUrlForDay(new Date());
  const incidentFeed = await fetch(feedUrl)
    .then((response) => response.json())
    .then(decodeIncidentFeed)
    .catch((_) => null);
  if (!incidentFeed) {
    return new Response("Failed to read upstream data.", { status: 500 });
  }
  const rssFeed: RSSFeed = {
    title: "Přehled událostí HZS / Boskovice",
    link: "https://udalosti.firebrno.cz",
    selfLink: absolute("/api/hasici"),
    description: "Přehled hasičských zásahů v ORP Boskovice",
    managingEditor: "Tomáš Znamenáček <zoul@ohlasy.info>",
    ttl: 15,
    items: incidentFeed
      .filter((item) => item.orp === "Boskovice")
      .map(incidentReportToFeedItem),
  };
  return new Response(renderFeed(rssFeed), {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}

function incidentReportToFeedItem(report: IncidentReport): RSSFeedItem {
  return {
    title: [report.obec, report.castObce, report.ulice]
      .filter((item) => !!item)
      .join(" / "),
    description: report.poznamkaProMedia ?? "",
    pubDate: report.casOhlaseni,
    guid: {
      value: String(report.id),
      isPermaLink: false,
    },
  };
}
