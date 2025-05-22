"use client";

import Head from 'next/head';
import { useEffect } from 'react';

const PwaHandler = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  }, []);

  return (
    <Head>
      <link rel="manifest" href="/manifest.webmanifest" />
      <meta name="theme-color" content="#BE29EC" />
    </Head>
  );
};

export default PwaHandler;
