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
      description="Track manual expenditures like hotel bookings, flight tickets, dining, or transfers."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[#c0392b] text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Expense Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-abyss focus:outline-none focus:border-ocean-teal"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
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
          placeholder="e.g. 8500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          icon={DollarSign}
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
          icon={FileText}
        />

        {/* Destination Stop Selector */}
        {stops && stops.length > 0 && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Associated Destination (Optional)
            </label>
            <select
              value={tripStopId}
              onChange={(e) => setTripStopId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-abyss focus:outline-none focus:border-ocean-teal"
            >
              <option value="">General (Whole Trip)</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  {stop.city?.name}, {stop.city?.country}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
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
