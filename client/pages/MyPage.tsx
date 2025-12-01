import { useEffect, useState } from "react";
import { authHeader, getUser } from "@/lib/auth";
import { Project } from "@shared/api";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { ExternalLink, Github, Plus } from "lucide-react";

export default function MyPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const user = getUser();

  useEffect(() => {
    fetch("/api/projects/my", { headers: authHeader() })
      .then(res => res.ok ? res.json() : [])
      .then(setProjects)
      .catch(err => console.error(err));
  }, []);

  if (!user) return <div className="p-10 text-center">로그인이 필요합니다.</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{user.nickname}'s Portfolio</h1>
            <p className="text-muted-foreground mt-1">@{user.username}</p>
          </div>
          <Link to="/project/create" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
            <Plus size={16} /> Add Project
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-20">등록된 프로젝트가 없습니다.</p>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                {p.imageUrls && p.imageUrls.length > 0 ? (
                  <img src={p.imageUrls[0]} alt={p.title} className="w-full h-48 object-cover bg-gray-100" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.techStack.map((t, i) => (
                      <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" className="text-gray-600 hover:text-black"><Github size={18} /></a>}
                    {p.websiteUrl && <a href={p.websiteUrl} target="_blank" className="text-gray-600 hover:text-black"><ExternalLink size={18} /></a>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}