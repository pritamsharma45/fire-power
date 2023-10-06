import "../styles/tailwind.css";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/apollo";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Provider } from "react-redux";
import store from "../store/store";
import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {

  const CustomComponent = (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload">
        {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                page_path: window.location.pathname,
                });
            `}
      </Script>


      <Component {...pageProps} />
    </>
  );
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <Layout>
            {/* <Component {...pageProps} /> */}
            {CustomComponent}
          </Layout>
          <ToastContainer />
        </ApolloProvider>
      </SessionProvider>
    </Provider>
  );
}
