import { useState } from "react";
import { useLocation } from "wouter"; // [수정 1] react-router-dom -> wouter
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

export default function Register() {
  const [, setLocation] = useLocation(); // [수정 2] useNavigate -> useLocation 사용
  const [formData, setFormData] = useState({
    username: "", password: "", nickname: "", jobTitle: "", techStack: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 콤마로 구분된 문자열을 리스트로 변환
    const payload = {
      ...formData,
      techStack: formData.techStack.split(",").map(t => t.trim()).filter(t => t.length > 0)
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("회원가입 성공! 로그인해주세요.");
        setLocation("/login"); // [수정 3] navigate -> setLocation
      } else {
        alert("회원가입 실패. 이미 존재하는 아이디일 수 있습니다.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Join Devfolio</h2>
            <p className="mt-2 text-muted-foreground">개발자 포트폴리오를 공유하세요</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">ID</label>
              <Input required onChange={(e) => setFormData({...formData, username: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Nickname</label>
              <Input required onChange={(e) => setFormData({...formData, nickname: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Job Title (e.g. Backend Dev)</label>
              <Input required onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Tech Stack (comma separated)</label>
              <Input placeholder="Java, Spring, React..." onChange={(e) => setFormData({...formData, techStack: e.target.value})} />
            </div>
            <Button type="submit" className="w-full mt-4">가입하기</Button>
          </form>
        </div>
      </div>
    </div>
  );
}