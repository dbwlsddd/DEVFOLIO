export interface Member {
  id: number;
  username: string;
  nickname: string;
  jobTitle: string;
  bio: string;
  githubUrl: string;
  blogUrl: string;
  techStack: string[];
  projects?: Project[]; // 상세 조회 시 포함됨
}

export interface Project {
  id: number;
  title: string;
  description: string;
  githubUrl: string;
  websiteUrl: string;
  techStack: string[];
  imageUrls: string[];
  memberId?: number;    // 프로젝트 카드에서 작성자 식별용
  authorName?: string;  // 프로젝트 카드에서 작성자 표시용
  authorJob?: string;
}

export interface AuthResponse {
  token: string;
  memberId: number;
  username: string;
  nickname: string;
}