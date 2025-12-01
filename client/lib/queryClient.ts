import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 윈도우 포커스 시 자동 재요청 방지 (선택사항)
      refetchOnWindowFocus: false,
      // 에러 발생 시 재시도 횟수
      retry: false,
      // 데이터가 fresh한 상태로 유지되는 시간 (5분)
      staleTime: 5 * 60 * 1000,
    },
  },
});