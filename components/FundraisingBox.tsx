import Image from "next/image";

export const FundraisingBox = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
    <div className="lg:col-span-2">
      <Image
        className="lg:col-span-2"
        src="https://i.ohlasy.info/i/0ef79d75.jpg"
        sizes="(min-width: 640px) 50vw, 100vw"
        width={5842}
        height={3894}
        alt="Tým Ohlasů"
      />
    </div>
    <div>
      <iframe
        title="Darujte"
        width="100%"
        height="400"
        className="w-full max-w-full overflow-hidden h-100"
        src="https://www.darujme.cz/widget?token=yuz8kfm2xy7lb0rb"
        name="widget-yuz8kfm2xy7lb0rb"
      />
    </div>
  </div>
);
