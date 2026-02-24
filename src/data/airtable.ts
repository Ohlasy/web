import Airtable, { FieldSet, Record, Records } from "airtable";

/** Unwrap the raw fields object from an Airtable `Record` type */
export const unwrapRecord = <Schema extends FieldSet>(record: Record<Schema>) =>
  record.fields as unknown;

/** Unwrap the raw fields objects from an Airtable `Records` type */
export const unwrapRecords = <Schema extends FieldSet>(
  records: Records<Schema>,
) => records.map(unwrapRecord);

export const getTable = (baseId: string, tableNameOrId: string) =>
  new Airtable().base(baseId)(tableNameOrId);
