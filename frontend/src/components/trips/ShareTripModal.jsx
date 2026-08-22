import React, { useState } from 'react';
import { Share2, Copy, Check, ExternalLink, Globe, Lock } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const ShareTripModal = ({ isOpen, onClose, trip, onTripUpdated }) => {
  const { success, error: toastError } = useToast();
  const [isPublic, setIsPublic] = useState(trip?.is_public || false);
  const [shareSlug, setShareSlug] = useState(trip?.share_slug || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!trip) return null;

  const publicUrl = `${window.location.origin}/share/${shareSlug || trip.share_slug}`;

  const handleTogglePublish = async () => {
    setIsUpdating(true);
    try {
      const res = await api.put(`/trips/${trip.id}/publish`, { is_public: !isPublic });
      if (res.success) {
        setIsPublic(res.data.is_public);
        setShareSlug(res.data.share_slug);
        success(res.data.is_public ? 'Trip is now public and shareable!' : 'Trip is now private.');
        if (onTripUpdated) onTripUpdated(res.data);
      }
    } catch (err) {
      toastError(err.message || 'Failed to update trip visibility');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    success('Public share link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Trip Itinerary"
      description="Make this itinerary accessible to friends, family, or fellow travelers with a read-only link."
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 pt-2">
        {/* Public Status Banner */}
        <div className={`p-4 rounded-[16px] border transition-colors flex items-center justify-between gap-4 ${
          isPublic
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800'
            : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${isPublic ? 'bg-emerald-500/20 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
              {isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-display font-bold text-sm">
                {isPublic ? 'Publicly Accessible' : 'Private Itinerary'}
              </p>
              <p className="text-xs text-slate-500">
                {isPublic
                  ? 'Anyone with the link can view and copy this trip.'
                  : 'Only you and invited collaborators can view.'}
              </p>
            </div>
          </div>

          <Button
            variant={isPublic ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleTogglePublish}
            isLoading={isUpdating}
          >
            {isPublic ? 'Make Private' : 'Publish Trip'}
          </Button>
        </div>

        {/* Share Link Input */}
        {isPublic && (
          <div className="space-y-2 animate-fade-in">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Public Shareable Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none select-all"
              />
              <Button
                variant="primary"
                size="md"
                icon={copied ? Check : Copy}
                onClick={handleCopyLink}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        )}

        {/* Preview Link */}
        {isPublic && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-400">Want to test how others see it?</span>
            <a
              href={`/share/${shareSlug || trip.share_slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-ocean-teal hover:underline"
            >
              <span>Open Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <div className="pt-3 flex justify-end">
          <Button variant="ghost" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareTripModal;
