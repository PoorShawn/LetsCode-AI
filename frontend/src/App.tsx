import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
// import ProtectedRoute from './router/ProtectedRoute';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Coder from './views/coder';
import CourseList from './pages/student/CourseList';
import CourseDetail from './pages/student/CourseDetail';
import AssignmentList from './pages/student/AssignmentList';
import AssignmentDetail from './pages/student/AssignmentDetail';
import MyCourses from './pages/student/MyCourses';
import CurriculumList from './pages/curriculum/CurriculumList';
import CurriculumDetail from './pages/curriculum/CurriculumDetail';
import CurriculumNew from './pages/curriculum/CurriculumNew';
import CurriculumEdit from './pages/curriculum/CurriculumEdit';
import TaskNew from './pages/task/TaskNew';
import TaskEdit from './pages/task/TaskEdit';
import TeacherList from './pages/teacher/TeacherList';
import StudentListPage from './pages/student/StudentList';
import GradingCenter from './pages/teacher/GradingCenter';
import CourseStudents from './pages/teacher/CourseStudents';
import TaskList from './pages/student/TaskList';
import LearningHistory from './pages/student/LearningHistory';
import CourseManagement from './pages/teacher/CourseManagement';

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

          {/* Student routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<CourseList />} />
          <Route path="/student/my-courses" element={<MyCourses />} />
          <Route path="/student/course/:id" element={<CourseDetail />} />
          <Route path="/student/assignments" element={<AssignmentList />} />
          <Route path="/student/assignment/:id" element={<AssignmentDetail />} />
          <Route path="/student/tasks" element={<TaskList />} />
          <Route path="/student/history" element={<LearningHistory />} />

          {/* Teacher routes */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/grading" element={<GradingCenter />} />
          <Route path="/teacher/courses" element={<CourseManagement />} />
          <Route path="/teacher/courses/:courseId/students" element={<CourseStudents />} />
          <Route path="/teacher/list" element={<TeacherList />} />

          {/* Student management */}
          <Route path="/students" element={<StudentListPage />} />

          {/* Curriculum management */}
          <Route path="/curriculum" element={<CurriculumList />} />
          <Route path="/curriculum/new" element={<CurriculumNew />} />
          <Route path="/curriculum/:id" element={<CurriculumDetail />} />
          <Route path="/curriculum/:id/edit" element={<CurriculumEdit />} />

          {/* Task management */}
          <Route path="/task/new" element={<TaskNew />} />
          <Route path="/task/:id/edit" element={<TaskEdit />} />

          {/* Code editor */}
          <Route path="/coder" element={<Coder />} />
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Protected routes */}
          {/* Main application route, accessible by any authenticated user */}
          <Route 
            path="/" 
            element={
              // <ProtectedRoute>
                <MainApplicationPlaceholder />
              // </ProtectedRoute>
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

          {/* Student routes */}
          <Route 
            path="/student/courses"
            element={
              // <ProtectedRoute allowedRoles={['student']}>
                <CourseList />
              // </ProtectedRoute>
            }
          />
          <Route 
            path="/student/course/:courseId"
            element={
              // <ProtectedRoute allowedRoles={['student']}>
                <CourseDetail />
              // </ProtectedRoute>
            }
          />
          <Route 
            path="/student/assignments"
            element={
              // <ProtectedRoute allowedRoles={['student']}>
                <AssignmentList />
              // </ProtectedRoute>
            }
          />
          <Route 
            path="/student/assignment/:assignmentId"
            element={
              // <ProtectedRoute allowedRoles={['student']}>
                <AssignmentDetail />
              // </ProtectedRoute>
            }
          />
          <Route 
            path="/student/my-courses"
            element={
              // <ProtectedRoute allowedRoles={['student']}>
                <MyCourses />
              // </ProtectedRoute>
            }
          />

          {/* Curriculum routes */}
          <Route 
            path="/curriculum"
            element={
              // <ProtectedRoute allowedRoles={['teacher', 'student']}>
                <CurriculumList />
              // </ProtectedRoute>
            }
          />
          <Route 
            path="/curriculum/new"
            element={
              // <ProtectedRoute allowedRoles={['teacher']}>
                <CurriculumNew />
              // </ProtectedRoute>
            }
          />
          <Route 
            path="/curriculum/:id"
            element={
              // <ProtectedRoute allowedRoles={['teacher', 'student']}>
                <CurriculumDetail />
              // </ProtectedRoute>
            }
          />
          <Route 
            path="/curriculum/edit/:id"
            element={
              // <ProtectedRoute allowedRoles={['teacher']}>
                <CurriculumEdit />
              // </ProtectedRoute>
            }
          />

          {/* Teacher List Page Route */}
          <Route 
            path="/teachers"
            element={<TeacherList />}
          />

          {/* Student List Page Route */}
          <Route 
            path="/students"
            element={<StudentListPage />}
          />

          {/* Task History Page Route will be added later */}
          {/* Session Analytics Page Route will be added later */}

          {/* Task specific routes (primarily for teachers) */}
          <Route 
            path="/curriculum/:lessonId/tasks/new"
            element={
              // <ProtectedRoute allowedRoles={['teacher']}>
                <TaskNew />
              // </ProtectedRoute>
            }
          />
          <Route 
            path="/curriculum/:lessonId/tasks/edit/:taskId"
            element={
              // <ProtectedRoute allowedRoles={['teacher']}>
                <TaskEdit />
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

          <Route 
            path="/student/coder"
            element={
              // <ProtectedRoute allowedRoles={['student']}>
                <Coder />
              // </ProtectedRoute>
            }
          />
          
          {/* Fallback for any other authenticated paths - could be a 404 within the app */}
          {/* Or redirect to a default authenticated page */}
          <Route 
            path="*" 
            element={
              // <ProtectedRoute>
                <Navigate to="/" replace /> 
              // </ProtectedRoute>
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