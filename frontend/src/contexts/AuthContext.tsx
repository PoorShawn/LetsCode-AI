// d:\Github\open-source\LetsCode-AI\frontend\src\contexts\AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// 定义认证状态和用户信息的类型
interface AuthState {
  isAuthenticated: boolean;
  user: User | null; // 'User' 类型可以根据您的后端API返回的用户信息来定义
  token: string | null;
}

// 示例 User 类型，您需要根据实际情况调整
interface User {
  id: string | number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin'; // 根据您的系统角色定义
  // 其他用户信息
}

interface AuthContextType extends AuthState {
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  // register?: (registerData: any) => Promise<void>; // 可选，如果注册后直接登录
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // 在应用加载时尝试从 localStorage 恢复认证状态
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setAuthState({
          isAuthenticated: true,
          user: user,
          token: storedToken,
        });
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const login = async (userData: User, token: string) => {
    // 实际应用中，这里可能是API调用成功后的回调
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setAuthState({
      isAuthenticated: true,
      user: userData,
      token: token,
    });
    // 可以在这里进行一些登录后的全局操作，比如重定向
    console.log('User logged in:', userData);
  };

  const logout = async () => {
    // 实际应用中，这里可能需要调用后端的登出接口
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    // 可以在这里进行一些登出后的全局操作，比如重定向到登录页
    console.log('User logged out');
  };
  
  // 可选：注册后自动登录的逻辑
  // const register = async (registerData: any) => {
  //   // 调用注册API
  //   // const { user, token } = await authApi.register(registerData);
  //   // await login(user, token);
  // };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};