import Header from "@/components/Header";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Portfolio } from "@shared/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// 폼 유효성 검사를 위한 Zod 스키마 정의
const formSchema = z.object({
  name: z.string().min(2, { message: "이름은 2자 이상이어야 합니다." }),
  title: z.string().min(5, { message: "제목은 5자 이상이어야 합니다." }),
  description: z.string().min(10, { message: "설명은 10자 이상이어야 합니다." }),
  role: z.string().min(2, { message: "역할은 2자 이상이어야 합니다." }),
  techStack: z.string().optional(), // 쉼표로 구분된 문자열
  bio: z.string().min(20, { message: "소개는 20자 이상이어야 합니다." }),
  github: z.string().url({ message: "유효한 GitHub URL을 입력하세요." }).optional().or(z.literal('')),
  website: z.string().url({ message: "유효한 웹사이트 URL을 입력하세요." }).optional().or(z.literal('')),
  projectsJson: z.string().optional(), // 프로젝트 JSON 문자열
});

type PortfolioFormData = z.infer<typeof formSchema>;

export default function CreateEditPortfolio() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      description: "",
      role: "",
      techStack: "",
      bio: "",
      github: "",
      website: "",
      projectsJson: ""
    },
  });

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (isEditMode && id) {
      fetch(`/api/portfolios/${id}`)
        .then((res) => res.json())
        .then((data: Portfolio) => {
          form.reset({
            ...data,
            // 배열을 폼에서 사용하기 위해 쉼표로 구분된 문자열로 변환
            techStack: data.techStack.join(', '),
          });
        })
        .catch((err) => {
          console.error("Failed to load portfolio for editing:", err);
          alert("포트폴리오 로드에 실패했습니다.");
          navigate("/");
        });
    }
  }, [isEditMode, id, form.reset, navigate]);

  // 폼 제출 핸들러 (CREATE 및 UPDATE)
  async function onSubmit(values: PortfolioFormData) {
    // 쉼표로 구분된 techStack 문자열을 배열로 변환
    const techStackArray = values.techStack
      ? values.techStack.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const portfolioDataToSend = {
      ...values,
      techStack: techStackArray,
      featured: true, // 임시로 기본값 설정
      id: isEditMode && id ? parseInt(id) : undefined, // 수정 시 ID 포함
    };

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode ? `/api/portfolios/${id}` : "/api/portfolios";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioDataToSend),
      });

      if (res.ok) {
        const result = await res.json();
        alert(`포트폴리오가 성공적으로 ${isEditMode ? '수정' : '생성'}되었습니다!`);
        navigate(`/portfolio/${result.id}`);
      } else {
        alert(`API 요청에 실패했습니다. 상태 코드: ${res.status}`);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      alert(`${isEditMode ? '수정' : '생성'} 중 오류가 발생했습니다.`);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-black hover:opacity-70 transition w-fit">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>

      <section className="py-12 md:py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-border">
          <h1 className="text-3xl font-bold mb-6 text-foreground">
            {isEditMode ? "Edit Portfolio" : "Publish New Portfolio"}
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Alex Chen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title (Full Stack Developer) */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title / Specialty</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Stack Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role (Senior Developer, etc) */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role / Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Short Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Creative developer with expertise in modern web technologies" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Passionate about building scalable web applications..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tech Stack (Comma Separated) */}
              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech Stack (Comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="React, Node.js, TypeScript, AWS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GitHub URL */}
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/your-profile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website URL */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-website.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project JSON (단순화를 위해 JSON 문자열로 처리) */}
              {/* <FormField
                                control={form.control}
                                name="projectsJson"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Projects (JSON String)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder='[{"name": "Project 1", ...}]' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}


              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                {isEditMode ? "Save Changes" : "Publish Portfolio"}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}