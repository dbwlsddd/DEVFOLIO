import { useState } from "react";
import { useLocation } from "wouter"; // [수정 1] react-router-dom -> wouter
import { authHeader } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";

export default function CreateProject() {
  const [, setLocation] = useLocation(); // [수정 2] useNavigate -> useLocation
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    title: "", description: "", githubUrl: "", websiteUrl: "", techStack: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    // JSON 데이터는 Blob으로 감싸서 'data' 파트로 전송
    const projectData = {
      ...formData,
      // 콤마로 구분된 문자열을 리스트로 변환 (공백 제거 포함)
      techStack: formData.techStack.split(",").map(s => s.trim()).filter(s => s.length > 0)
    };
    data.append("data", new Blob([JSON.stringify(projectData)], { type: "application/json" }));

    // 파일 추가
    if (files) {
      Array.from(files).forEach(file => data.append("images", file));
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { ...authHeader() }, // 토큰 헤더 추가
        body: data,
      });

      if (res.ok) {
        alert("프로젝트 등록 성공!");
        setLocation("/mypage"); // [수정 3] navigate -> setLocation (/mypage로 경로 수정)
      } else {
        alert("등록 실패. 로그인이 필요하거나 입력이 잘못되었습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">Add New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border shadow-sm">
          <div>
            <label className="block mb-2 text-sm font-medium">Project Title</label>
            <Input required onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <Textarea required onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">GitHub URL</label>
              <Input onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Website URL</label>
              <Input onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Tech Stack (콤마로 구분)</label>
            <Input placeholder="React, Spring Boot, AWS" onChange={(e) => setFormData({...formData, techStack: e.target.value})} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Screenshots (Optional, URL 입력 방식 아님)</label>
            {/* 현재 백엔드는 이미지 업로드를 지원하지 않고 URL 리스트만 받도록 되어 있을 가능성이 높습니다.
                만약 백엔드 수정 전이라면 이 부분은 작동하지 않을 수 있으니 참고하세요.
                (이전 답변에서 제안드린 이미지 업로드 기능 구현이 필요합니다) */}
            <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
          </div>
          <Button type="submit" className="w-full">Register Project</Button>
        </form>
      </div>
    </div>
  );
}