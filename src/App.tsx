import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Download } from './pages/Download';
import { Receive } from './pages/Receive';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/d/:id" element={<Download />} />
      </Routes>
    </Router>
  );
}

export default App;
