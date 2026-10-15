import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PersonaProvider from "./context/PersonaProvider";
import SiteLayout from "./layouts/site/SiteLayout";

const Home = lazy(() => import("./pages/home/Home"));
const About = lazy(() => import("./pages/about/About"));
const Services = lazy(() => import("./pages/services/Services"));
const Projects = lazy(() => import("./pages/projects/Projects"));
const Approach = lazy(() => import("./pages/approach/Approach"));
const Contact = lazy(() => import("./pages/contact/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
        </Routes>
      </BrowserRouter>
    </PersonaProvider>
  );
};

export default App;
