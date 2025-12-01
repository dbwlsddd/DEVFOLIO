import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authHeader } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";

export default function CreateProject() {
  const navigate = useNavigate();
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
      techStack: formData.techStack.split(",").map(s => s.trim())
    };
    data.append("data", new Blob([JSON.stringify(projectData)], { type: "application/json" }));

    // 파일 추가
    if (files) {
      Array.from(files).forEach(file => data.append("images", file));
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { ...authHeader() }, // 토큰 헤더 추가 (Content-Type은 자동 설정됨)
        body: data,
      });

      if (res.ok) {
        alert("프로젝트 등록 성공!");
        navigate("/my-page");
      } else {
        alert("등록 실패. 로그인이 필요하거나 입력이 잘못되었습니다.");
      }
    } catch (err) {
      console.error(err);
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
            <label className="block mb-2 text-sm font-medium">Screenshots</label>
            <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
          </div>
          <Button type="submit" className="w-full">Register Project</Button>
        </form>
      </div>
    </div>
  );
}