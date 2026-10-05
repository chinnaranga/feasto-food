import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, CheckCircle2, Copy, Building2, Calendar, FileText } from 'lucide-react';
import usePortalFinanceStore from '../../store/portalFinanceStore';
import { usePortalProfileStore } from '../../store/portalProfileStore';

export const InvoiceDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, updateInvoiceStatus, duplicateInvoice } = usePortalFinanceStore();
  const { profile } = usePortalProfileStore();

  const invoice = invoices.find((i) => i.id === id) || invoices[0];

  if (!invoice) {
    return (
      <div className="py-12 text-center text-neutral-400 font-bold text-xs">
        Invoice record not found.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/restaurant-portal/finance/invoices')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Invoices Hub</span>
        </button>

        <div className="flex items-center gap-2">
          {invoice.status !== 'paid' && (
            <button
              onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
            >
              Mark Paid
            </button>
          )}
          <button
            onClick={() => duplicateInvoice(invoice.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-700 cursor-pointer shadow-3xs"
          >
            <Copy size={13} />
            <span>Duplicate</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
          >
            <Printer size={13} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Canvas Card */}
      <div className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/90 shadow-md space-y-8 relative overflow-hidden">
        {/* Status Stamp Badge */}
        <div className="absolute top-8 right-8">
          <span
            className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              invoice.status === 'paid'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : invoice.status === 'overdue'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
            }`}
          >
            {invoice.status}
          </span>
        </div>

        {/* Header Block: Merchant Branding & Invoice Metadata */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-neutral-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#e35205] text-white flex items-center justify-center font-black text-sm">
                F
              </div>
              <h2 className="text-xl font-black text-neutral-900">{profile.restaurantName}</h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs">{profile.address}, {profile.city}, {profile.state}</p>
            <span className="text-[10px] text-neutral-400 block mt-0.5">GSTIN / Tax ID: {profile.taxId || 'GST-99221133'}</span>
          </div>

          <div className="text-left sm:text-right space-y-1 text-xs">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block font-heading">
              INVOICE STATEMENT
            </span>
            <h3 className="text-lg font-black text-neutral-900">{invoice.invoiceNumber}</h3>
            <p className="text-neutral-500">Issued Date: {invoice.createdAt}</p>
            <p className="text-neutral-500 font-bold">Due Date: {invoice.dueDate}</p>
          </div>
        </div>

        {/* Entity / Client Bill-To Info */}
        <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-150 flex flex-col sm:flex-row justify-between gap-4 text-xs">
          <div>
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
              BILLED TO / ENTITY
            </span>
            <h4 className="font-black text-neutral-800 text-sm mt-0.5">{invoice.entityName}</h4>
            <p className="text-neutral-500 mt-0.5">{invoice.entityEmail}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
              PAYMENT TERMS
            </span>
            <p className="font-bold text-neutral-800 mt-0.5">Net 14 Days</p>
            <p className="text-neutral-500 mt-0.5">Currency: INR (₹)</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <span className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading block">
            Line Items breakdown
          </span>
          <div className="rounded-xl border border-neutral-200/80 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200/80 text-[9px] font-black uppercase tracking-wider text-neutral-400">
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Rate</th>
                  <th className="py-2.5 px-4 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {invoice.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-4 font-bold text-neutral-800">{item.description}</td>
                    <td className="py-3 px-4 text-center text-neutral-500">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-neutral-500">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-black text-neutral-900">₹{item.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Totals & Tax Box */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-neutral-200/80">
          <div className="max-w-md text-xs text-neutral-500 space-y-1">
            <span className="font-bold text-neutral-800 block">Notes & Payment Instructions:</span>
            <p className="leading-relaxed">{invoice.notes || 'Please remit full payment to the merchant HDFC Bank Current Account within the specified due date.'}</p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal:</span>
              <span>₹{(invoice.amount - invoice.taxAmount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>GST (18% Included):</span>
              <span>₹{invoice.taxAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Total Due:</span>
              <span className="text-[#e35205]">₹{invoice.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailView;
