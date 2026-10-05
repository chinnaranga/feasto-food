import React, { useState } from 'react';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderProfileContactPage: React.FC = () => {
  const { personalInfo, updatePersonalInfo } = useRiderProfileStore();

  const [phone, setPhone] = useState(personalInfo.phone);
  const [email, setEmail] = useState(personalInfo.email);
  const [emName, setEmName] = useState(personalInfo.emergencyContactName);
  const [emRel, setEmRel] = useState(personalInfo.emergencyContactRelationship);
  const [emPhone, setEmPhone] = useState(personalInfo.emergencyContactPhone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalInfo({
      phone,
      email,
      emergencyContactName: emName,
      emergencyContactRelationship: emRel,
      emergencyContactPhone: emPhone,
    });
  };

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Contact & Emergency Info" subtitle="Manage phone, email, and 24/7 emergency contact details." />

      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <RiderInput label="Mobile Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <RiderInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className="pt-2 border-t border-neutral-100 space-y-3">
          <h4 className="text-xs font-black uppercase text-neutral-900 font-heading">Emergency Contact (Required)</h4>

          <RiderInput label="Emergency Contact Name" value={emName} onChange={(e) => setEmName(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <RiderInput label="Relationship" value={emRel} onChange={(e) => setEmRel(e.target.value)} />
            <RiderInput label="Emergency Phone" type="tel" value={emPhone} onChange={(e) => setEmPhone(e.target.value)} />
          </div>
        </div>

        <RiderButton variant="primary" type="submit" fullWidth>
          Save Contact Information
        </RiderButton>
      </form>
    </div>
  );
};

export default RiderProfileContactPage;
