import React, { useState } from 'react';
import { DollarSign, Tag, FileText, MapPin } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const CATEGORIES = [
  { value: 'transport', label: '🚗 Transport (Flights, Trains, Cabs)' },
  { value: 'stay', label: '🏨 Stay & Accommodation' },
  { value: 'activities', label: '🎟️ Activities & Entrance Fees' },
  { value: 'meals', label: '🍽️ Meals & Dining' },
  { value: 'other', label: '📦 Miscellaneous / Other' }
];

export const AddExpenseModal = ({ isOpen, onClose, tripId, stops = [], onExpenseAdded }) => {
  const { success, error: toastError } = useToast();

  const [category, setCategory] = useState('stay');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [tripStopId, setTripStopId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setErrorMsg('Please enter a valid expense amount greater than 0.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await api.post(`/trips/${tripId}/expenses`, {
        category,
        amount: parseFloat(amount),
        note: note.trim() || undefined,
        trip_stop_id: tripStopId ? parseInt(tripStopId, 10) : undefined
      });

      if (res.success) {
        success(`Logged ₹${parseFloat(amount).toLocaleString('en-IN')} under ${category}`);
        setAmount('');
        setNote('');
        setTripStopId('');
        if (onExpenseAdded) onExpenseAdded(res.data.expense);
        onClose();
      }
    } catch (err) {
      toastError(err.message || 'Failed to log expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Trip Expense"
      description="Track expenditures like hotel bookings, flight tickets, dining, or transfers in INR (₹)"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Category Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500">
            Expense Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm bg-[#DFE4EA] text-[#0F172A] rounded-2xl neu-input px-4 py-3 outline-none focus:border-amber-primary border border-slate-300"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-[#E5EAF0] text-[#0F172A]">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <FormInput
          label="Amount in INR (₹)"
          name="amount"
          type="number"
          step="50"
          placeholder="e.g. 8500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          leftIcon={DollarSign}
          required
        />

        {/* Description / Note */}
        <FormInput
          label="Description / Note (Optional)"
          name="note"
          type="text"
          placeholder="e.g. Shinkansen tickets or Hotel deposit"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          leftIcon={FileText}
        />

        {/* Destination Stop Selector */}
        {stops && stops.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500">
              Associated Destination (Optional)
            </label>
            <select
              value={tripStopId}
              onChange={(e) => setTripStopId(e.target.value)}
              className="w-full text-sm bg-[#DFE4EA] text-[#0F172A] rounded-2xl neu-input px-4 py-3 outline-none focus:border-amber-primary border border-slate-300"
            >
              <option value="" className="bg-[#E5EAF0] text-[#0F172A]">General (Whole Trip)</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id} className="bg-[#E5EAF0] text-[#0F172A]">
                  {stop.city?.name}, {stop.city?.country}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <Button variant="ghost" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
            Save Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;
