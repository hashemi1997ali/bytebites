import './globals.css'
import Navbar from './components/Navbar'

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
      </body>
    </html>
  )
}