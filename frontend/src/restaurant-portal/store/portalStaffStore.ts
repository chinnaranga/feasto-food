import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { firestoreService } from '../../services/firebase/firestoreService';

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface PerformanceMetrics {
  tasksCompleted: number;
  ordersHandled: number;
  avgResponseTimeMin: number;
  shiftReliabilityPct: number;
  kitchenThroughputPct: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'owner' | 'manager' | 'kitchen-staff' | 'cashier' | 'inventory-staff' | 'delivery-coordinator' | 'menu-manager' | 'support-staff' | 'finance-staff' | 'read-only';
  roleId?: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  branch: string;
  attendance: 'present' | 'late' | 'absent' | 'on-leave' | 'unassigned';
  performance: PerformanceMetrics;
  hourlyRate?: number;
  weeklyHoursLimit?: number;
  emergencyContact?: string;
}

export interface Shift {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'clocked-in' | 'clocked-out' | 'late' | 'cancelled';
  station?: string;
}

export interface RolePermissions {
  menuControl: boolean;
  staffControl: boolean;
  inventoryControl: boolean;
  settingsControl: boolean;
  financeControl: boolean;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: RolePermissions;
}

interface StaffState {
  staff: StaffMember[];
  shifts: Shift[];
  roles: RoleDefinition[];
  searchQuery: string;
  filters: {
    role: string;
    branch: string;
    status: string;
  };

  // Actions
  setSearchQuery: (q: string) => void;
  setFilter: (key: 'role' | 'branch' | 'status', value: string) => void;
  clearFilters: () => void;

  addStaff: (member: Omit<StaffMember, 'id' | 'attendance' | 'performance'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  deactivateStaff: (id: string) => void;
  
  addRole: (role: Omit<RoleDefinition, 'id'>) => void;
  updateRole: (id: string, updates: Partial<RoleDefinition>) => void;
  deleteRole: (id: string) => void;

  assignShift: (shift: Omit<Shift, 'id' | 'status'>) => void;
  deleteShift: (id: string) => void;
  clockInStaff: (staffId: string, shiftId: string, isLate: boolean) => void;
  updateAttendance: (id: string, status: StaffMember['attendance']) => void;
}

// ─── Staff Zustand Store ──────────────────────────────────────────────────────
export const usePortalStaffStore = create<StaffState>()(
  persist(
    (set, get) => ({
      staff: [],
      shifts: [],
      roles: [],
      searchQuery: '',
      filters: {
        role: 'all',
        branch: 'all',
        status: 'all',
      },

      setSearchQuery: (q) => set({ searchQuery: q }),

      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            role: 'all',
            branch: 'all',
            status: 'all',
          },
        });
      },

      addStaff: (member) => {
        const id = `staff-${Date.now()}`;
        const newMember: StaffMember = {
          ...member,
          id,
          attendance: 'unassigned',
          performance: { tasksCompleted: 0, ordersHandled: 0, avgResponseTimeMin: 0.0, shiftReliabilityPct: 100, kitchenThroughputPct: 0 },
        };
        firestoreService.setDocument(`portal_staff/${id}`, newMember);
      },

      updateStaff: (id, updates) => {
        firestoreService.setDocument(`portal_staff/${id}`, updates);
      },

      deactivateStaff: (id) => {
        const match = get().staff.find((m) => m.id === id);
        if (match) {
          firestoreService.setDocument(`portal_staff/${id}`, { status: match.status === 'active' ? 'inactive' : 'active' });
        }
      },

      addRole: (role) => {
        const id = `role-${Date.now()}`;
        const newRole: RoleDefinition = {
          ...role,
          id,
        };
        firestoreService.setDocument(`portal_roles/${id}`, newRole);
      },

      updateRole: (id, updates) => {
        firestoreService.setDocument(`portal_roles/${id}`, updates);
      },

      deleteRole: (id) => {
        firestoreService.deleteDocument(`portal_roles/${id}`);
      },

      assignShift: (shift) => {
        const id = `shift-${Date.now()}`;
        const newShift: Shift = {
          ...shift,
          id,
          status: 'scheduled',
        };
        firestoreService.setDocument(`portal_shifts/${id}`, newShift);
      },

      deleteShift: (id) => {
        firestoreService.deleteDocument(`portal_shifts/${id}`);
      },

      clockInStaff: (staffId, shiftId, isLate) => {
        firestoreService.setDocument(`portal_shifts/${shiftId}`, { status: isLate ? 'late' : 'clocked-in' });
        firestoreService.setDocument(`portal_staff/${staffId}`, { attendance: isLate ? 'late' : 'present' });
      },

      updateAttendance: (id, status) => {
        firestoreService.setDocument(`portal_staff/${id}`, { attendance: status });
      },
    }),
    {
      name: 'feasto-merchant-staff-store-v3',
      partialize: (_state) => ({}),
    }
  )
);

export default usePortalStaffStore;
