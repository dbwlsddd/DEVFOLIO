import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { authHeader } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { Project } from "@shared/api";
import { X } from "lucide-react"; // 삭제 아이콘

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: "", description: "", githubUrl: "", websiteUrl: "", techStack: ""
  });

  // 이미지 관리 상태
  const [existingImages, setExistingImages] = useState<string[]>([]); // 기존 이미지 URL들
  const [newFiles, setNewFiles] = useState<FileList | null>(null);    // 새로 추가할 파일들

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => { if (!res.ok) throw new Error("Load failed"); return res.json(); })
      .then((data: Project) => {
        setFormData({
          title: data.title,
          description: data.description,
          githubUrl: data.githubUrl || "",
          websiteUrl: data.websiteUrl || "",
          techStack: (data.techStack || []).join(", "),
        });
        setExistingImages(data.imageUrls || []); // 기존 이미지 불러오기
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("정보 로드 실패");
        setLocation("/");
      });
  }, [id, setLocation]);

  // 기존 이미지 삭제 핸들러 (화면에서만 제거, 실제 삭제는 저장 버튼 누를 때)
  const handleDeleteExisting = (indexToRemove: number) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    // JSON 데이터 (유지할 기존 이미지 리스트 포함)
    const projectData = {
      ...formData,
      techStack: formData.techStack.split(",").map(s => s.trim()).filter(s => s.length > 0),
      imageUrls: existingImages // 남길 기존 이미지들
    };

    // 'data' 파트에 JSON 추가
    data.append("data", new Blob([JSON.stringify(projectData)], { type: "application/json" }));

    // 'newImages' 파트에 새 파일들 추가
    if (newFiles) {
      Array.from(newFiles).forEach(file => data.append("newImages", file));
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { ...authHeader() }, // Content-Type은 자동 설정됨
        body: data,
      });

      if (res.ok) {
        alert("수정 완료!");
        setLocation(`/project/${id}`);
      } else {
        alert("수정 실패");
      }
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border shadow-sm">

          {/* 기본 정보 입력 필드들 (생략 없이 넣어주세요) */}
          <div>
            <label className="block mb-2 text-sm font-medium">Project Title</label>
            <Input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <Textarea required className="h-32" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          {/* ... GitHub URL, Website URL, Tech Stack 등 기존 입력 필드들 동일하게 유지 ... */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">GitHub URL</label>
              <Input value={formData.githubUrl} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Website URL</label>
              <Input value={formData.websiteUrl} onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Tech Stack</label>
            <Input value={formData.techStack} onChange={(e) => setFormData({...formData, techStack: e.target.value})} />
          </div>

          {/* --- 이미지 관리 영역 --- */}
          <div>
            <label className="block mb-2 text-sm font-medium">Current Images</label>
            {existingImages.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 mb-4">
                {existingImages.map((url, idx) => (
                  <div key={idx} className="relative group flex-shrink-0 w-32 h-20 border rounded overflow-hidden">
                    <img src={url} alt="project" className="w-full h-full object-cover" />
                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={() => handleDeleteExisting(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No images uploaded.</p>
            )}

            <label className="block mb-2 text-sm font-medium">Add New Images</label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNewFiles(e.target.files)}
            />
            <p className="text-xs text-gray-500 mt-1">Select multiple files to add.</p>
          </div>

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </div>
    </div>
  );
}