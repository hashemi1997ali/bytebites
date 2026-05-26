import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="navbar__logo">
          Byte<span>Bites</span>
        </Link>
        <ul className="navbar__links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/recipes">Rezepte</Link></li>
          <li><Link href="/cookbook">Kochbuch</Link></li>
        </ul>
      </div>
    </nav>
  )
}