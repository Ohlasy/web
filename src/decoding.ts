import {
  Decoder,
  DecoderFunction,
  decodeType,
  dict,
  Pojo,
  string,
} from "typescript-json-decoder";

/**
 * Decode a URL string
 *
 * Throws if the string is not a valid URL.
 */
export const decodeUrl = (value: Pojo) => new URL(string(value)).toString();

/** Decode an object with given entries */
export function decodeObject<D extends Decoder<unknown>>(
  decoder: D
): DecoderFunction<Record<string, decodeType<D>>> {
  return (value: Pojo) => Object.fromEntries(dict(decoder)(value));
}

/** Try decoding with the provided decoder and return a default value if it fails */
export const withDefault = <T>(
  decoder: DecoderFunction<T>,
  defaultValue: T
) => {
  return (value: Pojo) => {
    try {
      return decoder(value);
    } catch (_) {
      return defaultValue;
    }
  };
};
