import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Project } from "@shared/api";
import { ExternalLink, Github } from "lucide-react";

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Discover Developer Portfolios</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          전 세계 개발자들의 멋진 프로젝트를 탐험해보세요.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
              {p.imageUrls && p.imageUrls.length > 0 ? (
                <img src={p.imageUrls[0]} alt={p.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-secondary flex items-center justify-center">No Image</div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <span className="text-xs text-muted-foreground">by {p.authorName}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.techStack.map((t, i) => (
                    <span key={i} className="text-xs border px-2 py-1 rounded">{t}</span>
                  ))}
                </div>
                <div className="flex justify-end gap-3">
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" className="hover:scale-110 transition"><Github size={18} /></a>}
                  {p.websiteUrl && <a href={p.websiteUrl} target="_blank" className="hover:scale-110 transition"><ExternalLink size={18} /></a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}