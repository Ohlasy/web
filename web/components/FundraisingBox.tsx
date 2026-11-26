import Image from "next/image";

export type ImagePreset = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type FundraisingBoxProps = {
  imagePreset?: ImagePreset;
  widgetToken?: string;
};

const defaultWidgetToken = "yuz8kfm2xy7lb0rb";
const defaultImagePreset: ImagePreset = {
  url: "https://i.ohlasy.info/i/0ef79d75.jpg",
  width: 5842,
  height: 3894,
  alt: "Tým Ohlasů",
};

export const FundraisingBox = ({
  imagePreset = defaultImagePreset,
  widgetToken = defaultWidgetToken,
}: FundraisingBoxProps) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
    <div className="lg:col-span-2">
      <Image
        className="lg:col-span-2"
        src={imagePreset.url}
        sizes="(min-width: 640px) 50vw, 100vw"
        width={imagePreset.width}
        height={imagePreset.height}
        alt={imagePreset.alt}
      />
    </div>
    <div>
      <iframe
        title="Darujte"
        width="100%"
        height="400"
        className="w-full max-w-full overflow-hidden h-100"
        src={`https://www.darujme.cz/widget?token=${widgetToken}`}
        name={`widget-${widgetToken}`}
      />
    </div>
  </div>
);
