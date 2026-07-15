import Image from "next/image";
import Link from "next/link";
import { BannerBox } from "@/components/BannerBox";
import { FundraisingBox } from "@/components/FundraisingBox";
import { PreviewNest } from "@/components/PreviewNest";
import { SectionDivider } from "@/components/SectionDivider";
import { compareByDate, getAllArticles, type Metadata } from "@/src/article";
import { getAllAuthors } from "@/src/data/authors";
import type { Banner } from "@/src/data/banners";
import { getAllBanners } from "@/src/data/banners";
import type { TopArticles } from "@/src/data/plausible";
import { getTopArticles, plausibleEventClass } from "@/src/data/plausible";
import { RouteTo } from "@/src/routing";
import { endlessGeneratorOf, shuffleInPlace, tilde } from "@/src/utils";

// Revalidate this page every 5 minutes
export const revalidate = 300;

/** Home page */
const Page = async () => {
  const banners = await getAllBanners().then(shuffleInPlace);
  const topArticles = await getTopArticles();
  const articles = getAllArticles("content/articles").sort(compareByDate);
  const authors = await getAllAuthors();
  const filterCategory = (category: Metadata["category"]) =>
    articles
      // Skip latest article, it will be displayed on the top of the page anyway
      .slice(1)
      // Filter for requested category
      .filter((a) => a.category === category)
      // Return first ten
      .slice(0, 10);
  const mostRecentArticles = articles.slice(0, 10);
  const archive = shuffleInPlace(articles.filter((a) => a.featured)).slice(
    0,
    10,
  );
  const opinions = filterCategory("názory a komentáře");
  const podcast = filterCategory("podcast");
  const serials = filterCategory("seriály");
  const bannerGenerator = endlessGeneratorOf(banners);
  const getNextBanner = () => bannerGenerator.next().value;

  return (
    <div>
      {/* Most recent */}
      <PreviewNest
        articles={mostRecentArticles}
        getBanner={getNextBanner}
        aboveFold={true}
        authors={authors}
      />

      <SectionDivider>podpořte nás</SectionDivider>
      <FundraisingBox />

      <SectionDivider>názory &amp; komentáře</SectionDivider>
      <PreviewNest
        articles={opinions}
        getBanner={getNextBanner}
        authors={authors}
      />

      <SectionDivider>
        <a href={RouteTo.podcasts}>podcasty</a>
      </SectionDivider>
      <PreviewNest
        articles={podcast}
        getBanner={getNextBanner}
        authors={authors}
      />

      <SectionDivider>nejčtenější články</SectionDivider>
      <TopArticleBox topArticles={topArticles} banner={getNextBanner()} />

      <SectionDivider>seriály</SectionDivider>
      <PreviewNest
        articles={serials}
        getBanner={getNextBanner}
        authors={authors}
      />

      <SectionDivider>
        vybíráme z <a href={RouteTo.archive}>archivu</a>
      </SectionDivider>
      <PreviewNest
        articles={archive}
        getBanner={getNextBanner}
        authors={authors}
      />
    </div>
  );
};

//
// Top Articles
//

export type TopArticleBoxProps = {
  topArticles: TopArticles;
  banner: Banner;
};

const TopArticleBox = ({ topArticles, banner }: TopArticleBoxProps) => (
  <div className="grid lg:grid-cols-3 gap-7">
    <ol className="col-span-2 grid md:grid-cols-2 gap-7">
      {topArticles
        .filter((e) => !!e.title)
        .slice(0, 10)
        .map((entry, index) => (
          <li
            key={entry.title}
            className={`flex gap-4 ${index >= 5 ? "max-md:hidden" : ""}`}
          >
            <span className="block text-2xl text-[#666] text-right w-[3ex] flex-none">
              {index + 1}
            </span>
            <div className="typo-link">
              <Link
                className={plausibleEventClass({
                  name: "Internal Link",
                  type: "top-articles-box",
                })}
                href={entry.path}
              >
                {tilde(entry.title!)}
              </Link>
            </div>
          </li>
        ))}
    </ol>
    <div className="max-lg:hidden">
      <BannerBox banner={banner} />
    </div>
  </div>
);

export default Page;
