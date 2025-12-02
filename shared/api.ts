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
  githubUrl?: string;
  websiteUrl?: string;
  techStack: string[];
  imageUrls: string[];
  memberId: number;
  authorName: string;
  authorJob: string;
  // [추가]
  viewCount: number;
  likeCount: number;
  liked: boolean; // DTO의 isLiked는 JSON 변환 시 보통 'liked'나 'isLiked'로 오는데, Java boolean getter는 'is' 생략될 수 있으니 확인 필요.
                  // Lombok @Data는 boolean 필드 'isLiked' -> json 'liked' 로 보낼 수 있음.
                  // 안전하게 서버 DTO 필드명을 'liked'로 하거나, 여기서 확인해야 함.
                  // 위 DTO 코드에서 'private boolean isLiked;' 롬복 사용 시 JSON은 'liked'로 직렬화될 가능성이 높음.
}

export interface AuthResponse {
  token: string;
  memberId: number;
  username: string;
  nickname: string;
}