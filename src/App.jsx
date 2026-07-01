import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import EntrancePage from "./EntrancePage";
import Navigation from "./Navigation";

import "./App.css";
import Ticket from "./Ticket";

const Home = lazy(() => import("./Home"));
const Places = lazy(() => import("./Places"));
const Services = lazy(() => import("./Services"));
const VisitorResistrationForm = lazy(() =>
  import("./VisitorResistrationForm")
);
const FeedbackForm = lazy(() => import("./FeedbackForm"));

function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <Suspense fallback={<h3>AA raha hu mai...</h3>}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/entrance" element={<EntrancePage />} />
          <Route path="/registration" element={<VisitorResistrationForm />} />
          <Route path="/places" element={<Places />} />
          <Route path="/services" element={<Services />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/ticket" element={<Ticket/>}/>
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;