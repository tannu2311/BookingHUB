
import './globals.css'
import "rsuite/dist/rsuite-no-reset.min.css";
import AppProvider from "./components/AppProvider";
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Libre_Franklin } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader';
const libre_Franklin = Libre_Franklin({ subsets: ['latin'] })

import connectToDatabase from '@/utils/dbconfig'

connectToDatabase();

export const metadata = {
  title: {
    default: process.env.APP_NAME,
    template: `%s | ${process.env.APP_NAME}`,
  },
  description: process.env.APP_DESCRIPTION,
  keywords: process.env.META_KEYWORDS,
  authors: process.env.META_AUTHOR
}


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <Head>
        <title>BookingHub</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link rel="icon" type="image/ico" href="/favicon.png" sizes='16x16' />
      </Head>
      <body className={`${libre_Franklin.className}`}>
      <NextTopLoader 
       color="#DD1047"
       initialPosition={0.08}
       crawlSpeed={100}
       height={3}
       crawl={true}
       showSpinner={true}
       easing="ease"
       speed={100}/>

        <AppProvider>
          {children}
        </AppProvider>

        <ToastContainer autoClose={2000} />
      </body>
    </html>
  )
}
