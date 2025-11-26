// [업로드된 파일: dbwlsddd/devfolio/DEVFOLIO-dbb00499082e35b2b5d54ff0d97aa50d78692051/shared/api.ts]
/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Spring Boot Portfolio Entity Type
 */
export interface Portfolio {
  id: number; // Long
  name: string;
  title: string;
  description: string;
  role: string;
  techStack: string[];
  featured: boolean;
  bio: string;
  github: string;
  website: string;
  projectsJson: string; // 임시로 프로젝트를 JSON 문자열로 처리
}

// 기존 DemoResponse는 제거하거나 유지할 수 있으나, 여기서는 Portfolio를 중심으로 사용합니다.
export interface DemoResponse {
  message: string;
}