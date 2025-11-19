import { Metadata } from "src/article";
import { unique } from "src/utils";

export type FilterOptions = Record<string, string[]>;
export type Settings = Record<string, string>;

export interface Filter {
  id: string;
  name: string;
  valueSort: (a: string, b: string) => number;
  extractPossibleValues: (article: Metadata) => string[];
  match: (article: Metadata, value: string) => boolean;
  displayValue?: (value: string) => string;
}

const Sort = {
  none: (a: string, b: string) => 1,
  alpha: (a: string, b: string) => a.localeCompare(b, "cs-CZ"),
};

export const filters: Filter[] = [
  {
    id: "autor",
    name: "Autor*ka",
    valueSort: Sort.none,
    extractPossibleValues: (article) => [article.author],
    match: (article, value) => article.author === value,
  },
  {
    id: "rubrika",
    name: "Rubrika",
    valueSort: Sort.none,
    extractPossibleValues: ({ category }) => (category ? [category] : []),
    match: (article, value) => article.category === value,
  },
  {
    id: "serial",
    name: "Seriál",
    valueSort: Sort.none,
    extractPossibleValues: ({ serial }) => (serial ? [serial] : []),
    match: (article, value) => article.serial === value,
    displayValue: (serialId: string) => {
      const names: any = {
        "pribehy": "Každý má svůj příběh",
        "krajiny": "Krajiny Boskovicka",
        "ghetto": "Příběhy z ghetta",
        "prochazky": "Procházky po památkách",
        "jazyk": "Rendez-vous s jazykem",
        "depozitar": "Z muzejního depozitáře",
        "osmicky": "Osmičková výročí",
        "stromy": "Život pod stromy",
        "historie": "Pohledy do historie",
        "pojdte-ven": "Pojďte ven",
        "komise": "Z komisí",
        "moje-boskovice": "Moje Boskovice",
      };
      return names[serialId] || serialId;
    },
  },
  {
    id: "tag",
    name: "Téma",
    valueSort: Sort.alpha,
    extractPossibleValues: ({ tags }) => tags,
    match: (article, value) => article.tags.includes(value),
  },
  {
    id: "rok",
    name: "Rok",
    valueSort: Sort.none,
    extractPossibleValues: (article) => [getYear(article)],
    match: (article, value) => getYear(article) === value,
  },
];

export function buildFilterOptions(articles: Metadata[]): FilterOptions {
  const getPossibleValues = (f: Filter) =>
    unique(articles.map(f.extractPossibleValues).flat()).sort(f.valueSort);
  const filtersAndValues = filters.map((filter) => [
    filter.id,
    getPossibleValues(filter),
  ]);
  return Object.fromEntries(filtersAndValues);
}

export function match(article: Metadata, settings: Settings): boolean {
  for (const [filterId, wantedValue] of Object.entries(settings)) {
    const filter = filters.find((f) => f.id === filterId);
    if (!filter) {
      console.warn(`Unknown filter id “${filterId}” in settings, skipping.`);
      continue;
    }
    if (!filter.match(article, wantedValue)) {
      return false;
    }
  }
  return true;
}

const getYear = (a: Metadata) => new Date(a.date).getFullYear().toString();
