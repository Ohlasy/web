import Image from "next/image";
import { Banner } from "src/data-source/banners";

export type BannerProps = {
  banner: Banner;
};

export const BannerBox = ({ banner }: BannerProps) => {
  const { image, url, alt } = banner;
  return (
    <a href={url}>
      <Image
        src={image}
        className="img-responsive"
        sizes="25vw"
        alt={alt ?? "reklama"}
        fill
      />
    </a>
  );
};
