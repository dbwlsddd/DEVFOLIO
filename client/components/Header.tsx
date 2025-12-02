import { useState } from "react";
import { Link, useLocation } from "wouter"; // [수정] react-router-dom -> wouter 로 변경
import { Menu, X } from "lucide-react";
import { getUser, logout } from "@/lib/auth";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation(); // 현재 경로 확인용 (선택 사항)
  const user = getUser();

  // wouter의 Link 컴포넌트는 'to' 대신 'href' 속성을 사용하는 것이 기본이지만,
  // 최신 버전에서는 'to'도 지원할 수 있습니다.
  // 호환성을 위해 아래 코드에서는 기존 'to'를 그대로 두었으나,
  // 만약 작동하지 않으면 'to'를 모두 'href'로 바꿔주세요.

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* react-router-dom의 Link 대신 wouter의 Link 사용 */}
        <Link href="/" className="text-2xl font-bold font-mono cursor-pointer">DEVFOLIO</Link>

        {/*<div className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium hover:text-primary cursor-pointer ${location === '/' ? 'text-primary' : ''}`}>Resources</Link>
          <Link href="/developers" className="text-sm font-medium hover:text-primary cursor-pointer">Developers</Link>
        </div>*/}

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href="/mypage" className="text-sm font-medium cursor-pointer">@{user.nickname}</Link>
              <button onClick={logout} className="text-sm text-red-500 hover:underline cursor-pointer">Logout</button>
              <Link href="/project/create" className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90 cursor-pointer">
                Add Project
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:underline cursor-pointer">Login</Link>
              <Link href="/register" className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90 cursor-pointer">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* 모바일 메뉴 (옵션) */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 bg-white border-t">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Resources</Link>
            <Link href="/developers" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Developers</Link>
            {user ? (
              <>
                <Link href="/mypage" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">My Page</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-sm text-red-500">Logout</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}