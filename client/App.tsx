import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import MyPage from "@/pages/MyPage";
import MemberDetail from "@/pages/MemberDetail.tsx";
import ProjectDetail from "@/pages/ProjectDetail"; // 새로 만들 파일 import
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/mypage" component={MyPage} />
      <Route path="/portfolio/:id" component={MemberDetail} />
      <Route path="/project/:id" component={ProjectDetail} /> {/* 추가됨 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;