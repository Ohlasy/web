import Image from "next/image";
import { Banner } from "src/data-source/banners";

export type BannerProps = {
  banner: Banner;
};

export const BannerBox = ({ banner }: BannerProps) => {
  const { image, url, alt } = banner;
  return (
    <a
      href={url}
      className="block relative bg-silver cursor-pointer aspect-square w-full"
    >
      <Image src={image} sizes="25vw" alt={alt ?? "reklama"} fill />
    </a>
  );
};
