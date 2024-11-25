import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import Layout from '@/layouts/PublicLayout.tsx'
import Timer from './pages/Timer/Timer.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/timer' element={<Timer />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
