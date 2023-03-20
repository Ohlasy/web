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
      className="ad"
      style={{
        display: "block",
        position: "relative",
        width: "360px",
        height: "360px",
        background: "#ddd",
        marginBottom: "30px",
        cursor: "pointer",
      }}
    >
      <Image src={image} sizes="25vw" alt={alt ?? "reklama"} fill />
    </a>
  );
};
