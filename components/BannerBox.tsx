import Image from "next/image";
import { Banner } from "src/data-source/banners";

export type BannerProps = {
  banner: Banner;
};

// TBD: Nesting the <a> inside div.box is too complicated
export const BannerBox = ({ banner }: BannerProps) => {
  const { image, url, alt } = banner;
  return (
    <a
      href={url}
      style={{
        display: "block",
        position: "relative",
        width: "360px",
        height: "360px",
      }}
    >
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
