export const metadata = {
  title: 'ByteBites',
  description: 'Recipe app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
