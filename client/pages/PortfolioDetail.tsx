import Header from "@/components/Header";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ExternalLink, Github } from "lucide-react";

// Sample portfolio data
const portfolioData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Alex Chen",
    title: "Full Stack Developer",
    role: "Senior Developer",
    description: "Creative developer with expertise in modern web technologies",
    bio: "Passionate about building scalable web applications with React, Node.js, and TypeScript. Based in San Francisco with 8+ years of experience in full-stack development.",
    techStack: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "GraphQL", "Docker"],
    projects: [
      {
        name: "E-commerce Platform",
        description: "A full-featured e-commerce platform built with React and Node.js",
        technologies: ["React", "Node.js", "PostgreSQL"],
        link: "#",
      },
      {
        name: "Real-time Chat App",
        description: "WebSocket-based chat application with user authentication",
        technologies: ["TypeScript", "Node.js", "Socket.io"],
        link: "#",
      },
      {
        name: "Analytics Dashboard",
        description: "Data visualization dashboard for business analytics",
        technologies: ["React", "D3.js", "GraphQL"],
        link: "#",
      },
    ],
    github: "https://github.com",
    website: "https://example.com",
  },
  "2": {
    id: 2,
    name: "Sarah Williams",
    title: "UI/UX Engineer",
    role: "Product Designer",
    description: "Designing delightful user experiences",
    bio: "Design-focused engineer who bridges the gap between design and development. Specializing in creating beautiful, accessible interfaces.",
    techStack: ["Figma", "React", "CSS", "Web Design", "Framer", "Tailwind", "Accessibility"],
    projects: [
      {
        name: "Design System",
        description: "Comprehensive design system with 100+ components",
        technologies: ["Figma", "React", "Storybook"],
        link: "#",
      },
      {
        name: "Mobile App UI",
        description: "iOS app redesign for improved user engagement",
        technologies: ["Figma", "Prototyping"],
        link: "#",
      },
    ],
    github: "https://github.com",
    website: "https://example.com",
  },
  "3": {
    id: 3,
    name: "Marcus Johnson",
    title: "Backend Architect",
    role: "DevOps Engineer",
    description: "Building scalable cloud infrastructure",
    bio: "Infrastructure specialist focused on designing scalable, reliable systems. Experienced with Kubernetes, AWS, and cloud-native development.",
    techStack: ["Python", "Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis", "Terraform"],
    projects: [
      {
        name: "Microservices Architecture",
        description: "Containerized microservices deployed to Kubernetes",
        technologies: ["Docker", "Kubernetes", "Python"],
        link: "#",
      },
    ],
    github: "https://github.com",
    website: "https://example.com",
  },
  "4": {
    id: 4,
    name: "Emma Rodriguez",
    title: "Mobile Developer",
    role: "Mobile Engineer",
    description: "Native mobile app specialist",
    bio: "Mobile development expert with expertise in both iOS and Android platforms. Passionate about creating smooth, performant mobile experiences.",
    techStack: ["React Native", "Swift", "Kotlin", "Firebase", "GraphQL", "Redux"],
    projects: [
      {
        name: "Fitness Tracking App",
        description: "Cross-platform fitness app with real-time data sync",
        technologies: ["React Native", "Firebase"],
        link: "#",
      },
    ],
    github: "https://github.com",
    website: "https://example.com",
  },
  "5": {
    id: 5,
    name: "David Lee",
    title: "AI/ML Engineer",
    role: "ML Engineer",
    description: "Machine learning and AI solutions",
    bio: "Machine learning engineer specializing in computer vision and NLP. Experienced with TensorFlow, PyTorch, and modern deep learning frameworks.",
    techStack: ["Python", "TensorFlow", "PyTorch", "FastAPI", "AWS", "Jupyter"],
    projects: [
      {
        name: "Image Classification Model",
        description: "CNN-based image classification with 95% accuracy",
        technologies: ["Python", "TensorFlow"],
        link: "#",
      },
    ],
    github: "https://github.com",
    website: "https://example.com",
  },
  "6": {
    id: 6,
    name: "Jessica Smith",
    title: "Frontend Specialist",
    role: "Frontend Lead",
    description: "Performance-focused frontend development",
    bio: "Frontend performance expert focused on building blazing-fast web applications. Specializing in modern frontend frameworks and optimization techniques.",
    techStack: ["Vue.js", "Next.js", "Tailwind", "GraphQL", "Webpack", "Testing Library"],
    projects: [
      {
        name: "Performance Dashboard",
        description: "Real-time performance monitoring dashboard",
        technologies: ["Next.js", "GraphQL", "Tailwind"],
        link: "#",
      },
    ],
    github: "https://github.com",
    website: "https://example.com",
  },
};

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const portfolio = id ? portfolioData[id] : null;

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <h1 className="text-4xl font-bold text-foreground mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground text-lg mb-8">
            We couldn't find the portfolio you're looking for.
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
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-black hover:opacity-70 transition w-fit">
            <ChevronLeft size={20} />
            Back to Portfolio
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
                  className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded font-medium hover:opacity-90 transition"
                >
                  <Github size={20} />
                  GitHub
                </a>
                <a
                  href={portfolio.website}
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
            {portfolio.projects.map((project: any, idx: number) => (
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
                  className="flex items-center gap-2 text-black hover:opacity-70 transition font-medium"
                >
                  View Project <ExternalLink size={16} />
                </a>
              </div>
            ))}
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
