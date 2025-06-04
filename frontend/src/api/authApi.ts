// d:\Github\open-source\LetsCode-AI\frontend\src\apis\authApi.ts

import { axiosRequest, request } from "../utils/request";

// This is a placeholder. We will need to define the actual User types
// based on what StudentService and TeacherService return.
// For now, let's assume a generic structure for the login function's return.
interface ApiUser {
    id: string | number;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin'; 
    // other properties from backend
  }
  
  interface LoginResponse {
    user: ApiUser;
    token: string;
  }
  
  interface LoginCredentials {
    email: string;
    password: string;
    // role?: 'student' | 'teacher'; // Optional: if your single login endpoint needs to know the role
  }

  interface RegisterStudentData {
    name: string;
    email: string;
    password: string;
    major?: string;
    grade?: string;
    role: 'student';
  }
  
  interface RegisterTeacherData {
    TeacherName: string; // Matches backend Teacher model
    TeacherEmail: string; // Matches backend Teacher model
    password: string;
    department?: string;
    title?: string;
    role: 'teacher';
  }
  
  type RegisterData = RegisterStudentData | RegisterTeacherData;
  

  export async function login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    return axiosRequest<LoginResponse>('/auth/login', 'POST', credentials);
  }
  
  export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Here you would determine whether to call StudentService or TeacherService.
    // This might involve:
    // 1. Having separate login forms/routes for students and teachers.
    // 2. Adding a role selector on the login form.
    // 3. Trying one service, and if it fails, trying the other (less ideal).
  
    // For now, let's assume we need to differentiate.
    // This is a simplified mock. The actual implementation will depend on your backend API structure.
    
    console.log('Attempting login with:', credentials);
  
    // const response = await fetch(`${API_BASE_URL}/auth/login`, { // Fictional unified endpoint
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(credentials),
    // });
  
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Login failed');
    // }
    // return response.json() as Promise<LoginResponse>;
  
    // --- MOCK IMPLEMENTATION ---
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     if (credentials.email.startsWith('student') && credentials.password) {
    //       resolve({
    //         user: { id: 's123', name: 'Mock Student', email: credentials.email, role: 'student' },
    //         token: 'mock-student-jwt-token',
    //       });
    //     } else if (credentials.email.startsWith('teacher') && credentials.password) {
    //       resolve({
    //         user: { id: 't456', name: 'Mock Teacher', email: credentials.email, role: 'teacher' },
    //         token: 'mock-teacher-jwt-token',
    //       });
    //     } else {
    //       reject(new Error('Invalid mock credentials. Use student@example.com or teacher@example.com'));
    //     }
    //   }, 1000);
    // });
    // --- END MOCK IMPLEMENTATION ---
  };
  
  // Placeholder for register function
  // interface RegisterData { /* ... */ }
  // export const registerUser = async (data: RegisterData): Promise<any> => { /* ... */ };
// d:\Github\open-source\LetsCode-AI\frontend\src\apis\authApi.ts
// ... (previous content like ApiUser, LoginResponse, LoginCredentials, API_BASE_URL, loginUser function)

// Add these new interfaces and function for registration

interface RegisterStudentData {
  name: string;
  email: string;
  password: string;
  major?: string;
  grade?: string;
  role: 'student';
}

interface RegisterTeacherData {
  TeacherName: string; // Matches backend Teacher model
  TeacherEmail: string; // Matches backend Teacher model
  password: string;
  department?: string;
  title?: string;
  role: 'teacher';
}

// type RegisterData = RegisterStudentData | RegisterTeacherData;

// Assuming registration, if successful, might also return a token and user object
// similar to login, to facilitate auto-login.
// Or it might just return a success boolean/message.
// For now, let's assume it returns something similar to LoginResponse for auto-login.

export const registerUser = async (data: RegisterData): Promise<LoginResponse> => {
  console.log('Registering user with data:', data);
  // const endpoint = data.role === 'student' 
  //   ? `${API_BASE_URL}/student-serv/students/register` 
  //   : `${API_BASE_URL}/teacher-serv/teacher`; // Teacher registration path from API docs

  // const body = data.role === 'student' 
  //   ? { name: data.name, email: data.email, password: data.password, major: data.major, grade: data.grade } // Student model
  //   : { TeacherName: data.name, TeacherEmail: data.email, password: data.password, department: (data as RegisterTeacherData).department, title: (data as RegisterTeacherData).title }; // Teacher model

  // const response = await fetch(endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(body),
  // });

  // if (!response.ok) {
  //   const errorData = await response.json().catch(() => ({ message: 'Registration failed with non-JSON response' }));
  //   throw new Error(errorData.message || 'Registration failed');
  // }
  
  // Handling response:
  // Student registration returns boolean. Teacher registration returns Teacher object.
  // To unify for auto-login, we might need to make a subsequent login call or adjust this.
  // For mock, we'll directly return a LoginResponse structure.

  // --- MOCK IMPLEMENTATION ---
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email.includes('existing')) { // Simulate existing user
        reject(new Error('User with this email already exists.'));
      } else {
        const commonUserPart = {
          id: Date.now().toString(), // Mock ID
          name: data.role === 'student' ? data.name : (data as RegisterTeacherData).TeacherName,
          email: data.email,
          role: data.role,
        };
        resolve({
          user: commonUserPart,
          token: `mock-registered-${data.role}-token-for-${data.email}`,
        });
      }
    }, 1000);
  });
  // --- END MOCK IMPLEMENTATION ---
}; 

// export const registerUser = async (data: RegisterData): Promise<LoginResponse> => {
//     console.log('Registering user with data:', data);
//     // const endpoint = data.role === 'student' 
//     //   ? `${API_BASE_URL}/student-serv/students/register` 
//     //   : `${API_BASE_URL}/teacher-serv/teacher`; // Teacher registration path from API docs
  
//     // const body = data.role === 'student' 
//     //   ? { name: data.name, email: data.email, password: data.password, major: data.major, grade: data.grade } // Student model
//     //   : { TeacherName: data.name, TeacherEmail: data.email, password: data.password, department: (data as RegisterTeacherData).department, title: (data as RegisterTeacherData).title }; // Teacher model
  
//     // const response = await fetch(endpoint, {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify(body),
//     // });
  
//     // if (!response.ok) {
//     //   const errorData = await response.json().catch(() => ({ message: 'Registration failed with non-JSON response' }));
//     //   throw new Error(errorData.message || 'Registration failed');
//     // }
    
//     // Handling response:
//     // Student registration returns boolean. Teacher registration returns Teacher object.
//     // To unify for auto-login, we might need to make a subsequent login call or adjust this.
//     // For mock, we'll directly return a LoginResponse structure.
  
//     // --- MOCK IMPLEMENTATION ---
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (data.email.includes('existing')) { // Simulate existing user
//           reject(new Error('User with this email already exists.'));
//         } else {
//           const commonUserPart = {
//             id: Date.now().toString(), // Mock ID
//             name: data.role === 'student' ? data.name : (data as RegisterTeacherData).TeacherName,
//             email: data.email,
//             role: data.role,
//           };
//           resolve({
//             user: commonUserPart,
//             token: `mock-registered-${data.role}-token-for-${data.email}`,
//           });
//         }
//       }, 1000);
//     });
//     // --- END MOCK IMPLEMENTATION ---
//   };