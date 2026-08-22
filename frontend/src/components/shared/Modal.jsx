import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
      {/* Off-White Tactile Backdrop with Deep Blur (z-[100] to sit ABOVE floating navbar z-40) */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Centering Wrapper */}
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 text-center">
        <div
          className={`relative w-full ${maxWidth} transform overflow-hidden rounded-[32px] neu-modal text-[#0F172A] text-left transition-all animate-scale-up z-10 shadow-neu-modal`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 sm:p-7 pb-4 border-b border-slate-300/80">
              <div className="space-y-1">
                {title && (
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#0F172A] tracking-tight flex items-center gap-1.5">
                    <span>{title}</span>
                    <span className="text-amber-primary">.</span>
                  </h3>
                )}
                {description && <p className="text-xs text-slate-600 font-sans">{description}</p>}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-500 hover:text-[#0F172A] bg-[#DFE4EA] border border-slate-300 hover:border-amber-primary/40 shadow-neu-inset-sm transition-all focus:outline-none"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Body with max-height scroll protection */}
          <div className="p-6 sm:p-7 max-h-[calc(85vh-120px)] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
