// [업로드된 파일: dbwlsddd/devfolio/DEVFOLIO-dbb00499082e35b2b5d54ff0d97aa50d78692051/client/pages/PortfolioDetail.tsx]
import Header from "@/components/Header";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ExternalLink, Github, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Portfolio } from "@shared/api"; // 공유된 타입 사용

// 프로젝트 데이터 타입 (projectsJson을 파싱하여 사용한다고 가정)
interface Project {
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  // 데이터 불러오기 (READ One)
  useEffect(() => {
    if (!id) {
      navigate('/404');
      return;
    }

    fetch(`/api/portfolios/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Portfolio not found');
        }
        return res.json();
      })
      .then((data: Portfolio) => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch portfolio:", err);
        setLoading(false);
        setPortfolio(null); // 데이터를 찾지 못하면 null로 설정
      });
  }, [id, navigate]);

  // projectsJson 필드가 있다면 파싱하여 사용
  const projects: Project[] = portfolio?.projectsJson ? JSON.parse(portfolio.projectsJson) : [];


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

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <h1 className="text-4xl font-bold text-foreground mb-4">404 Portfolio Not Found</h1>
          <p className="text-muted-foreground text-lg mb-8">
            We couldn't find the portfolio you're looking for (ID: {id}).
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

      {/* Back Button */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-black hover:opacity-70 transition w-fit">
            <ChevronLeft size={20} />
            Back to Portfolio
          </Link>
          {/* 수정 버튼 */}
          <Link
            to={`/portfolio/edit/${portfolio.id}`}
            className="flex items-center gap-2 border border-black text-black px-4 py-2 rounded font-medium hover:bg-black/5 transition text-sm"
          >
            <Edit2 size={16} />
            Edit
          </Link>
        </div>
      </div>

      {/* Portfolio Header */}
      <section className="bg-white py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            {/* Profile */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
                {portfolio.name}
              </h1>
              <p className="text-xl text-black font-semibold mb-2">
                {portfolio.title}
              </p>
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
                {portfolio.bio}
              </p>
              <div className="flex gap-4">
                <a
                  href={portfolio.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded font-medium hover:opacity-90 transition"
                >
                  <Github size={20} />
                  GitHub
                </a>
                <a
                  href={portfolio.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-black text-black px-6 py-3 rounded font-medium hover:bg-black/5 transition"
                >
                  <ExternalLink size={20} />
                  Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-white py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-3">
            {portfolio.techStack.map((tech: string, idx: number) => (
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

      {/* Projects */}
      <section className="bg-white py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.length > 0 ? (
              projects.map((project: Project, idx: number) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border border-border rounded-xl p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-bold text-black mb-2">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech: string, techIdx: number) => (
                      <span
                        key={techIdx}
                        className="text-xs font-medium text-black bg-white border border-black/20 px-3 py-1 rounded"
                      >
                                    {tech}
                                </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-black hover:opacity-70 transition font-medium"
                  >
                    View Project <ExternalLink size={16} />
                  </a>
                </div>
              ))
            ) : (
              <p className="col-span-full text-muted-foreground">No featured projects found.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-12 md:py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Inspired by this portfolio?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Create your own and join our community of talented developers.
          </p>
          <Link to="/portfolio/create" className="bg-white text-black px-8 py-3 rounded font-semibold hover:opacity-90 transition">
            Publish Your Portfolio
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 DEVFOLIO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}