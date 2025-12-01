export interface User {
  username: string;
  nickname: string;
  jobTitle?: string;
  bio?: string;
  githubUrl?: string;
  profileImage?: string;
  techStack: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  githubUrl?: string;
  websiteUrl?: string;
  techStack: string[];
  imageUrls: string[];
  authorName: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  nickname: string;
}