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
      className="block relative w-full aspect-square bg-silver cursor-pointer"
    >
      <div className="absolute top-[-1.2em] text-xs text-[#666] uppercase">
        reklama
      </div>
      <Image
        src={image}
        sizes="(min-width: 1024px) 350px, (min-width: 768px) 33vw, 100vw"
        alt={alt ?? "reklama"}
        fill
      />
    </a>
  );
};
