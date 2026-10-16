import { UserRole } from '../types';

export interface FeaturePermission {
  id: string;
  nameAr: string;
  category: string;
  description: string;
  rolesAllowed: Record<UserRole, boolean>;
}

export const DEFAULT_PERMISSIONS: FeaturePermission[] = [
  {
    id: 'e_rx_prescriptions',
    nameAr: 'إصدار وتوقيع الوصفات الطبية النفسية (E-Rx)',
    category: 'الطب النفسي والدوائي',
    description: 'صلاحية اختيار الأدوية، تحديد الجرعات والمدة وتوليد الروشتة المعتمدة.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: false,
      nutritionist: false,
      social_worker: false,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  },
  {
    id: 'clinical_scales_runner',
    nameAr: 'تطبيق وتصحيح المقاييس النفسية الرقمية',
    category: 'التقييم والتشخيص',
    description: 'تشغيل مقاييس PHQ-9, GAD-7, DASS-21 وحفظ النتائج في سجل المريض.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: false,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  },
  {
    id: 'clinical_forms_soap',
    nameAr: 'تدوين واعتماد ملاحظات الجلسات (SOAP Notes & MSE)',
    category: 'التوثيق السريري',
    description: 'فحص الحالة العقلية، تقييم خطورة الانتحار وتوثيق مجريات الجلسة.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: false,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  },
  {
    id: 'nutrition_social_plans',
    nameAr: 'إعداد وتوثيق الخطط الغذائية والاجتماعية',
    category: 'الرعاية التكاملية',
    description: 'حساب الاحتياجات، رصد المتلازمة الأيضية، ودراسة الحالة الاجتماعية.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: false,
      nutritionist: true,
      social_worker: true,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  },
  {
    id: 'financials_view',
    nameAr: 'الاطلاع على الحسابات والمستحقات المالية',
    category: 'المالية',
    description: 'رؤية كشف الدخل ونسب المشاركة (75%) وطلب الصرف.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: true,
      nutritionist: true,
      social_worker: true,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  },
  {
    id: 'peer_consultations',
    nameAr: 'المشاركة في استشارات الزملاء والإحالات',
    category: 'التعاون المهني',
    description: 'طرح استشارات بهوية مجهولة وطلب رأي ثانٍ من الأطباء والاستشاريين.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: true,
      nutritionist: true,
      social_worker: true,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  }
];

const RBAC_STORAGE_KEY = 'coolmind_rbac_matrix';
const ADMIN_SESSION_KEY = 'coolmind_admin_auth_session';

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'clinical_director' | 'financial_admin';
  lastLogin: string;
  token: string;
}

export const rbacService = {
  getPermissions: (): FeaturePermission[] => {
    try {
      const saved = localStorage.getItem(RBAC_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading RBAC permissions', e);
    }
    return DEFAULT_PERMISSIONS;
  },

  savePermissions: (permissions: FeaturePermission[]): void => {
    try {
      localStorage.setItem(RBAC_STORAGE_KEY, JSON.stringify(permissions));
      window.dispatchEvent(new CustomEvent('coolmind_rbac_updated', { detail: permissions }));
    } catch (e) {
      console.error('Error saving RBAC permissions', e);
    }
  },

  isFeatureAllowed: (role: UserRole | string, featureId: string): boolean => {
    const permissions = rbacService.getPermissions();
    const feat = permissions.find(p => p.id === featureId);
    if (!feat) return true; // Default allow if not configured
    const userRole = role as UserRole;
    return feat.rolesAllowed[userRole] ?? false;
  },

  togglePermission: (featureId: string, role: UserRole): FeaturePermission[] => {
    const permissions = rbacService.getPermissions();
    const updated = permissions.map(p => {
      if (p.id !== featureId) return p;
      const current = p.rolesAllowed[role];
      return {
        ...p,
        rolesAllowed: {
          ...p.rolesAllowed,
          [role]: !current
        }
      };
    });
    rbacService.savePermissions(updated);
    return updated;
  },

  resetToDefault: (): FeaturePermission[] => {
    rbacService.savePermissions(DEFAULT_PERMISSIONS);
    return DEFAULT_PERMISSIONS;
  },

  // Admin Authentication & Session Management (OBS-A-001)
  getAdminSession: (): AdminSession | null => {
    try {
      const saved = localStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing admin session', e);
    }
    return null;
  },

  loginAdmin: (email: string, _password?: string, _twoFactorCode?: string): AdminSession => {
    const session: AdminSession = {
      id: 'admin-' + Date.now(),
      name: email.toLowerCase().includes('director') ? 'د. المشرف الطبي العام' : 'مدير المنظمة والعيادة (Super Admin)',
      email: email || 'admin@coolmindcenter.com',
      role: 'super_admin',
      lastLogin: new Date().toISOString(),
      token: 'jwt-sec-adm-' + Math.random().toString(36).substring(2)
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent('coolmind_admin_auth_changed', { detail: session }));
    return session;
  },

  logoutAdmin: (): void => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    window.dispatchEvent(new CustomEvent('coolmind_admin_auth_changed', { detail: null }));
  }
};
