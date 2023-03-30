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
      <div className="absolute top-[-1.2em] text-xs text-[#666] uppercase">
        reklama
      </div>
      <Image
        src={image}
        sizes="(min-width: 1024px) 350px, (min-width: 640px) 33vw, 100vw"
        alt={alt ?? "reklama"}
        fill
      />
    </a>
  );
};
