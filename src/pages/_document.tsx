/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from 'next/document'
// import 'flowbite'
export default function Document() {
  return (
    <Html>
      <Head >
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://unpkg.com/flowbite@1.4.5/dist/flowbite.min.css" />
        
      </Head>
      <body>
        <Main />
        <NextScript />
      
        <script src="https://unpkg.com/flowbite@1.4.5/dist/flowbite.js"></script>
      </body>
    </Html>
  )
}