import { renderFeed, RSSFeed, RSSFeedItem } from "src/feeds";
import { decodeIncidentFeed, IncidentReport } from "./upstream";
import { absolute } from "src/routing";

export async function GET(): Promise<Response> {
  const feedUrl =
    "https://udalosti.firebrno.cz/api/?casOd=2024-09-12T22:00:00.000Z&casDo=2024-09-13T21:59:59.999Z&krajId=116&okresId=3701&background=true&stavIds=210&stavIds=400&stavIds=410&stavIds=420&stavIds=430&stavIds=440&stavIds=500&stavIds=510&stavIds=520&stavIds=600&stavIds=610&stavIds=620&stavIds=700&stavIds=710&stavIds=750&stavIds=760&stavIds=780&stavIds=800";
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
