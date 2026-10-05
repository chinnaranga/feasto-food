import React, { useState } from 'react';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderProfileEditPage: React.FC = () => {
  const { personalInfo, updatePersonalInfo } = useRiderProfileStore();

  const [fullName, setFullName] = useState(personalInfo.fullName);
  const [dob, setDob] = useState(personalInfo.dateOfBirth);
  const [gender, setGender] = useState(personalInfo.gender);
  const [language, setLanguage] = useState(personalInfo.preferredLanguage);
  const [street, setStreet] = useState(personalInfo.streetAddress);
  const [city, setCity] = useState(personalInfo.city);
  const [state, setState] = useState(personalInfo.state);
  const [postalCode, setPostalCode] = useState(personalInfo.postalCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalInfo({
      fullName,
      dateOfBirth: dob,
      gender,
      preferredLanguage: language,
      streetAddress: street,
      city,
      state,
      postalCode,
    });
  };

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Personal Information" subtitle="Update legal name, birthdate, and residential address details." />

      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <RiderInput label="Full Legal Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />

        <div className="grid grid-cols-2 gap-2">
          <RiderInput label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />

          <div className="space-y-1 text-xs">
            <label className="font-bold text-neutral-700 block">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer Not to Say</option>
            </select>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-bold text-neutral-700 block">Preferred App Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
            <option value="Kannada">Kannada</option>
            <option value="Telugu">Telugu</option>
          </select>
        </div>

        <RiderInput label="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} />

        <div className="grid grid-cols-3 gap-2">
          <RiderInput label="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <RiderInput label="State" value={state} onChange={(e) => setState(e.target.value)} />
          <RiderInput label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </div>

        <RiderButton variant="primary" type="submit" fullWidth>
          Save Personal Details
        </RiderButton>
      </form>
    </div>
  );
};

export default RiderProfileEditPage;
