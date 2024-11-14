import Link from "next/link";
import { RouteTo } from "src/routing";

export type PathItem = {
  title: string;
  path: string;
};

export type Props = {
  parentItems?: PathItem[];
  currentItemTitle: string;
};

export const Breadcrumbs = ({ parentItems = [], currentItemTitle }: Props) => {
  const allItems: PathItem[] = [
    { title: "Ohlasy", path: RouteTo.homePage },
    ...parentItems,
  ];
  return (
    <ul className="text-sm uppercase -mt-1 mb-3 flex flex-row">
      {allItems.map(({ title, path }) => (
        <li key={path}>
          <Link href={path}>{title}</Link>
          <span className="px-1">/</span>
        </li>
      ))}
      <li>{currentItemTitle}</li>
    </ul>
  );
};
