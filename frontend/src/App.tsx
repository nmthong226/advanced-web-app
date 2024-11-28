import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Home from './pages/Home/Home.tsx'
import About from './pages/About.tsx'
import Canlendar from './pages/Calendar/Calendar.tsx'
import Layout from '@/layouts/PublicLayout.tsx'
import Timer from './pages/Timer/Timer.tsx'
import SignIn from "./pages/Auth/SignIn/index.tsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Route */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Layout />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path='/calendar' element={<Canlendar />} />
          <Route path='/timer' element={<Timer />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<Navigate to={"/home"} />} />
        </Route>
        {/* Public Route */}
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  )
}

export default App
