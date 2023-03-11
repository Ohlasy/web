import { Article, compareByDate, getAllArticles, stripBody } from "src/article";
import { getArticlePath } from "src/routing";
import { articleRoot } from "src/server-utils";
import { getSignedResizedImage, IMAGE_SIGNING_KEY } from "src/utils";

export async function GET() {
  const articles = getAllArticles(articleRoot)
    .sort(compareByDate)
    .map(addAuxiliaryData);
  return new Response(JSON.stringify(articles, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

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
