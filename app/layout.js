
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";
import Script from 'next/script';


export const metadata = {
  title: "EasyTransact",
  description: "EasyTransact",
};

export default function RootLayout({ children }) {
  return (
   
      <html lang="en">
        <head>
        <meta name="google-site-verification" content="onvUyUpxsVaOX8GSrFN6nCQoO5AAcaxK9F_XGNtl9O4" />
        <script src="https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js"></script>
        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-SWE283609G"
            strategy="afterInteractive"
          />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SWE283609G');
            `}
        </Script>
        </head>
        <body>
          <Toaster />
          {children}
        </body>
      </html>
  
  );
}
