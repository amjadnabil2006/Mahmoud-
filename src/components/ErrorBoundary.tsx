import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CoolMind Uncaught Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(r => r.unregister());
        });
      }
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans dir-rtl" dir="rtl">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4 text-2xl font-bold border border-teal-500/30">
            🧠
          </div>
          <h1 className="text-xl sm:text-2xl font-black mb-2 text-slate-100">
            حدث خطأ غير متوقع في تحميل الصفحة
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            قد يكون السبب ملفات مؤقتة سابقة في متصفحك أو تحديث في النظام. يمكنك إعادة التهيئة وتشغيل المنصة مجدداً فوراً.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-lg shadow-teal-900/40"
            >
              🔄 مسح التخزين المؤقت وإعادة التشغيل
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer border border-slate-700"
            >
              تحديث الصفحة
            </button>
          </div>
          {this.state.error && (
            <div className="mt-8 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-500 max-w-lg overflow-x-auto text-left font-mono">
              {this.state.error.toString()}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
