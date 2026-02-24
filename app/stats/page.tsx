import { DatawrapperChart } from "app/clanky/[...path]/DatawrapperChart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ohlasy v číslech",
};

const Page = async () => {
  return (
    <main>
      <Section title="Vydané texty">
        <DatawrapperChart id="rIozs" />
        <DatawrapperChart id="eKqhH" />
      </Section>
      <Section title="Dary od čtenářstva">
        <DatawrapperChart id="16wqV" />
        <DatawrapperChart id="sTTab" />
        <DatawrapperChart id="HrbmM" />
      </Section>
      <Section title="Diverzita">
        <DatawrapperChart id="hUM06" />
        <DatawrapperChart id="N5X4r" />
        <DatawrapperChart id="CWiCY" />
        <DatawrapperChart id="HmlKw" />
      </Section>
      <Section title="Návštěvnost webu">
        <iframe
          plausible-embed
          title="Plausible Analytics"
          className="w-full h-[500px] col-span-2 mt-7"
          src="https://plausible.io/share/ohlasy.info?auth=-aOd5Bi-4jyxpKQMlPrtI&embed=true&theme=light"
          loading="lazy"
        ></iframe>
        <script async src="https://plausible.io/js/embed.host.js"></script>
      </Section>
    </main>
  );
};

const Section = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <section className="mb-20">
    <h2 className="text-3xl uppercase font-bold bg-lightGray px-3 py-4">
      {title}
    </h2>
    <div className="grid lg:grid-cols-2 gap-7">{children}</div>
  </section>
);

export default Page;
