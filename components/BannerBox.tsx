import { Banner } from "src/banners";

export type BannerProps = {
  banner: Banner;
};

export const BannerBox = ({ banner }: BannerProps) => {
  const { image, url, alt } = banner;
  return (
    <a href={url}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} className="img-responsive" alt={alt ?? "reklama"} />
    </a>
  );
};
