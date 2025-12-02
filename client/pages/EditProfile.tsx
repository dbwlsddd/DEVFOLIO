import Header from "@/components/Header";
import { ChevronLeft } from "lucide-react";
import { Link, useLocation } from "wouter"; // [수정] react-router-dom -> wouter
import { useEffect } from "react";
import { Member } from "@shared/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authHeader } from "@/lib/auth";

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

// Member 데이터 구조에 맞춘 스키마
const formSchema = z.object({
  nickname: z.string().min(2, { message: "닉네임은 2자 이상이어야 합니다." }),
  jobTitle: z.string().min(2, { message: "직군/타이틀은 2자 이상이어야 합니다." }),
  bio: z.string().optional(),
  techStack: z.string().optional(),
  githubUrl: z.string().optional(),
  blogUrl: z.string().optional(),
});

type ProfileFormData = z.infer<typeof formSchema>;

export default function EditProfile() {
  const [, setLocation] = useLocation(); // [수정] useNavigate 대신 사용

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      jobTitle: "",
      bio: "",
      techStack: "",
      githubUrl: "",
      blogUrl: "",
    },
  });

  // 내 정보 불러오기 (Load My Profile)
  useEffect(() => {
    fetch(`/api/members/me`, { headers: authHeader() })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data: Member) => {
        form.reset({
          nickname: data.nickname,
          jobTitle: data.jobTitle || "",
          bio: data.bio || "",
          githubUrl: data.githubUrl || "",
          blogUrl: data.blogUrl || "",
          techStack: data.techStack ? data.techStack.join(", ") : "",
        });
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        alert("로그인이 필요하거나 정보를 불러올 수 없습니다.");
        setLocation("/login"); // [수정] navigate -> setLocation
      });
  }, [form, setLocation]);

  // 수정 제출 (UPDATE)
  async function onSubmit(values: ProfileFormData) {
    const techStackArray = values.techStack
      ? values.techStack.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const payload = {
      ...values,
      techStack: techStackArray,
    };

    try {
      const res = await fetch("/api/members/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader()
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("프로필이 성공적으로 수정되었습니다!");
        setLocation("/mypage"); // [수정] navigate -> setLocation
      } else {
        alert("프로필 수정 실패.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("오류가 발생했습니다.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {/* [수정] Link to -> Link href */}
          <Link href="/mypage" className="flex items-center gap-2 text-black hover:opacity-70 transition w-fit">
            <ChevronLeft size={20} />
            Back to My Page
          </Link>
        </div>
      </div>

      <section className="py-12 md:py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-border">
          <h1 className="text-3xl font-bold mb-6 text-foreground">
            Edit My Profile
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Nickname */}
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname (Name)</FormLabel>
                    <FormControl>
                      <Input placeholder="Hong Gildong" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Title */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title / Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Backend Developer" {...field} />
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
                    <FormLabel>Bio (Self Introduction)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe yourself..."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tech Stack */}
              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech Stack (Comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Java, Spring Boot, MySQL..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GitHub URL */}
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Blog/Website URL */}
              <FormField
                control={form.control}
                name="blogUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog / Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://myblog.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}