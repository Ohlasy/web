import {
  array,
  date,
  decodeType,
  field,
  nullable,
  number,
  record,
  string,
} from "typescript-json-decoder";

export type IncidentReport = decodeType<typeof decodeIncidentReport>;
export const decodeIncidentReport = record({
  id: number,
  orp: field("ORP", string),
  obec: string,
  castObce: nullable(string),
  ulice: nullable(string),
  casVzniku: nullable(date),
  casOhlaseni: date,
  poznamkaProMedia: nullable(string),
});

export const decodeIncidentFeed = array(decodeIncidentReport);
