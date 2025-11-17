import { ChevronDown, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-bold text-black flex-shrink-0" style={{ fontFamily: "JetBrains Mono, monospace", letterSpacing: "-0.02em" }}>
          DEVFOLIO
        </Link>

        {/* Main Navigation - Desktop */}
        <div className="hidden lg:flex items-center gap-6 ml-8">
          <Link to="#" className="text-foreground font-medium text-sm hover:text-black transition">
            Developers
          </Link>

          {/* Resources with Badge */}
          <div className="flex items-center gap-2">
            <Link to="#" className="text-foreground font-medium text-sm hover:text-black transition">
              Resources
            </Link>
            <span className="bg-black text-white text-xs px-2 py-0.5 rounded font-semibold">
              New
            </span>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-center px-6">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search portfolios..."
              className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground placeholder-muted-foreground rounded border border-border focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>
        </div>

        {/* Right Actions - Desktop */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <button className="text-foreground font-medium text-sm hover:text-black transition">
            Login
          </button>
          <button className="bg-black text-white px-4 py-2 rounded font-medium text-sm hover:opacity-90 transition">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border py-4 px-4">
          <div className="space-y-3">
            <Link to="#" className="block text-foreground font-medium py-2 hover:text-black">
              Developers
            </Link>
            <div className="flex items-center gap-2 py-2">
              <span className="text-foreground font-medium">Resources</span>
              <span className="bg-black text-white text-xs px-2 py-0.5 rounded font-semibold">
                New
              </span>
            </div>
            <div className="pt-3 border-t border-border space-y-2">
              <button className="w-full text-black font-medium py-2 hover:text-gray-700 transition">
                Login
              </button>
              <button className="w-full bg-black text-white px-4 py-2 rounded font-medium hover:opacity-90 transition">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
