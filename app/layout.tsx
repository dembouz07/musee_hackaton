import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Musée des Civilisations Noires",
  description: "Découvrez le patrimoine culturel africain à travers une expérience digitale immersive",
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="fr">
      <head>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"/>
          <script dangerouslySetInnerHTML={{__html: 'eruda.init();'}}/>
          <script async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7432114644358102"
                  crossOrigin="anonymous"></script>
      </head>
      <body className={`font-sans ${GeistSans.variable} ${playfair.variable}`}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <Analytics />
      </body>
      </html>
  )
}