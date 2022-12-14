import { PT_Serif } from "@next/font/google";
import "components/shared.css";

// https://nextjs.org/docs/basic-features/font-optimization
const mainFont = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={mainFont.className}>
      <Component {...pageProps} />
    </div>
  );
}
