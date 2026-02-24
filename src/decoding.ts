import {
  array,
  Decoder,
  DecoderFunction,
  decodeType,
  dict,
  string,
} from "typescript-json-decoder";

/**
 * Decode a URL string
 *
 * Throws if the string is not a valid URL.
 */
export const decodeUrl = (value: unknown) => new URL(string(value)).toString();

/** Decode an object with given entries */
export function decodeObject<D extends Decoder<unknown>>(
  decoder: D,
): DecoderFunction<Record<string, decodeType<D>>> {
  return (value: unknown) => Object.fromEntries(dict(decoder)(value));
}

/** Try decoding with the provided decoder and return a default value if it fails */
export const withDefault = <T>(
  decoder: DecoderFunction<T>,
  defaultValue: T,
) => {
  return (value: unknown) => {
    try {
      return decoder(value);
    } catch (_) {
      return defaultValue;
    }
  };
};

/**
 * Decode an Airtable relation from the current table to one record in another table
 *
 * The relation is always optional (the value doesn’t have to be there), but even
 * if the value _is_ there, the Airtable API returns an array, so we simplify
 * the whole thing to either the singleton value or undefined.
 *
 * As an additional evil plot twist, in a synced table the value is _not_ an array,
 * but a single string. Go figure.
 */
export const relationToZeroOrOne = (value: unknown) => {
  if (!value) {
    return undefined;
  } else if (Array.isArray(value) && value.length === 0) {
    return undefined;
  } else if (Array.isArray(value)) {
    const decodeArray = array(string);
    const decoded = decodeArray(value);
    if (decoded.length !== 1) {
      console.warn(
        `Unexpected number of records when decoding relation, expected 0 or 1 values, got ${decoded.length}`,
      );
    }
    return decoded[0];
  } else {
    return string(value);
  }
};

export const decodeDate = (value: unknown) => new Date(string(value));
