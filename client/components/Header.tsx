import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { getUser, logout } from "@/lib/auth";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = getUser();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold font-mono">DEVFOLIO</Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">Resources</Link>
          <Link to="/developers" className="text-sm font-medium hover:text-primary">Developers</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/my-page" className="text-sm font-medium">@{user.nickname}</Link>
              <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
              <Link to="/project/create" className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90">
                Add Project
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:underline">Login</Link>
              <Link to="/register" className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
}