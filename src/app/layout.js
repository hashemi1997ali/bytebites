import './globals.css'
import Navbar from './components/Navbar'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'ByteBites — Recipe Diary',
  description: 'Discover, cook, and save your favourite recipes.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}