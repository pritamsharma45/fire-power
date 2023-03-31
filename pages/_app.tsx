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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ToastContainer />
        </ApolloProvider>
      </SessionProvider>
    </Provider>
  );
}
