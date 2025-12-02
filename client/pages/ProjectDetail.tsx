import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Project } from "@shared/api";
import { ChevronLeft, Github, ExternalLink, Edit, Eye, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getUser, authHeader } from "@/lib/auth";
import { motion, useAnimation } from "framer-motion"; // [수정 1] useAnimation 추가

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  // [수정 2] 애니메이션 수동 제어를 위한 컨트롤러 생성
  const heartControls = useAnimation();

  const fetchProject = () => {
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

  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!project) return;

    const wasLiked = (project as any).isLiked || project.liked;
    const currentCount = project.likeCount;

    // [수정 3] 좋아요를 '켜는' 순간에만 뿅! 하고 애니메이션 실행
    if (!wasLiked) {
      heartControls.start({
        scale: [1, 2, 1],
        rotate: [0, -30, 0],
        transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }
      });
    }

    // 낙관적 업데이트
    setProject((prev) => {
      if (!prev) return null;
      const newLikedStatus = !wasLiked;
      return {
        ...prev,
        liked: newLikedStatus,
        isLiked: newLikedStatus,
        likeCount: newLikedStatus ? currentCount + 1 : currentCount - 1,
      } as Project;
    });

    try {
      const res = await fetch(`/api/projects/${id}/like`, {
        method: "POST",
        headers: authHeader(),
      });

      if (!res.ok) {
        throw new Error("Failed to like");
      }
    } catch (err) {
      console.error(err);
      setProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          liked: wasLiked,
          isLiked: wasLiked,
          likeCount: currentCount,
        } as Project;
      });
      alert("오류가 발생하여 좋아요 처리에 실패했습니다.");
    }
  };

  if (loading) return null;
  if (!project) return <div className="p-20 text-center">Project not found</div>;

  const isMyProject = user && project.memberId === user.memberId;

  // 현재 좋아요 상태 확인
  const isLiked = (project as any).isLiked || project.liked;

  return (
    <div className="min-h-screen bg-background">
      <Header />

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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">About this Project</h2>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground" title="Views">
                    <Eye size={20} />
                    <span className="font-medium">{project.viewCount}</span>
                  </div>

                  <motion.button
                    onClick={handleLike}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition border ${
                      isLiked
                        ? "bg-pink-50 border-pink-200 text-pink-600"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                    title="Like this project"
                  >
                    {/* [수정 4] animate 속성을 heartControls로 변경 */}
                    <motion.div animate={heartControls}>
                      <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                    </motion.div>

                    <span className="font-medium">{project.likeCount}</span>
                  </motion.button>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </div>

          <div className="space-y-8">
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

            <div className="border rounded-xl p-6 bg-white shadow-sm">
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