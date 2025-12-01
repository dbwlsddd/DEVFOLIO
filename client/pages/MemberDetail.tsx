import Header from "@/components/Header";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ExternalLink, Github, Edit2, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Member } from "@shared/api"; // Portfolio 대신 Member
import { getUser } from "@/lib/auth"; // 로그인 유저 확인용

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // 현재 로그인한 사용자의 ID 가져오기 (본인 프로필인지 확인용)
  const currentUser = getUser();
  const isMyProfile = currentUser && member && currentUser.memberId === member.id;

  // 데이터 불러오기 (Member + Projects)
  useEffect(() => {
    if (!id) return;

    fetch(`/api/members/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Member not found');
        return res.json();
      })
      .then((data: Member) => {
        setMember(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch member:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] text-xl text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <h1 className="text-4xl font-bold text-foreground mb-4">Developer Not Found</h1>
          <p className="text-muted-foreground text-lg mb-8">
            We couldn't find the developer you're looking for.
          </p>
          <Link to="/" className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded font-medium hover:opacity-90 transition">
            <ChevronLeft size={20} />
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back & Edit Buttons */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-black hover:opacity-70 transition w-fit">
            <ChevronLeft size={20} />
            Back to Browse
          </Link>

          {/* 본인 프로필일 때만 수정 버튼 노출 (경로는 재사용) */}
          {isMyProfile && (
            <Link
              to={`/portfolio/edit/${member.id}`} // 경로는 기존 유지하되 내용은 EditProfile임
              className="flex items-center gap-2 border border-black text-black px-4 py-2 rounded font-medium hover:bg-black/5 transition text-sm"
            >
              <Edit2 size={16} />
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* Developer Profile Header */}
      <section className="bg-white py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
                {member.nickname}
              </h1>
              <p className="text-xl text-primary font-semibold mb-4">
                {member.jobTitle}
              </p>
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl whitespace-pre-line">
                {member.bio || "No bio provided yet."}
              </p>

              <div className="flex gap-4">
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded font-medium hover:opacity-90 transition"
                  >
                    <Github size={20} />
                    GitHub
                  </a>
                )}
                {member.blogUrl && (
                  <a
                    href={member.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-black text-black px-6 py-3 rounded font-medium hover:bg-black/5 transition"
                  >
                    <LinkIcon size={20} />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      {member.techStack && member.techStack.length > 0 && (
        <section className="bg-white py-12 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {member.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-sm font-medium text-black bg-black/10 border border-black/30 px-4 py-2 rounded-full"
                >
                    {tech}
                  </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects List */}
      <section className="bg-gray-50 py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">
            Projects ({member.projects ? member.projects.length : 0})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {member.projects && member.projects.length > 0 ? (
              member.projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition flex flex-col"
                >
                  {/* 프로젝트 썸네일 (있으면 표시) */}
                  {project.imageUrls && project.imageUrls.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gray-100 border">
                      <img src={project.imageUrls[0]} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-black mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                    {project.description}
                  </p>

                  {/* 프로젝트 기술 스택 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, techIdx) => (
                      <span
                        key={techIdx}
                        className="text-xs font-medium text-muted-foreground bg-gray-100 border px-2 py-1 rounded"
                      >
                         {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-auto pt-4 border-t">
                    <Link to={`/project/${project.id}`} className="text-sm font-bold underline hover:text-primary">
                      View Details
                    </Link>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" className="text-gray-500 hover:text-black"><Github size={18}/></a>
                    )}
                    {project.websiteUrl && (
                      <a href={project.websiteUrl} target="_blank" className="text-gray-500 hover:text-black"><ExternalLink size={18}/></a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-10">
                등록된 프로젝트가 없습니다.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}