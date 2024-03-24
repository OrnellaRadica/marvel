import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Inter } from "next/font/google";
import styled from "styled-components";

const inter = Inter({ subsets: ["latin"] });

const Root = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
const Main = styled.div`
  flex-grow: 1;
`

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Root className={inter.className}>
      <Header />
      <Main >
        <Component {...pageProps} />
      </Main>
      <Footer {...pageProps} />
    </Root>
  );
}
