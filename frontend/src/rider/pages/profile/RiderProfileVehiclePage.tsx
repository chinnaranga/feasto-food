import React, { useState } from 'react';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderProfileVehiclePage: React.FC = () => {
  const { vehicle, updateVehicle } = useRiderProfileStore();

  const [vehicleType, setVehicleType] = useState(vehicle.vehicleType);
  const [brandModel, setBrandModel] = useState(vehicle.brandModel);
  const [vehicleColor, setVehicleColor] = useState(vehicle.vehicleColor);
  const [plateNumber, setPlateNumber] = useState(vehicle.plateNumber);
  const [rcNumber, setRcNumber] = useState(vehicle.rcNumber);
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState(vehicle.insurancePolicyNumber);
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState(vehicle.insuranceExpiryDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVehicle({
      vehicleType,
      brandModel,
      vehicleColor,
      plateNumber,
      rcNumber,
      insurancePolicyNumber,
      insuranceExpiryDate,
    });
  };

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Vehicle & Registration Setup" subtitle="Manage active delivery vehicle specs, license plate, and insurance." />

      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="space-y-1 text-xs">
          <label className="font-bold text-neutral-700 block">Vehicle Category</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-none"
          >
            <option value="scooter_ev">Electric Scooter / EV</option>
            <option value="motorbike">Petrol Motorbike</option>
            <option value="bicycle">Bicycle (Hyper-local)</option>
            <option value="car">Four-Wheeler Car / Van</option>
          </select>
        </div>

        <RiderInput label="Make & Model Name" value={brandModel} onChange={(e) => setBrandModel(e.target.value)} />

        <div className="grid grid-cols-2 gap-2">
          <RiderInput label="Vehicle Color" value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
          <RiderInput label="License Plate Number" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} />
        </div>

        <RiderInput label="RC Number" value={rcNumber} onChange={(e) => setRcNumber(e.target.value)} />

        <div className="grid grid-cols-2 gap-2">
          <RiderInput label="Insurance Policy Number" value={insurancePolicyNumber} onChange={(e) => setInsurancePolicyNumber(e.target.value)} />
          <RiderInput label="Insurance Expiry Date" type="date" value={insuranceExpiryDate} onChange={(e) => setInsuranceExpiryDate(e.target.value)} />
        </div>

        <RiderButton variant="primary" type="submit" fullWidth>
          Save Vehicle Details
        </RiderButton>
      </form>
    </div>
  );
};

export default RiderProfileVehiclePage;
