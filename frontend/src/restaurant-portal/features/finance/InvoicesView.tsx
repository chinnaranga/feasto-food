import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Filter, CheckCircle2, Clock, XCircle, Copy, Eye, X, Trash2 } from 'lucide-react';
import usePortalFinanceStore, { Invoice, InvoiceStatus, InvoiceLineItem } from '../../store/portalFinanceStore';

export const InvoicesView: React.FC = () => {
  const navigate = useNavigate();
  const { invoices, createInvoice, updateInvoiceStatus, duplicateInvoice } = usePortalFinanceStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // New Invoice Form State
  const [entityName, setEntityName] = useState<string>('');
  const [entityEmail, setEntityEmail] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [lineItems, setLineItems] = useState<Omit<InvoiceLineItem, 'id'>[]>([
    { description: '', quantity: 1, unitPrice: 0, total: 0 },
  ]);
  const [notes, setNotes] = useState<string>('');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.entityName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const handleLineItemChange = (index: number, field: keyof Omit<InvoiceLineItem, 'id'>, value: any) => {
    const updated = [...lineItems];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      item.total = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    }
    updated[index] = item;
    setLineItems(updated);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => lineItems.reduce((sum, item) => sum + item.total, 0);
  const calculateTax = () => Math.round(calculateSubtotal() * 0.18);
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityName.trim()) return;

    const formattedItems: InvoiceLineItem[] = lineItems.map((item, idx) => ({
      id: `li-${Date.now()}-${idx}`,
      description: item.description || 'Line Item',
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
    }));

    createInvoice({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      entityName,
      entityEmail: entityEmail || 'accounts@vendor.com',
      amount: calculateTotal(),
      taxAmount: calculateTax(),
      status: 'draft',
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      lineItems: formattedItems,
      notes,
    });

    setIsDrawerOpen(false);
    setEntityName('');
    setEntityEmail('');
    setLineItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    setNotes('');
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>;
      case 'overdue':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">Overdue</span>;
      case 'draft':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200">Draft</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-neutral-50 text-neutral-500 border border-neutral-200">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Invoice Management Directory
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Issue vendor invoices, track client receivables, and audit line item GST taxes
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
        >
          <Plus size={14} />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {['all', 'draft', 'paid', 'overdue', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search invoice # or entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#e35205]"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Billed Entity / Vendor</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount (Incl. Tax)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 font-bold text-xs">
                    No matching invoices found in this view filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-black text-neutral-900">
                      <button
                        onClick={() => navigate(`/restaurant-portal/finance/invoices/${inv.id}`)}
                        className="hover:text-[#e35205] cursor-pointer"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-800">{inv.entityName}</div>
                      <span className="text-[10px] text-neutral-400 font-normal">{inv.entityEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">{inv.createdAt}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{inv.dueDate}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(inv.status)}</td>
                    <td className="py-3.5 px-4 text-right font-black text-neutral-900">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/restaurant-portal/finance/invoices/${inv.id}`)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                          title="View Invoice Detail"
                        >
                          <Eye size={14} />
                        </button>
                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => duplicateInvoice(inv.id)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                          title="Duplicate Invoice"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col text-left">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200/80 flex items-center justify-between bg-neutral-50/60">
              <div>
                <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider font-heading">
                  Create Invoice Document
                </h3>
                <p className="text-[11px] text-neutral-400">Fill in client details and line items below</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateInvoice} className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Billed Entity Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tokyo Fish Market Ltd."
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#e35205]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="accounts@vendor.com"
                    value={entityEmail}
                    onChange={(e) => setEntityEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#e35205]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#e35205]"
                />
              </div>

              {/* Line Items Section */}
              <div className="space-y-3 pt-3 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
                    Line Items
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-[10px] font-bold text-[#e35205] hover:text-[#c94804] cursor-pointer"
                  >
                    + Add Line Item
                  </button>
                </div>

                {lineItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-neutral-400">Item #{idx + 1}</span>
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(idx)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Item description / service detail"
                      value={item.description}
                      onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-800 focus:outline-none"
                    />

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[9px] text-neutral-400 font-bold block">Qty</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-neutral-200 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-400 font-bold block">Rate (₹)</span>
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-neutral-200 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-400 font-bold block">Total (₹)</span>
                        <input
                          type="number"
                          readOnly
                          value={item.total}
                          className="w-full px-2 py-1 bg-neutral-100 border border-neutral-200 rounded-lg font-black text-neutral-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Calculation Box */}
              <div className="p-3 bg-neutral-900 text-white rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Estimated GST (18%):</span>
                  <span>₹{calculateTax().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-white pt-1 border-t border-neutral-800">
                  <span>Grand Total:</span>
                  <span className="text-[#e35205]">₹{calculateTotal().toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Internal Invoice Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional payment terms or NEFT instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-3xs"
                >
                  Save Draft Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesView;
