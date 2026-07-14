import { SectionDivider } from "@/components/SectionDivider";
import { SmallArticlePreview } from "@/components/SmallArticlePreview";
import { getAllArticles, stripBody } from "@/src/article";

export default async function ElectionPage() {
  const electionArticles = getAllArticles("content/articles")
    // Only take election articles
    .filter(({ tags }) => tags.includes("komunální volby 2026"))
    // In reverse chronological order
    .reverse()
    // Without article body
    .map(stripBody);
  return (
    <div>
      <h1 className="typo-head1 mb-3">Komunální volby 2026</h1>
      <p>Chystáme!</p>
      <SectionDivider>Napsali a natočili jsme o volbách</SectionDivider>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
        {electionArticles.map((article) => (
          <SmallArticlePreview key={article.title} article={article} />
        ))}
      </div>
    </div>
  );
}
