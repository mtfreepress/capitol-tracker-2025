// pages/_app.js
import '../styles/globals.css';
import { css, Global } from '@emotion/react';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}