//Import frameworks
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

//Import 3rd party's integration
import { SignedIn, SignedOut } from '@clerk/clerk-react';

//Import context
import { SettingsProvider } from './contexts/SettingsContext'; // Import the SettingsProvider

//Import pages
import Home from './pages/Home/Home.tsx';
import About from './pages/About.tsx';
import Canlendar from './pages/Calendar/Calendar.tsx';
import Layout from '@/layouts/PublicLayout.tsx';
import Timer from './pages/Timer/Timer.tsx';
import TaskList from './pages/Task/TaskList.tsx';
import Analytics from './pages/Analytics/Analytics.tsx';
import TimeTable from './pages/Timetable/Timetable.tsx';
import TasksContextProvider from './components/table/context/task-context.tsx';
import { TaskProvider } from './contexts/UserTaskContext.tsx';
import { UserProvider } from './contexts/UserContext.tsx';
import SignInPage from './pages/Auth/SignIn/index.tsx';
import SignUpPage from './pages/Auth/SignUp/index.tsx';
import ForgotPasswordPage from './pages/Auth/ForgotPassword/index.tsx';

function App() {
  return (
    <UserProvider>
      <TaskProvider>
        <TasksContextProvider>
          <SettingsProvider>
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
                        <Navigate to="/sign-in" replace />
                      </SignedOut>
                    </>
                  }
                >
                  <Route path="/home" element={<Home />} />
                  <Route path="/calendar" element={<Canlendar />} />
                  <Route path="/task" element={<TaskList />} />
                  <Route path="/timetable" element={<TimeTable />} />
                  <Route path="/timer" element={<Timer />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="*" element={<Navigate to={'/home'} />} />
                </Route>
                {/* Public Route */}
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
              </Routes>
            </Router>
          </SettingsProvider>
        </TasksContextProvider>
      </TaskProvider>
    </UserProvider>
  );
}

export default App;
