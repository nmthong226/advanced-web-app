import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import About from './pages/About.tsx'
import Canlendar from './pages/Calendar/Calendar.tsx'
import Layout from '@/layouts/PublicLayout.tsx'
import Timer from './pages/Timer/Timer.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path='/calendar' element={<Canlendar />} />
          <Route path='/timer' element={<Timer />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to={"/home"} />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
