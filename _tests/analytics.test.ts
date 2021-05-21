import { buildAnalyticsUrl } from "../api/analytics";

test("URL building", () => {
  const options = {
    "ids": "ga:97173197",
    "start-date": "60daysAgo",
    "end-date": "yesterday",
    "metrics": "ga:users,ga:pageviews",
    "dimensions": "ga:pagePath,ga:pageTitle",
    "sort": "-ga:pageviews",
    "filters": "ga:pagePath=@/clanky/20",
    "max-results": "10",
  };
  expect(buildAnalyticsUrl(options)).toBe(
    "https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A97173197&start-date=60daysAgo&end-date=yesterday&metrics=ga%3Ausers%2Cga%3Apageviews&dimensions=ga%3ApagePath%2Cga%3ApageTitle&sort=-ga%3Apageviews&filters=ga%3ApagePath%3D%40%2Fclanky%2F20&max-results=10"
  );
});
