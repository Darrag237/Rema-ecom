import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "@/components/auth-provider"
import { Noto_Sans_Arabic } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"] })
export const metadata: Metadata = {
  title: "Rima - متجر الملابس النسائية",
  description: "متجر Rima للملابس النسائية - تسوق أحدث صيحات الموضة",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
