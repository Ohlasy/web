import { GetStaticProps, NextPage } from "next";

export type PageProps = {};

const Page: NextPage<PageProps> = () => <div>Tady bude titulní stránka.</div>;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return {
    props: {},
    revalidate: 300, // update every 5 minutes
  };
};

export default Page;
