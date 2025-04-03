// 代码执行服务模块，用于处理代码的执行和调试功能

// 定义代码执行请求参数接口
export interface CodeExecutionParams {
  code: string;
  language: string;
  timeout?: number; // 执行超时时间（毫秒）
}

// 定义代码执行结果接口
export interface CodeExecutionResult {
  output: string;
  error?: string;
  executionTime?: number; // 执行耗时（毫秒）
}

// 定义调试断点接口
export interface Breakpoint {
  lineNumber: number;
  column?: number;
  enabled: boolean;
  condition?: string;
}

// 定义调试会话状态
export type DebugSessionStatus = 'inactive' | 'paused' | 'running';

// 定义调试会话接口
export interface DebugSession {
  id: string;
  status: DebugSessionStatus;
  breakpoints: Breakpoint[];
  variables?: Record<string, any>;
  callStack?: string[];
}

// 模拟的代码执行环境
const executeJavaScript = (code: string): Promise<CodeExecutionResult> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let output = '';
    let error = '';
    
    try {
      // 创建一个安全的执行环境
      const consoleLog = console.log;
      const consoleError = console.error;
      const consoleWarn = console.warn;
      const consoleInfo = console.info;
      
      // 重写控制台方法以捕获输出
      const capturedLogs: string[] = [];
      console.log = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        capturedLogs.push(message);
      };
      console.error = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        capturedLogs.push(`Error: ${message}`);
      };
      console.warn = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        capturedLogs.push(`Warning: ${message}`);
      };
      console.info = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        capturedLogs.push(`Info: ${message}`);
      };
      
      // 使用Function构造函数执行代码
      // 注意：这在实际应用中存在安全风险，生产环境应使用沙箱或服务端执行
      const executeFn = new Function(code);
      executeFn();
      
      // 恢复控制台方法
      console.log = consoleLog;
      console.error = consoleError;
      console.warn = consoleWarn;
      console.info = consoleInfo;
      
      output = capturedLogs.join('\n');
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    
    const executionTime = Date.now() - startTime;
    
    resolve({
      output,
      error: error || undefined,
      executionTime
    });
  });
};

// 模拟执行HTML代码
const executeHTML = (): Promise<CodeExecutionResult> => {
  return new Promise((resolve) => {
    try {
      // 在实际应用中，可以使用iframe或在服务端渲染HTML
      resolve({
        output: '模拟HTML执行：HTML代码已渲染（实际应用中可使用iframe展示）',
        executionTime: 0
      });
    } catch (e) {
      resolve({
        output: '',
        error: e instanceof Error ? e.message : String(e)
      });
    }
  });
};

// 模拟执行CSS代码
const executeCSS = (): Promise<CodeExecutionResult> => {
  return new Promise((resolve) => {
    try {
      // 在实际应用中，可以将CSS应用到iframe或预览区域
      resolve({
        output: '模拟CSS执行：样式已应用（实际应用中可在预览区域展示效果）',
        executionTime: 0
      });
    } catch (e) {
      resolve({
        output: '',
        error: e instanceof Error ? e.message : String(e)
      });
    }
  });
};

// 执行代码的主函数
export const executeCode = async (
  params: CodeExecutionParams
): Promise<CodeExecutionResult> => {
  const { code, language } = params;
  
  try {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return await executeJavaScript(code);
      
      case 'typescript':
      case 'ts':
        // 注意：这里简化处理，实际应先编译TS再执行
        return await executeJavaScript(code);
      
      case 'html':
        return await executeHTML();
      
      case 'css':
        return await executeCSS();
      
      default:
        return {
          output: '',
          error: `不支持的语言: ${language}`
        };
    }
  } catch (error) {
    return {
      output: '',
      error: `执行错误: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// 创建调试会话
export const createDebugSession = (): DebugSession => {
  return {
    id: `debug-${Date.now()}`,
    status: 'inactive',
    breakpoints: []
  };
};

// 添加断点
export const addBreakpoint = (
  session: DebugSession,
  breakpoint: Omit<Breakpoint, 'enabled'>
): DebugSession => {
  const updatedSession = { ...session };
  updatedSession.breakpoints = [
    ...session.breakpoints,
    { ...breakpoint, enabled: true }
  ];
  return updatedSession;
};

// 移除断点
export const removeBreakpoint = (
  session: DebugSession,
  lineNumber: number
): DebugSession => {
  const updatedSession = { ...session };
  updatedSession.breakpoints = session.breakpoints.filter(
    bp => bp.lineNumber !== lineNumber
  );
  return updatedSession;
};

// 启用/禁用断点
export const toggleBreakpoint = (
  session: DebugSession,
  lineNumber: number
): DebugSession => {
  const updatedSession = { ...session };
  updatedSession.breakpoints = session.breakpoints.map(bp => {
    if (bp.lineNumber === lineNumber) {
      return { ...bp, enabled: !bp.enabled };
    }
    return bp;
  });
  return updatedSession;
};

// 模拟调试会话启动
export const startDebugSession = (
  session: DebugSession
): DebugSession => {
  // 在实际应用中，这里应该启动真正的调试器
  // 这里只是简单模拟
  return {
    ...session,
    status: 'running',
    variables: { /* 这里可以填充初始变量 */ },
    callStack: ['global scope']
  };
};

// 模拟调试会话暂停
export const pauseDebugSession = (session: DebugSession): DebugSession => {
  return {
    ...session,
    status: 'paused'
  };
};

// 模拟调试会话继续
export const continueDebugSession = (session: DebugSession): DebugSession => {
  return {
    ...session,
    status: 'running'
  };
};

// 模拟调试会话停止
export const stopDebugSession = (session: DebugSession): DebugSession => {
  return {
    ...session,
    status: 'inactive',
    variables: undefined,
    callStack: undefined
  };
};

// 模拟获取变量值
export const getVariableValue = (
  session: DebugSession,
  variableName: string
): any => {
  if (session.status !== 'paused' || !session.variables) {
    return undefined;
  }
  
  return session.variables[variableName];
};

// 模拟单步执行
export const stepOver = (session: DebugSession): DebugSession => {
  // 在实际应用中，这里应该调用调试器的单步执行功能
  // 这里只是简单模拟
  return {
    ...session,
    status: 'paused',
    // 模拟调用栈变化
    callStack: session.callStack ? [...session.callStack] : ['global scope']
  };
};

// 模拟步入函数
export const stepInto = (session: DebugSession): DebugSession => {
  // 在实际应用中，这里应该调用调试器的步入功能
  // 这里只是简单模拟
  return {
    ...session,
    status: 'paused',
    // 模拟调用栈变化
    callStack: session.callStack ? ['function scope', ...session.callStack] : ['function scope']
  };
};

// 模拟步出函数
export const stepOut = (session: DebugSession): DebugSession => {
  // 在实际应用中，这里应该调用调试器的步出功能
  // 这里只是简单模拟
  const updatedCallStack = session.callStack ? [...session.callStack] : [];
  if (updatedCallStack.length > 1) {
    updatedCallStack.shift(); // 移除最顶层的调用栈
  }
  
  return {
    ...session,
    status: 'paused',
    callStack: updatedCallStack.length > 0 ? updatedCallStack : ['global scope']
  };
};