import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage'; 
import ProtectedRoute from './router/ProtectedRoute'; 
import StudentDashboard from './pages/student/StudentDashboard'; 
import TeacherDashboard from './pages/teacher/TeacherDashboard'; 

// Placeholder components for role-specific dashboards
const MainApplicationPlaceholder = () => {
  // This could eventually use useAuth to display user-specific info or redirect
  // For now, it's a generic welcome for any authenticated user.
  return (
    <div>
      <h1>欢迎使用 LetsCode AI!</h1>
      <p>这里是登录后的主应用区域。将来会显示仪表盘或课程作业实践界面。</p>
      {/* Example links to demonstrate role-based routing */}
      <p><a href="/student/dashboard">Student Dashboard (if student)</a></p>
      <p><a href="/teacher/dashboard">Teacher Dashboard (if teacher)</a></p>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes */}
          {/* Main application route, accessible by any authenticated user */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainApplicationPlaceholder />
              </ProtectedRoute>
            } 
          />

          {/* Example of role-specific protected routes */}
          <Route 
            path="/student/dashboard"
            element={
              // <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              // </ProtectedRoute>
            }
          />
          <Route 
            path="/teacher/dashboard"
            element={
              // <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              // </ProtectedRoute>
            }
          />
          
          {/* Fallback for any other authenticated paths - could be a 404 within the app */}
          {/* Or redirect to a default authenticated page */}
          <Route 
            path="*" 
            element={
              <ProtectedRoute> 
                {/* If logged in and path not found, redirect to their main page or a specific 404 */}
                <Navigate to="/" replace /> 
              </ProtectedRoute>
            } 
          />
          {/* 
            If you want a public 404 for unauthenticated users hitting unknown paths,
            that would be placed outside any ProtectedRoute, typically last.
            However, the current setup redirects unauthenticated users from protected routes to /login.
            A general public catch-all might look like:
            <Route path="*" element={<PublicNotFoundPage />} /> (if not caught by login redirect)
          */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;