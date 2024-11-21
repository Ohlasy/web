"use client";

import { Metadata } from "src/article";
import { Filter, FilterOptions, filters, match, Settings } from "./filters";
import Link from "next/link";
import Image from "next/image";
import { RouteTo } from "src/routing";
import { tilde } from "src/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";

type Props = {
  allArticles: ReadonlyArray<Metadata>;
  filterOptions: FilterOptions;
};

export const ArchiveView = ({ allArticles, filterOptions }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams() ?? [];

  // Read initial filter settings from URL search params
  const [settings, setSettings] = useState(
    Object.fromEntries(searchParams.entries())
  );

  // Filter all articles according to settings
  const matchingArticles = allArticles
    .filter((a) => match(a, settings))
    .sort(compareByDate);

  // Update URL when settings change
  const updateRoute = (settings: Record<string, string>) =>
    router.replace("/clanky/?" + new URLSearchParams(settings));

  // Update settings based on events from the filter panel
  const updateSettings = (id: string, newValue: string | undefined) => {
    if (newValue) {
      const newSettings = { ...settings, [id]: newValue };
      setSettings(newSettings);
      updateRoute(newSettings);
    } else {
      const { [id]: _, ...newSettings } = settings;
      setSettings(newSettings);
      updateRoute(newSettings);
    }
  };

  const clearSettings = () => {
    setSettings({});
    updateRoute({});
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        <FilterPanel
          options={filterOptions}
          settings={settings}
          onChange={updateSettings}
          removeAllFilters={clearSettings}
          matchCount={matchingArticles.length}
        />
        {matchingArticles.map((a) => (
          <ArticlePreview key={a.date + a.title} article={a} />
        ))}
      </div>
    </div>
  );
};

type FilterPanelProps = {
  options: FilterOptions;
  settings: Settings;
  onChange: (id: string, value: string | undefined) => void;
  removeAllFilters: () => void;
  matchCount: number;
};

const FilterPanel = ({
  options,
  settings,
  onChange,
  removeAllFilters,
  matchCount,
}: FilterPanelProps) => {
  const DressedCount = ({ count }: { count: number }) => {
    if (count === 0) {
      return "Aktuálnímu nastavení neodpovídá žádný článek.";
    } else if (count === 1) {
      return `Aktuálnímu nastavení odpovídá celkem 1 článek.`;
    } else if (count >= 2 && count <= 4) {
      return `Aktuálnímu nastavení odpovídají celkem ${count} články.`;
    } else {
      return `Aktuálnímu nastavení odpovídá celkem ${count} článků.`;
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-lightGray p-4">
      {filters.map((filter) => (
        <FilterControl
          key={filter.id}
          filter={filter}
          values={options[filter.id]}
          selected={settings[filter.id]}
          onChange={(value) => onChange(filter.id, value)}
        />
      ))}
      <div className="mt-4">
        <button
          onClick={removeAllFilters}
          disabled={Object.keys(settings).length === 0}
          className="w-full btn-primary"
        >
          Smazat filtry
        </button>
      </div>
      <div className="text-sm text-center text-balance mt-2">
        <DressedCount count={matchCount} />
      </div>
    </div>
  );
};

type FilterControlProps = {
  filter: Filter;
  values: string[];
  selected: string | undefined;
  onChange: (value: string | undefined) => void;
};

export const FilterControl = (props: FilterControlProps) => {
  const emptyLabel = "bez omezení";
  const { filter, values, selected, onChange } = props;
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const reportedValue = value === emptyLabel ? undefined : value;
    onChange(reportedValue);
  };
  const identity = (a: string) => a;
  const dressValue = filter.displayValue || identity;
  return (
    <div>
      <div>
        {filter.name} {selected && <span className="text-blue-400">●</span>}
      </div>
      <select
        className="w-full"
        onChange={handleChange}
        value={selected ?? emptyLabel}
      >
        <option key="na">{emptyLabel}</option>
        {values.map((item, index) => (
          <option key={index} value={item}>
            {dressValue(item)}
          </option>
        ))}
      </select>
    </div>
  );
};

const ArticlePreview = ({ article }: { article: Metadata }) => {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("cs-CZ", { dateStyle: "medium" });
  return (
    <Link
      className="flex flex-col gap-2 text-black"
      href={RouteTo.article(article)}
    >
      <div className="relative aspect-video">
        <Image
          src={article.coverPhoto}
          className="object-cover bg-gray"
          sizes="(min-width: 768px) 30vw, 100vw"
          alt=""
          fill
        />
      </div>
      <h2 className="text-balance font-bold">{tilde(article.title)}</h2>
      <p className="text-sm uppercase text-offBlack">
        {article.author} {formatDate(article.date)}
      </p>
      <p className="line-clamp-6 text-sm text-balance">
        {tilde(article.perex)}
      </p>
    </Link>
  );
};

/** Compare articles by publish date, sorting last published first */
const compareByDate = <A extends Pick<Metadata, "date">>(a1: A, a2: A) =>
  Date.parse(a2.date) - Date.parse(a1.date);
