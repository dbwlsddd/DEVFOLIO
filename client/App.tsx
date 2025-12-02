import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import MyPage from "@/pages/MyPage";
import MemberDetail from "@/pages/MemberDetail.tsx";
import ProjectDetail from "@/pages/ProjectDetail";
import CreateProject from "@/pages/CreateProject"; // [추가] import
import NotFound from "@/pages/NotFound";
import EditProfile from "@/pages/EditProfile"; // (혹시 빠져있다면 추가)
import EditProject from "@/pages/EditProject";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/mypage" component={MyPage} />
      <Route path="/portfolio/:id" component={MemberDetail} />
      <Route path="/portfolio/edit/:id" component={EditProfile} />

      {/* [중요] create가 :id보다 먼저 와야 합니다! */}
      <Route path="/project/create" component={CreateProject} />
      <Route path="/project/edit/:id" component={EditProject} />
      <Route path="/project/:id" component={ProjectDetail} />

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