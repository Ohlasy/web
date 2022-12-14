import { NextApiRequest, NextApiResponse } from "next";
import { Article, compareByDate, getAllArticles, stripBody } from "src/article";
import { getArticlePath } from "src/routing";
import { articleRoot } from "src/server-utils";
import { getSignedResizedImage, IMAGE_SIGNING_KEY } from "src/utils";

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const articles = getAllArticles(articleRoot)
    .sort(compareByDate)
    .map(addAuxiliaryData);
  const json = JSON.stringify(articles, null, 2);
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", `s-maxage=3600, stale-while-revalidate`);
  response.send(json);
};

function addAuxiliaryData(article: Article) {
  return {
    ...stripBody(article),
    "numberOfWords": countWords(article.body),
    "relativeURL": getArticlePath(article),
    "cover-photo": getSignedResizedImage(
      article.coverPhoto,
      640,
      IMAGE_SIGNING_KEY
    ),
    "cover-photo-src": article.coverPhoto,
  };
}

// This is really primitive, but seems to roughly do the job
const countWords = (str: string) => str.split(/\s+/).length;
