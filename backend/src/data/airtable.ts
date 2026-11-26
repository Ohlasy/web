const envApiKey = process.env.AIRTABLE_API_KEY;

type AirtableRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
};

type FetchProps = {
  apiKey?: string;
  appId: string;
  tableId: string;
};

type Decoder<T> = (val: unknown) => T;

const buildTableUrl = ({
  appId,
  tableId,
}: Pick<FetchProps, "appId" | "tableId">) =>
  new URL(`https://api.airtable.com/v0/${appId}/${tableId}`);

async function fetchAllRecordsRaw({
  apiKey = envApiKey,
  appId,
  tableId,
}: FetchProps) {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = buildTableUrl({ appId, tableId });
    url.searchParams.set("pageSize", "100");
    if (offset) {
      url.searchParams.set("offset", offset);
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(
        `Airtable request failed: ${res.status} ${res.statusText}`,
      );
    }

    const data = (await res.json()) as {
      records: AirtableRecord[];
      offset?: string;
    };

    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records.map((r) => r.fields);
}

type CreateRecordProps = FetchProps & {
  fields: Record<string, unknown>;
};

async function createRecordRaw({
  apiKey = envApiKey,
  appId,
  tableId,
  fields,
}: CreateRecordProps) {
  const url = buildTableUrl({ appId, tableId });
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    throw new Error(`Airtable request failed: ${res.status} ${res.statusText}`);
  }

  const record = (await res.json()) as AirtableRecord;
  return record.fields;
}

export const fetchAllRecords = async <T>({
  decoder,
  ...props
}: FetchProps & { decoder: Decoder<T> }) =>
  fetchAllRecordsRaw(props).then((records) => records.map(decoder));

export const createRecord = <T>({
  decoder,
  ...props
}: CreateRecordProps & { decoder: Decoder<T> }) =>
  createRecordRaw(props).then(decoder);
