import { ClientUser } from '../types';

const AUTH_STORAGE_KEY = 'coolmind_client_session';
const TIMEOUT_MINUTES = 15;

export const authService = {
  getCurrentUser: (): ClientUser => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing session', e);
      }
    }
    // Default guest session if not logged in
    const guestUser: ClientUser = {
      id: 'usr-guest-default',
      clientCode: 'CM-GUEST-7841',
      nameOrAlias: 'زائر مجهول (Guest)',
      email: '',
      phone: '',
      country: 'YE',
      currency: 'USD',
      isAnonymous: true,
      packageSessionsRemaining: 1,
      packageSessionsTotal: 1,
      referralCode: 'REF-GUEST-7841',
      referralRewardsUSD: 0,
      createdAt: new Date().toISOString()
    };
    return guestUser;
  },

  setCurrentUser: (user: ClientUser) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem('coolmind_last_active', Date.now().toString());
  },

  loginWithEmail: async (email: string, password: string): Promise<ClientUser> => {
    await new Promise(r => setTimeout(r, 400));
    // Generate or fetch user with clean client code (no full name leakage)
    const codeNum = Math.floor(100000 + Math.random() * 900000);
    const alias = email.split('@')[0];
    const user: ClientUser = {
      id: `usr-${Date.now()}`,
      clientCode: `CM-${codeNum}`,
      nameOrAlias: alias.charAt(0).toUpperCase() + alias.slice(1),
      email: email,
      phone: '+967-770000000',
      country: 'YE',
      currency: 'USD',
      isAnonymous: false,
      activePackageId: 'pkg-hope',
      packageSessionsRemaining: 3,
      packageSessionsTotal: 4,
      referralCode: `REF-${codeNum}`,
      referralRewardsUSD: 15,
      assignedDoctorId: 'doc-moayad',
      assignedDoctorName: 'أ. محمد المؤيد',
      createdAt: new Date().toISOString()
    };
    authService.setCurrentUser(user);
    return user;
  },

  signup: async (data: { aliasOrName: string; email: string; phone: string; country: string; password: string }): Promise<ClientUser> => {
    await new Promise(r => setTimeout(r, 500));
    const codeNum = Math.floor(100000 + Math.random() * 900000);
    const user: ClientUser = {
      id: `usr-${Date.now()}`,
      clientCode: `CM-${codeNum}`,
      nameOrAlias: data.aliasOrName || `مستفيد ${codeNum}`,
      email: data.email,
      phone: data.phone,
      country: data.country || 'YE',
      currency: data.country === 'YE' ? 'YER' : 'USD',
      isAnonymous: false,
      packageSessionsRemaining: 0,
      packageSessionsTotal: 0,
      referralCode: `REF-${codeNum}`,
      referralRewardsUSD: 0,
      createdAt: new Date().toISOString()
    };
    authService.setCurrentUser(user);
    return user;
  },

  loginAsGuest: async (): Promise<ClientUser> => {
    await new Promise(r => setTimeout(r, 200));
    const guestNum = Math.floor(1000 + Math.random() * 9000);
    const guestUser: ClientUser = {
      id: `guest-${Date.now()}`,
      clientCode: `CM-GUEST-${guestNum}`,
      nameOrAlias: `ضيف مجهول #${guestNum}`,
      email: '',
      phone: '',
      country: 'YE',
      currency: 'USD',
      isAnonymous: true,
      packageSessionsRemaining: 1,
      packageSessionsTotal: 1,
      referralCode: `REF-GUEST-${guestNum}`,
      referralRewardsUSD: 0,
      createdAt: new Date().toISOString()
    };
    authService.setCurrentUser(guestUser);
    return guestUser;
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('coolmind_last_active');
  },

  updateProfile: (updates: Partial<ClientUser>): ClientUser => {
    const current = authService.getCurrentUser();
    const updated = { ...current, ...updates };
    authService.setCurrentUser(updated);
    return updated;
  },

  checkInactivityTimeout: (onTimeout: () => void) => {
    const lastActive = localStorage.getItem('coolmind_last_active');
    if (lastActive) {
      const diffMs = Date.now() - parseInt(lastActive, 10);
      const diffMinutes = diffMs / (1000 * 60);
      if (diffMinutes > TIMEOUT_MINUTES) {
        onTimeout();
      }
    }
  },

  refreshActivity: () => {
    localStorage.setItem('coolmind_last_active', Date.now().toString());
  }
};
