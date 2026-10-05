import React from 'react';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { DocumentCard } from '../../components/profile/RiderProfileComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderProfileDocumentsPage: React.FC = () => {
  const { documents } = useRiderProfileStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader
        title="Compliance & Document Audit"
        subtitle="View verification statuses for Driving License, Aadhaar, PAN, and RC documents."
      />

      <div className="space-y-3">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
};

export default RiderProfileDocumentsPage;
