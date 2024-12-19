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

export const incidentTypes: Record<string, string | undefined> = {
  "3200": "dopravní nehoda",
  "3500": "technická pomoc",
  "3100": "požár",
  "3400": "únik nebezpečných látek",
  "3550": "záchrana osob a zvířat",
};

export const incidentSubtypes: Record<string, string | undefined> = {
  "3101": "nízké budovy",
  "3107": "trafostanice, rozvodny",
  "3108": "dopravní prostředky",
  "3109": "popelnice, kontejner",
  "3110": "lesního porostu",
  "3111": "odpad, ostatní",
  "3211": "se zraněním",
  "3212": "uvolnění komunikace, odtažení",
  "3213": "úklid vozovky",
  "3214": "se zraněním",
  "3401": "na pozemní komunikaci",
  "3404": "do ovzduší",
  "3501": "odstranění nebezpečných stavů",
  "3505": "odstranění stromu",
  "3522": "z výšky",
  "3524": "zasypané, zavalené",
  "3526": "odstraňování překážek",
  "3527": "čerpání vody",
  "3528": "měření koncentrací",
};

export type IncidentReport = decodeType<typeof decodeIncidentReport>;
export const decodeIncidentReport = record({
  id: number,
  orp: field("ORP", string),
  obec: string,
  typId: number,
  podtypId: number,
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
