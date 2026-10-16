import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { rbacService, AdminSession } from '../../services/rbac';
import { CoolMindLogo } from '../CoolMindLogo';

interface Props {
  onLoginSuccess: (session: AdminSession) => void;
  onCancel: () => void;
}

export const AdminLoginGate: React.FC<Props> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('admin@coolmindcenter.com');
  const [password, setPassword] = useState('CoolMind@2026#SecureAdmin');
  const [twoFactorCode, setTwoFactorCode] = useState('984420');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور الإدارية.');
      return;
    }

    if (twoFactorCode.length < 4) {
      setError('يرجى إدخال رمز التحقق الثنائي 2FA المكون من 6 أرقام.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const session = rbacService.loginAdmin(email, password, twoFactorCode);
      setIsLoading(false);
      onLoginSuccess(session);
    }, 600);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-right">
        
        {/* Official Brand Logo & Security Header */}
        <div className="text-center space-y-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-center mb-1">
            <CoolMindLogo size="md" variant="horizontal" showSubtitle={true} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>منطقة وصول إداري محمي (OBS-A-001)</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              بوابة الدخول الإداري الآمن (Admin Portal)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              مخصص فقط للإدارة العليا، المشرف الإكلينيكي العام، ومسؤولي النظام المعتمدين.
            </p>
          </div>
        </div>

        {/* Demo Fast Login Helper */}
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
            <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400">
              <Sparkles className="w-3.5 h-3.5" />
              بيانات الدخول الإداري الافتراضية للتجربة:
            </span>
          </div>
          <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
            <div>البريد: <span className="text-teal-600 dark:text-teal-400 select-all">admin@coolmindcenter.com</span></div>
            <div>كلمة المرور: <span className="text-slate-800 dark:text-slate-100 select-all">CoolMind@2026#SecureAdmin</span></div>
            <div>رمز 2FA: <span className="text-indigo-600 dark:text-indigo-400 select-all">984420</span></div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              بريد الإدارة المعتمد (Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@coolmindcenter.com"
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              كلمة المرور الإدارية (Encrypted Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pr-10 pl-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 2FA OTP Code */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>رمز التحقق الثنائي الموثق (2FA Code)</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal">تطبيق Authenticator / SMS</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                maxLength={6}
                value={twoFactorCode}
                onChange={e => setTwoFactorCode(e.target.value)}
                placeholder="984420"
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono tracking-widest text-center font-bold"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>جاري التحقق من الصلاحيات وتوليد جلسة الأدمن...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>تسجيل الدخول وفتح لوحة الإدارة</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Home Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى بوابة المستفيد والمريض</span>
          </button>
          <span className="text-[11px] text-slate-400 font-mono">
            HIPAA Audit Active
          </span>
        </div>

      </div>
    </div>
  );
};
