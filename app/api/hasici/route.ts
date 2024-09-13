import { renderFeed, RSSFeed, RSSFeedItem } from "src/feeds";
import {
  buildUrlForDay,
  decodeIncidentFeed,
  IncidentReport,
  incidentSubtypes,
  incidentTypes,
} from "./upstream";
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
  const type = incidentTypes[String(report.typId)] ?? "neznáme";
  const subtype = incidentSubtypes[String(report.podtypId)] ?? "neznáme";
  const description = `
Typ události: ${report.typId} (${type})
Podtyp události: ${report.podtypId} (${subtype})
Poznámka pro média: ${report.poznamkaProMedia ?? "(není)"}
`;
  return {
    title: report.ulice ? `${report.obec} (${report.ulice})` : report.obec,
    pubDate: report.casOhlaseni,
    description,
    guid: {
      value: String(report.id),
      isPermaLink: false,
    },
  };
}
