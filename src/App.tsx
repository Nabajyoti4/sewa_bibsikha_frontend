import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import PersonaProvider from "./context/PersonaProvider";
import AdminLayout from "./layouts/admin/AdminLayout";
import SiteLayout from "./layouts/site/SiteLayout";

const Home = lazy(() => import("./pages/home/Home"));
const About = lazy(() => import("./pages/about/About"));
const Services = lazy(() => import("./pages/services/Services"));
const Projects = lazy(() => import("./pages/projects/Projects"));
const Approach = lazy(() => import("./pages/approach/Approach"));
const Contact = lazy(() => import("./pages/contact/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/login/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/dashboard/AdminDashboard"));

const App = () => {
  return (
    <PersonaProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="projects" element={<Projects />} />
            <Route path="approach" element={<Approach />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="admin" element={<AdminLayout />}>
            <Route element={<PublicOnlyRoute />}>
              <Route path="login" element={<AdminLogin />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </PersonaProvider>
  );
};

export default App;
