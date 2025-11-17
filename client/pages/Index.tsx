import Header from "@/components/Header";
import { ChevronRight, Code, Github, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const portfolios = [
    {
      id: 1,
      name: "Alex Chen",
      title: "Full Stack Developer",
      description: "Creative developer with expertise in modern web technologies",
      role: "Senior Developer",
      techStack: ["React", "Node.js", "TypeScript", "AWS"],
      featured: true,
    },
    {
      id: 2,
      name: "Sarah Williams",
      title: "UI/UX Engineer",
      description: "Designing delightful user experiences",
      role: "Product Designer",
      techStack: ["Figma", "React", "CSS", "Web Design"],
      featured: false,
    },
    {
      id: 3,
      name: "Marcus Johnson",
      title: "Backend Architect",
      description: "Building scalable cloud infrastructure",
      role: "DevOps Engineer",
      techStack: ["Python", "Docker", "Kubernetes", "AWS"],
      featured: false,
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      title: "Mobile Developer",
      description: "Native mobile app specialist",
      role: "Mobile Engineer",
      techStack: ["React Native", "Swift", "Kotlin", "Firebase"],
      featured: false,
    },
    {
      id: 5,
      name: "David Lee",
      title: "AI/ML Engineer",
      description: "Machine learning and AI solutions",
      role: "ML Engineer",
      techStack: ["Python", "TensorFlow", "PyTorch", "FastAPI"],
      featured: false,
    },
    {
      id: 6,
      name: "Jessica Smith",
      title: "Frontend Specialist",
      description: "Performance-focused frontend development",
      role: "Frontend Lead",
      techStack: ["Vue.js", "Next.js", "Tailwind", "GraphQL"],
      featured: false,
    },
  ];

  const stats = [
    { title: "Developers", count: "12,847" },
    { title: "Portfolios", count: "45,320" },
    { title: "Projects Showcase", count: "128,456" },
  ];

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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Featured Developer Portfolios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <Link
                key={portfolio.id}
                to={`/portfolio/${portfolio.id}`}
                className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 hover:border-black/50 transition-all duration-300 shadow-lg"
              >
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
                  <p className="text-muted-foreground text-sm mb-4">
                    {portfolio.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {portfolio.techStack.map((tech, idx) => (
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
            ))}
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
