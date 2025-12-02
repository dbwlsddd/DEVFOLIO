import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Project, Member } from "@shared/api";
import { ExternalLink, Github, Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
// [삭제] 기존 Tabs 컴포넌트 import 제거
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"; // [추가] 모션 라이브러리

export default function Index() {
  const [viewMode, setViewMode] = useState<"developers" | "projects">("developers");
  const [items, setItems] = useState<(Project | Member)[]>([]);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState<"name" | "stack">("name");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [viewMode, keyword, searchType]);

  useEffect(() => {
    const endpoint = viewMode === "developers" ? "/api/members" : "/api/projects";
    const query = `?page=${page}&size=9&keyword=${keyword}&type=${searchType}`;

    fetch(`${endpoint}${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setItems(data.content);
          setTotalPages(data.totalPages);
        } else {
          setItems(Array.isArray(data) ? data : []);
          setTotalPages(1);
        }
      })
      .catch(console.error);
  }, [viewMode, keyword, searchType, page]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Discover Devfolio</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          전 세계 개발자들과 그들의 놀라운 프로젝트를 탐색하세요.
        </p>

        {/* --- [수정] 슬라이딩 탭 디자인 (Framer Motion) --- */}
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="relative flex p-1 bg-slate-100 rounded-full w-[300px] h-[50px]">

              {/* Developers 탭 */}
              <button
                onClick={() => setViewMode("developers")}
                className={`relative flex-1 text-sm font-semibold rounded-full z-10 transition-colors duration-200 ${
                  viewMode === "developers" ? "text-black" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Developers
                {/* 선택되었을 때만 뒤에 하얀 배경이 깔림 (layoutId로 연결됨) */}
                {viewMode === "developers" && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm border border-black/5"
                    style={{ zIndex: -1 }} // 글자보다 뒤에 가도록
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} // 쫀득한 스프링 효과
                  />
                )}
              </button>

              {/* Projects 탭 */}
              <button
                onClick={() => setViewMode("projects")}
                className={`relative flex-1 text-sm font-semibold rounded-full z-10 transition-colors duration-200 ${
                  viewMode === "projects" ? "text-black" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Projects
                {viewMode === "projects" && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm border border-black/5"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <select
              className="border rounded px-3 text-sm h-10"
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
                className="pl-10 h-10"
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
          {items.map((item: any) => (
            <div key={item.id} className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col h-full">

              {viewMode === "projects" ? (
                <Link href={`/project/${item.id}`} className="cursor-pointer block">
                  {item.imageUrls && item.imageUrls.length > 0 ? (
                    <img src={item.imageUrls[0]} alt={item.title} className="w-full h-48 object-cover transition group-hover:opacity-90" />
                  ) : (
                    <div className="w-full h-48 bg-secondary flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </Link>
              ) : (
                <Link href={`/portfolio/${item.id}`} className="cursor-pointer block">
                  <div className="w-full h-32 bg-slate-100 flex items-center justify-center">
                    <User size={48} className="text-slate-300" />
                  </div>
                </Link>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <Link href={viewMode === "projects" ? `/project/${item.id}` : `/portfolio/${item.id}`}>
                    <h3 className="font-bold text-lg hover:text-primary cursor-pointer transition">
                      {viewMode === "developers" ? item.nickname : item.title}
                    </h3>
                  </Link>

                  {viewMode === "projects" && (
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">by {item.authorName}</span>
                      {(item.viewCount !== undefined) && (
                        <span className="text-xs text-gray-400 mt-1">👀 {item.viewCount}</span>
                      )}
                    </div>
                  )}
                  {viewMode === "developers" && (
                    <span className="text-xs text-muted-foreground">{item.jobTitle}</span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {viewMode === "developers" ? item.bio || "No bio available." : item.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(item.techStack || []).slice(0, 4).map((t: string, i: number) => (
                    <span key={i} className="text-xs border px-2 py-1 rounded bg-gray-50">{t}</span>
                  ))}
                  {(item.techStack || []).length > 4 &&
                    <span className="text-xs text-muted-foreground">+{item.techStack.length - 4}</span>}
                </div>

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

        {/* 페이지네이션 UI */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft size={16} />
            </Button>

            <span className="text-sm font-medium">
              Page {page + 1} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}