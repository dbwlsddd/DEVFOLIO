import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Project, Member } from "@shared/api";
import { ExternalLink, Github, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter"; // [수정 1] wouter만 남기고 react-router-dom 제거

export default function Index() {
  const [viewMode, setViewMode] = useState<"developers" | "projects">("developers");
  const [items, setItems] = useState<(Project | Member)[]>([]);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState<"name" | "stack">("name");

  useEffect(() => {
    const endpoint = viewMode === "developers" ? "/api/members" : "/api/projects";
    const query = keyword ? `?keyword=${keyword}&type=${searchType}` : "";

    fetch(`${endpoint}${query}`)
      .then(res => res.json())
      .then(setItems)
      .catch(console.error);
  }, [viewMode, keyword, searchType]);

  // [수정 2] return 문 추가 및 사라진 레이아웃(Header, 검색창 등) 복구
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Discover Devfolio</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          전 세계 개발자들과 그들의 놀라운 프로젝트를 탐색하세요.
        </p>

        {/* --- 검색 및 필터 컨트롤 --- */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-center">
            <Tabs defaultValue="developers" onValueChange={(val) => setViewMode(val as any)} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="developers">Developers</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex gap-2">
            <select
              className="border rounded px-3 text-sm"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as "name" | "stack")}
            >
              <option value="name">{viewMode === "developers" ? "Name" : "Title"}</option>
              <option value="stack">Tech Stack</option>
            </select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder={`Search ${viewMode}...`}
                className="pl-10"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 capitalize">{viewMode} List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* [수정 3] items.map 로직을 Grid 레이아웃 안으로 이동 */}
          {items.map((item: any) => (
            <div key={item.id} className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col h-full">

              {/* 이미지 영역 클릭 시 이동 처리 */}
              {viewMode === "projects" ? (
                <Link href={`/project/${item.id}`} className="cursor-pointer block">
                  {item.imageUrls && item.imageUrls.length > 0 ? (
                    <img src={item.imageUrls[0]} alt={item.title} className="w-full h-48 object-cover transition group-hover:opacity-90" />
                  ) : (
                    <div className="w-full h-48 bg-secondary flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </Link>
              ) : (
                // 개발자 모드는 프로필 이동
                <Link href={`/portfolio/${item.id}`} className="cursor-pointer block">
                  <div className="w-full h-32 bg-slate-100 flex items-center justify-center">
                    <User size={48} className="text-slate-300" />
                  </div>
                </Link>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  {/* 제목 클릭 시 이동 처리 */}
                  <Link href={viewMode === "projects" ? `/project/${item.id}` : `/portfolio/${item.id}`}>
                    <h3 className="font-bold text-lg hover:text-primary cursor-pointer transition">
                      {viewMode === "developers" ? item.nickname : item.title}
                    </h3>
                  </Link>

                  {viewMode === "projects" && (
                    <span className="text-xs text-muted-foreground">by {item.authorName}</span>
                  )}
                  {viewMode === "developers" && (
                    <span className="text-xs text-muted-foreground">{item.jobTitle}</span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {viewMode === "developers" ? item.bio || "No bio available." : item.description}
                </p>

                {/* 태그 부분 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(item.techStack || []).slice(0, 4).map((t: string, i: number) => (
                    <span key={i} className="text-xs border px-2 py-1 rounded bg-gray-50">{t}</span>
                  ))}
                  {(item.techStack || []).length > 4 &&
                    <span className="text-xs text-muted-foreground">+{item.techStack.length - 4}</span>}
                </div>

                {/* 하단 버튼 영역 */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t">
                  {viewMode === "developers" ? (
                    <Link href={`/portfolio/${item.id}`} className="text-sm font-medium hover:underline text-primary">
                      View Profile & Projects →
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <Link href={`/project/${item.id}`} className="text-sm font-medium hover:underline text-primary">
                        View Details →
                      </Link>
                      <div className="flex gap-3">
                        {item.githubUrl && <a href={item.githubUrl} target="_blank" className="hover:scale-110 transition text-gray-500 hover:text-black"><Github size={18} /></a>}
                        {item.websiteUrl && <a href={item.websiteUrl} target="_blank" className="hover:scale-110 transition text-gray-500 hover:text-black"><ExternalLink size={18} /></a>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}