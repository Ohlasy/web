type Props = {
  src: string;
  width: number;
};

export const getScaledImageUrl = ({ src, width }: Props) =>
  `https://thumbs.ohlasy.info/insecure/rs:fit:${width}:0/plain/${src}`;

export const getImageSrcSet = (
  sourceUrl: string,
  widths: number[] = [3840, 1920, 1080, 640],
) =>
  widths
    .map((width) => `${getScaledImageUrl({ src: sourceUrl, width })} ${width}w`)
    .join(", ");

export default getScaledImageUrl;
