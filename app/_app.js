import { Provider as TitleBalanceProvider } from "react-wrap-balancer";

export default function MyApp({ Component, pageProps }) {
  return (
    <TitleBalanceProvider>
      <Component {...pageProps} />
    </TitleBalanceProvider>
  );
}
