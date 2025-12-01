import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setToken, setUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        // memberId도 같이 저장 (나중에 상세 페이지 이동 등에 사용)
        setUser({
          memberId: data.memberId,
          username: data.username,
          nickname: data.nickname
        });
        alert("로그인 성공!");
        navigate("/");
      } else {
        alert("로그인 실패: 아이디나 비밀번호를 확인하세요.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="mt-2 text-muted-foreground">Devfolio에 로그인하세요</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">ID (Username)</label>
              <Input
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full">로그인</Button>
          </form>
          <div className="text-center text-sm">
            계정이 없으신가요? <Link to="/register" className="underline font-bold">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}