import Header from "@/components/Header";
import { ChevronRight, Code, Github, ExternalLink, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// 백엔드 데이터 구조에 맞춘 인터페이스 정의
interface Portfolio {
  id: number;
  name: string;
  title: string;
  description: string;
  role: string;
  techStack: string[];
  featured: boolean;
}

export default function Index() {
  // 포트폴리오 데이터를 저장할 State
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  // 컴포넌트가 마운트될 때 백엔드에서 데이터 불러오기 (READ)
  useEffect(() => {
    fetch("/api/portfolios")
      .then((res) => res.json())
      .then((data) => setPortfolios(data))
      .catch((err) => console.error("Failed to fetch portfolios:", err));
  }, []);

  // 포트폴리오 삭제 핸들러 (DELETE)
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Link 이동 방지
    e.stopPropagation(); // 상위 클릭 이벤트 전파 방지

    if (!confirm("정말 이 포트폴리오를 삭제하시겠습니까?")) return;

    try {
      await fetch(`/api/portfolios/${id}`, { method: "DELETE" });
      // 성공 시 화면 목록에서도 제거
      setPortfolios(portfolios.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  // 데모 데이터 추가 핸들러 (CREATE 테스트용)
  const handleCreateDemo = async () => {
    const newPortfolio = {
      name: "New Developer",
      title: "Spring Boot Master",
      description: "Learning Full Stack Development",
      role: "Student",
      techStack: ["Java", "Spring", "React"],
      featured: false,
      bio: "Passionate about building scalable web applications with Java and Spring Boot.",
      github: "https://github.com",
      website: "https://google.com"
    };

    try {
      const res = await fetch("/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPortfolio),
      });

      if (res.ok) {
        const data = await res.json();
        setPortfolios([...portfolios, data]); // 기존 목록에 새 아이템 추가
      } else {
        console.error("Failed to create portfolio");
      }
    } catch (err) {
      console.error("Error creating portfolio:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight break-words">
              Discover Inspiring Developer Portfolios
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore remarkable portfolios from talented developers around the world. Find inspiration, connect with creators, and showcase your own work.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Portfolios Grid */}
      <section className="px-6 md:px-8 mb-16 md:mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured Developer Portfolios
            </h2>
            {/* 데모 데이터 추가 버튼 (테스트용) */}
            <button
              onClick={handleCreateDemo}
              className="bg-black text-white px-5 py-2.5 rounded-md font-medium hover:bg-gray-800 transition shadow-md active:scale-95"
            >
              + Add Demo Portfolio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                <p className="text-xl">No portfolios found. Try adding one!</p>
              </div>
            ) : (
              portfolios.map((portfolio) => (
                <Link
                  key={portfolio.id}
                  to={`/portfolio/${portfolio.id}`}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 hover:border-black/50 transition-all duration-300 shadow-lg relative block"
                >
                  {/* 삭제 버튼 (카드 우측 상단) */}
                  <button
                    onClick={(e) => handleDelete(e, portfolio.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-600 shadow-md"
                    title="Delete Portfolio"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Image Placeholder */}
                  <div className="w-full h-48 md:h-56 bg-gradient-to-br from-black/10 to-black/5 border-b border-white/20 flex items-center justify-center group-hover:from-black/15 group-hover:to-black/10 transition">
                    <Code size={48} className="text-black opacity-20 group-hover:opacity-30 transition" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {portfolio.name}
                    </h3>
                    <p className="text-black text-sm font-semibold mb-3">
                      {portfolio.role}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {portfolio.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {portfolio.techStack && portfolio.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium text-black bg-black/10 border border-black/30 px-3 py-1 rounded-full hover:bg-black/20 transition"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* View Portfolio Link */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-xs text-muted-foreground">View Portfolio</span>
                      <ExternalLink size={16} className="text-black group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-12 md:py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Share Your Portfolio?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join our community and showcase your projects, skills, and achievements to the world.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded font-semibold hover:opacity-90 transition">
            Publish Your Portfolio
          </button>
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