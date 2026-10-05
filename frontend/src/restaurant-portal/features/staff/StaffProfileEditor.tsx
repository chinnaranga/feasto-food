import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '../../utils/zodResolver';
import { z } from 'zod';
import { Sparkles, Calendar, Heart, ShieldAlert, BarChart3, AlertCircle } from 'lucide-react';
import usePortalStaffStore from '../../store/portalStaffStore';
import { FormField } from '../../components/ui/AuthFormFields';
import { SectionDivider } from '../../components/ui/SectionDivider';
import Card from '../../components/ui/Card';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const staffSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  role: z.enum([
    'owner',
    'manager',
    'kitchen-staff',
    'cashier',
    'delivery-coordinator',
    'menu-manager',
    'inventory-staff',
    'support-staff',
    'finance-staff',
    'read-only',
  ]),
  branch: z.string().min(2, 'Branch allocation name is required'),
});

type StaffFormValues = z.infer<typeof staffSchema>;

const ROLE_OPTIONS = [
  { value: 'owner', label: 'Owner / Administrator' },
  { value: 'manager', label: 'Store Manager' },
  { value: 'kitchen-staff', label: 'Kitchen Chef / Prep Staff' },
  { value: 'cashier', label: 'Cashier & Registrar' },
  { value: 'delivery-coordinator', label: 'Delivery Coordinator' },
  { value: 'inventory-staff', label: 'Inventory Staff' },
  { value: 'support-staff', label: 'Support Agent' },
  { value: 'finance-staff', label: 'Finance Comptroller' },
] as const;

export const StaffProfileEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { staff, shifts, addStaff, updateStaff, assignShift } = usePortalStaffStore();

  const isEditMode = !!id;
  const isViewOnly = !window.location.pathname.includes('/edit') && isEditMode;

  const member = staff.find((m) => m.id === id);
  const memberShifts = shifts.filter((s) => s.staffId === id);

  // New Shift form fields
  const [shiftDate, setShiftDate] = useState<string>('');
  const [shiftStart, setShiftStart] = useState<string>('09:00');
  const [shiftEnd, setShiftEnd] = useState<string>('17:00');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'kitchen-staff',
      branch: 'Downtown Flagship',
    },
    mode: 'onBlur',
  });

  // Populate form
  useEffect(() => {
    if (isEditMode && member) {
      reset({
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: member.role,
        branch: member.branch,
      });
    }
  }, [isEditMode, member, reset]);

  const onSubmit = (values: StaffFormValues) => {
    if (isViewOnly) return;

    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role,
      branch: values.branch,
      status: member?.status || 'active',
    };

    if (isEditMode && id) {
      updateStaff(id, payload);
    } else {
      addStaff(payload);
    }
    navigate('/restaurant-portal/staff');
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !shiftDate) return;

    assignShift({
      staffId: id,
      date: shiftDate,
      startTime: shiftStart,
      endTime: shiftEnd,
    });

    setShiftDate('');
  };

  if (isEditMode && !member) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center select-none">
        <AlertCircle size={20} className="text-red-500 mb-2" />
        <h4 className="text-xs font-bold text-neutral-800 uppercase">Staff Profile Not Found</h4>
        <button onClick={() => navigate('/restaurant-portal/staff')} className="text-xs text-[#e35205] mt-2 cursor-pointer font-bold">
          Go back to directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-neutral-800">
            {isViewOnly ? `Staff Profile — ${member?.name}` : isEditMode ? `Modify Staff — ${member?.name}` : 'Roster New Staff Member'}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure contact parameters, role access configurations, shift bookings, and weekly timings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/restaurant-portal/staff')}
            className="px-3 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-black uppercase tracking-wider text-neutral-500 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {!isViewOnly && (
            <button
              onClick={handleSubmit(onSubmit)}
              className="px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Save Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Form details */}
        <div className="lg:col-span-2 space-y-6">
          <SectionDivider label="Employee parameters" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              id="name"
              placeholder="e.g. Sato Takeshi"
              disabled={isViewOnly}
              error={errors.name?.message}
              {...register('name')}
            />

            <FormField
              label="Email Address"
              id="email"
              type="email"
              placeholder="e.g. sato@feasto.com"
              disabled={isViewOnly}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Phone Number"
              id="phone"
              placeholder="e.g. +91 98840 10293"
              disabled={isViewOnly}
              error={errors.phone?.message}
              {...register('phone')}
            />

            {/* Role select */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="role" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Roster Role
              </label>
              <select
                id="role"
                disabled={isViewOnly}
                {...register('role')}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Branch select */}
            <FormField
              label="Branch Allocation"
              id="branch"
              placeholder="e.g. Downtown Flagship"
              disabled={isViewOnly}
              error={errors.branch?.message}
              {...register('branch')}
            />
          </div>

          {/* Shift Scheduler subform (only in edit/view mode for created staff) */}
          {isEditMode && (
            <>
              <SectionDivider label="Assign Scheduling Shifts" />
              
              <form onSubmit={handleAddShift} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded-xl items-end">
                <FormField
                  label="Shift Date"
                  id="shiftDate"
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  required
                />
                <FormField
                  label="Start Time"
                  id="shiftStart"
                  type="time"
                  value={shiftStart}
                  onChange={(e) => setShiftStart(e.target.value)}
                  required
                />
                <FormField
                  label="End Time"
                  id="shiftEnd"
                  type="time"
                  value={shiftEnd}
                  onChange={(e) => setShiftEnd(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer h-9"
                >
                  Schedule Shift
                </button>
              </form>

              {/* Roster shifts list */}
              <div className="space-y-2">
                {memberShifts.length > 0 ? (
                  memberShifts.map((sh) => (
                    <div
                      key={sh.id}
                      className="flex items-center justify-between p-3.5 bg-white border border-neutral-200 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar size={13} className="text-neutral-400" />
                        <div>
                          <p className="text-xs font-bold text-neutral-800">{sh.date}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">{sh.startTime} - {sh.endTime}</p>
                        </div>
                      </div>

                      <span className={`inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ${
                        sh.status === 'clocked-in' || sh.status === 'clocked-out' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        sh.status === 'late' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-neutral-50 text-neutral-400 border-neutral-200'
                      }`}>
                        {sh.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-400 italic">No scheduled shifts logged for this employee yet.</p>
                )}
              </div>
            </>
          )}

        </div>

        {/* RIGHT COLUMN: Performance telemetry statistics */}
        <div className="space-y-6">
          <SectionDivider label="Performance telemetry" />
          {isEditMode && member ? (
            <Card className="text-left space-y-4">
              <div className="flex items-center gap-1.5">
                <BarChart3 size={13} className="text-[#e35205]" />
                <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-heading">
                  Operational Throughput
                </h5>
              </div>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-500">Tasks Completed</span>
                  <span className="font-bold text-neutral-800">{member.performance.tasksCompleted}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-500">Orders Handled</span>
                  <span className="font-bold text-neutral-800">{member.performance.ordersHandled}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-500">Avg Response Wait</span>
                  <span className="font-bold text-[#e35205]">{member.performance.avgResponseTimeMin} mins</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-500">Shift Reliability</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                    {member.performance.shiftReliabilityPct}%
                  </span>
                </div>
              </div>

              {/* AI assistant summary comment */}
              <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-lg text-[9px] text-neutral-500 leading-normal">
                <strong>AI Insight:</strong> Sato Takeshi maintains an excellent 98% reliability rate. Ideal candidate for leading weekend peak rushes.
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border">
              <Sparkles size={16} className="text-[#e35205] mb-2" />
              <h5 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Telemetry Locked</h5>
              <p className="text-[9px] text-neutral-400 mt-1">
                Telemetry insights and productivity scores will unlock automatically after the employee profiles are saved.
              </p>
            </Card>
          )}

          {/* Module permissions summary card */}
          {isEditMode && member && (
            <Card className="text-left space-y-3">
              <div className="flex items-center gap-1.5">
                <ShieldAlert size={13} className="text-neutral-400" />
                <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Module Authorization Locks
                </h5>
              </div>
              <p className="text-[10px] text-neutral-400 leading-normal">
                This employee inherits access configurations corresponding to the <strong className="text-neutral-600 uppercase">"{member.role}"</strong> role definitions. Modify authorization locks on the Roles tab.
              </p>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
};

export default StaffProfileEditor;
