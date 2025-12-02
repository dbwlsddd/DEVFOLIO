import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Project } from "@shared/api";
import { ChevronLeft, Github, ExternalLink, Edit, Eye, Heart } from "lucide-react"; // [추가] Eye, Heart 아이콘
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getUser, authHeader } from "@/lib/auth"; // authHeader 추가

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  // 데이터 불러오기 함수 (재사용을 위해 분리)
  const fetchProject = () => {
    // 로그인 상태라면 헤더를 포함해서 요청해야 '좋아요 여부'를 알 수 있음
    const headers = user ? authHeader() : {};

    fetch(`/api/projects/${id}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // 좋아요 핸들러
  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}/like`, {
        method: "POST",
        headers: authHeader(),
      });

      if (res.ok) {
        // 성공 시 데이터 새로고침 (좋아요 수 및 상태 업데이트)
        fetchProject();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;
  if (!project) return <div className="p-20 text-center">Project not found</div>;

  const isMyProject = user && project.memberId === user.memberId;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* 상단 네비게이션 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition w-fit">
            <ChevronLeft size={16} /> Back to Browse
          </Link>

          {isMyProject && (
            <Link href={`/project/edit/${id}`} className="flex items-center gap-2 text-sm font-medium border px-3 py-1.5 rounded hover:bg-slate-50 transition">
              <Edit size={16} /> Edit Project
            </Link>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* 왼쪽: 이미지 갤러리 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl overflow-hidden border bg-slate-100">
              {project.imageUrls && project.imageUrls.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {project.imageUrls.map((url, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-video relative flex items-center justify-center bg-black">
                          <img src={url} alt={`Screenshot ${index + 1}`} className="object-contain w-full h-full" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {project.imageUrls.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="aspect-video flex items-center justify-center text-muted-foreground">
                  No Images Available
                </div>
              )}
            </div>

            {/* [추가] 통계 및 설명 영역 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">About this Project</h2>

                {/* 조회수 & 좋아요 표시 */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground" title="Views">
                    <Eye size={20} />
                    <span className="font-medium">{project.viewCount}</span>
                  </div>

                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition border ${
                      project.liked
                        ? "bg-pink-50 border-pink-200 text-pink-600"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                    title="Like this project"
                  >
                    <Heart size={18} fill={project.liked ? "currentColor" : "none"} />
                    <span className="font-medium">{project.likeCount}</span>
                  </button>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </div>

          {/* 오른쪽: 정보 및 작성자 카드 */}
          <div className="space-y-8">
            {/* ... 기존 내용 유지 ... */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <div className="flex flex-wrap gap-2 mt-4">
                {(project.techStack || []).map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {t}
                    </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 border rounded-lg font-medium hover:bg-slate-50 transition">
                  <Github size={20} /> View Source Code
                </a>
              )}
              {project.websiteUrl && (
                <a href={project.websiteUrl} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition">
                  <ExternalLink size={20} /> Visit Website
                </a>
              )}
            </div>

            {/* 작성자 카드 유지 ... */}
            <div className="border rounded-xl p-6 bg-white shadow-sm">
              {/* ... (기존 코드와 동일) ... */}
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Created By</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xl font-bold text-slate-500">
                  {project.authorName ? project.authorName[0].toUpperCase() : "U"}
                </div>
                <div>
                  <div className="font-bold text-lg">{project.authorName}</div>
                  <div className="text-sm text-muted-foreground">{project.authorJob}</div>
                </div>
              </div>
              {project.memberId && (
                <Link href={`/portfolio/${project.memberId}`} className="block w-full text-center py-2 text-sm border rounded hover:bg-slate-50 transition">
                  View Developer Profile
                </Link>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}