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

export const buildUrlForDay = (endDate: Date) => {
  const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
  return `https://udalosti.firebrno.cz/api/?casOd=${startDate.toISOString()}&casDo=${endDate.toISOString()}&krajId=116&okresId=3701&background=true&stavIds=210&stavIds=400&stavIds=410&stavIds=420&stavIds=430&stavIds=440&stavIds=500&stavIds=510&stavIds=520&stavIds=600&stavIds=610&stavIds=620&stavIds=700&stavIds=710&stavIds=750&stavIds=760&stavIds=780&stavIds=800`;
};
