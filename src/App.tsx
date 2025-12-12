import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Registration } from './pages/Registration';
import { Resources } from './pages/ResourcesPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<Registration />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </Router>
  );
}