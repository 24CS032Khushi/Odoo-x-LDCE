import React, { useState } from 'react';
import { Calendar, Printer, Download, Check, FileText, Smartphone, Shield, Sparkles } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { generateICSFile } from '../../utils/calendarExport';
import { useToast } from '../../context/ToastContext';

export const ExportTripModal = ({ isOpen, onClose, trip, itineraryDays = {} }) => {
  const { success } = useToast();
  const [downloadedICS, setDownloadedICS] = useState(false);

  if (!trip) return null;

  const handleExportICS = () => {
    generateICSFile(trip, itineraryDays);
    setDownloadedICS(true);
    success('Calendar file (.ics) downloaded! Open it to sync with Apple Calendar, Google Calendar, or Outlook.');
    setTimeout(() => setDownloadedICS(false), 3000);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export & Offline Traveler Packet"
      description="Sync your scheduled itinerary with your personal calendar or generate an offline printable dossier."
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 pt-1">
        {/* Option 1: .ICS Calendar Sync Card */}
        <div className="p-5 rounded-[18px] bg-slate-50 border border-slate-200/80 hover:border-ocean-teal transition-all space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-ocean-teal/10 text-ocean-teal flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-abyss">
                  1-Click Calendar Sync (.ics)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compatible with Apple Calendar, Google Calendar, and Microsoft Outlook.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> All mobile & desktop apps
            </span>
            <Button
              variant="primary"
              size="sm"
              icon={downloadedICS ? Check : Download}
              onClick={handleExportICS}
            >
              {downloadedICS ? 'Downloaded' : 'Download .ics File'}
            </Button>
          </div>
        </div>

        {/* Option 2: Print Traveler Dossier */}
        <div className="p-5 rounded-[18px] bg-slate-50 border border-slate-200/80 hover:border-ocean-teal transition-all space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 flex-shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-abyss">
                  Print Traveler Dossier (PDF)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-density printable layout for airports, trains, and offline transit.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> PDF / Paper ready
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={Printer}
              onClick={handlePrintDossier}
            >
              Open Print Dossier
            </Button>
          </div>
        </div>

        {/* Offline Safety Assurance Note */}
        <div className="p-3.5 rounded-[14px] bg-ocean-teal/5 border border-ocean-teal/15 flex items-center gap-3 text-xs text-ocean-deep">
          <Shield className="w-4 h-4 text-ocean-teal flex-shrink-0" />
          <span>
            Calendar files embed complete location tags, duration windows, and estimated expense notes offline.
          </span>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="ghost" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportTripModal;
