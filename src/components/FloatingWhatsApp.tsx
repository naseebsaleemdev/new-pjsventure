import { useEffect, useRef, useState, type FormEvent } from 'react';
import QRCode from 'qrcode';
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Maximize2,
  MessageCircle,
  Minimize2,
  QrCode,
  Send,
  X,
} from 'lucide-react';
import { DestinationPort, PortalQuery, Vehicle } from '../types/vehicle';

interface FloatingWhatsAppProps {
  vehicles: Vehicle[];
  activeVehicle?: Vehicle | null;
  selectedPort: DestinationPort;
  hasBottomCompareBar: boolean;
  onSubmitWhatsAppQuery: (
    query: Omit<PortalQuery, 'id' | 'referenceId' | 'status' | 'createdAt'>
  ) => PortalQuery;
}

const WHATSAPP_NUMBER = '81450000000';

export function FloatingWhatsApp({
  vehicles,
  activeVehicle,
  selectedPort,
  hasBottomCompareBar,
  onSubmitWhatsAppQuery,
}: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStockNo, setSelectedStockNo] = useState(
    activeVehicle?.stockNo || ''
  );
  const [buyerName, setBuyerName] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [message, setMessage] = useState(
    'Hi Pjs Venture Sales Team, please share availability and latest CIF / Port Balance details.'
  );
  const [sentRef, setSentRef] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrExpanded, setQrExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const focusTimerRef = useRef<number | null>(null);
  const [viewportMetrics, setViewportMetrics] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    offsetTop: 0,
    keyboardOpen: false,
  }));

  // Keep vehicle selector synced when navigating to/from single vehicle pages
  useEffect(() => {
    setSelectedStockNo(activeVehicle?.stockNo || '');
  }, [activeVehicle?.id, activeVehicle?.stockNo]);

  // Track visualViewport so the dialog fits above the mobile keyboard without clipping
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const updateMetrics = () => {
      const vv = window.visualViewport;
      const width = vv ? vv.width : window.innerWidth;
      const height = vv ? vv.height : window.innerHeight;
      const offsetTop = vv ? vv.offsetTop : 0;
      const keyboardOpen = vv != null && window.innerHeight - vv.height > 120;

      setViewportMetrics({ width, height, offsetTop, keyboardOpen });
    };

    updateMetrics();

    const vv = window.visualViewport;
    vv?.addEventListener('resize', updateMetrics);
    vv?.addEventListener('scroll', updateMetrics);
    window.addEventListener('resize', updateMetrics);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      vv?.removeEventListener('resize', updateMetrics);
      vv?.removeEventListener('scroll', updateMetrics);
      window.removeEventListener('resize', updateMetrics);
      window.removeEventListener('keydown', handleKeyDown);
      if (focusTimerRef.current !== null) {
        window.clearTimeout(focusTimerRef.current);
        focusTimerRef.current = null;
      }
    };
  }, [isOpen]);

  const useViewportSheet =
    viewportMetrics.width < 640 ||
    viewportMetrics.keyboardOpen ||
    viewportMetrics.height < 560;

  useEffect(() => {
    const el = dialogRef.current;
    if (!isOpen || !el) return;

    if (useViewportSheet) {
      const margin = viewportMetrics.width < 640 ? 8 : 12;
      const topPx = Math.max(margin, Math.round(viewportMetrics.offsetTop + margin));
      const maxHeightPx = Math.max(
        200,
        Math.round(viewportMetrics.height - margin * 2)
      );
      el.style.setProperty('--wa-vv-top', `${topPx}px`);
      el.style.setProperty('--wa-vv-max-h', `${maxHeightPx}px`);
    } else {
      el.style.removeProperty('--wa-vv-top');
      el.style.removeProperty('--wa-vv-max-h');
    }
  }, [isOpen, useViewportSheet, viewportMetrics]);

  const handleFieldFocus = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return;
    if (focusTimerRef.current !== null) {
      window.clearTimeout(focusTimerRef.current);
    }
    focusTimerRef.current = window.setTimeout(() => {
      target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 180);
  };

  const chosenVehicle =
    vehicles.find((v) => v.stockNo === selectedStockNo) || activeVehicle || null;

  const vehicleDirectUrl =
    typeof window !== 'undefined' && chosenVehicle
      ? `${window.location.origin}/car/${chosenVehicle.id}`
      : '';

  const waMessageBody = [
    'Hello Pjs Venture Sales Team,',
    chosenVehicle
      ? `Inquiry for: ${chosenVehicle.year} ${chosenVehicle.make} ${chosenVehicle.model} (${chosenVehicle.stockNo})`
      : 'General Inventory & Port Balance Inquiry',
    chosenVehicle
      ? chosenVehicle.availability === 'Port Balance' && chosenVehicle.portBalancePort
        ? `Terms: Port Balance (${chosenVehicle.portBalancePort}) · Total $${chosenVehicle.fobUsd.toLocaleString()}`
        : `FOB Price: $${chosenVehicle.fobUsd.toLocaleString()} (${chosenVehicle.yardPort})`
      : '',
    vehicleDirectUrl ? `Listing: ${vehicleDirectUrl}` : '',
    `Destination Port: ${selectedPort.portName}, ${selectedPort.country}`,
    buyerName.trim() ? `Name: ${buyerName.trim()}` : '',
    message.trim(),
  ]
    .filter(Boolean)
    .join('\n');

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessageBody)}`;

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(waHref, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (!cancelled) {
          setQrDataUrl(url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrDataUrl('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [waHref]);

  const handleCopyWhatsAppLink = async () => {
    try {
      await navigator.clipboard.writeText(waHref);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !phoneWhatsApp.trim()) return;

    const created = onSubmitWhatsAppQuery({
      type: 'Vehicle Inquiry',
      buyerName: buyerName.trim(),
      companyName: 'WhatsApp Sales Lead',
      email: 'Via WhatsApp Chat',
      phoneWhatsApp: phoneWhatsApp.trim(),
      destinationPort: `${selectedPort.portName}, ${selectedPort.country}`,
      subject: chosenVehicle
        ? `WhatsApp: ${chosenVehicle.year} ${chosenVehicle.make} ${chosenVehicle.model} (${chosenVehicle.stockNo})`
        : 'WhatsApp Real-Time Inventory Inquiry',
      vehicleRefs: chosenVehicle ? [chosenVehicle.stockNo] : [],
      notes: message.trim(),
    });

    setSentRef(created.referenceId);
  };

  return (
    <>
      {isOpen && useViewportSheet && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed right-3 sm:right-5 ${
          isOpen ? 'z-50' : 'z-40'
        } transition-all duration-200 ${
          hasBottomCompareBar ? 'bottom-20' : 'bottom-4 sm:bottom-5'
        }`}
      >
        {isOpen && (
          <div
            ref={dialogRef}
            role="dialog"
            aria-label="WhatsApp Sales Team Quick Inquiry"
            className={
              useViewportSheet
                ? 'fixed inset-x-2.5 sm:left-auto sm:right-5 sm:w-[380px] top-[var(--wa-vv-top,0.5rem)] max-h-[var(--wa-vv-max-h,calc(100dvh-1rem))] z-50 flex flex-col overflow-hidden bg-white border border-slate-200 rounded-xl shadow-2xl'
                : `mb-3 w-[380px] ${
                    hasBottomCompareBar
                      ? 'max-h-[min(640px,calc(100dvh-160px))]'
                      : 'max-h-[min(640px,calc(100dvh-104px))]'
                  } flex flex-col overflow-hidden bg-white border border-slate-200 rounded-xl shadow-2xl`
            }
          >
            <div className="bg-[#15803D] text-white px-4 py-2.5 sm:py-3 flex items-center justify-between shrink-0">
              <div>
                <p className="font-display text-sm font-bold">
                  Pjs Venture WhatsApp Desk
                </p>
                <p className="text-[11px] text-emerald-100">
                  Real-time Japan stock &amp; Port Balance quotes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close WhatsApp widget"
                className="p-1.5 rounded hover:bg-white/15 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-2.5 sm:space-y-3">
              {/* Vehicle Selection + Mobile WhatsApp QR Code */}
              <div className="space-y-2.5">
                <div>
                  <label
                    htmlFor="wa-stock"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Vehicle for WhatsApp &amp; QR Scan
                  </label>
                  <select
                    id="wa-stock"
                    value={selectedStockNo}
                    onChange={(e) => setSelectedStockNo(e.target.value)}
                    onFocus={(e) => handleFieldFocus(e.currentTarget)}
                    className="w-full px-2.5 py-2 sm:py-1.5 text-base sm:text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="">General Stock / Port Balance Inquiry</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.stockNo}>
                        {v.stockNo} — {v.year} {v.make} {v.model}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scannable QR Code Card */}
                <div className="p-2.5 sm:p-3 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                  <div
                    className={
                      qrExpanded
                        ? 'flex flex-col items-center text-center gap-2.5'
                        : 'flex items-center gap-2.5 sm:gap-3'
                    }
                  >
                    <div
                      className={`bg-white border border-slate-200 rounded-md p-1.5 shrink-0 flex items-center justify-center ${
                        qrExpanded
                          ? 'w-36 h-36 sm:w-44 sm:h-44'
                          : 'w-16 h-16 sm:w-24 sm:h-24'
                      }`}
                    >
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt={
                            chosenVehicle
                              ? `WhatsApp QR code for ${chosenVehicle.year} ${chosenVehicle.make} ${chosenVehicle.model} (${chosenVehicle.stockNo})`
                              : 'WhatsApp QR code for Pjs Venture sales team'
                          }
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <QrCode className="w-6 h-6" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-xs font-semibold text-slate-900 leading-snug">
                        {chosenVehicle
                          ? `${chosenVehicle.year} ${chosenVehicle.make} ${chosenVehicle.model}`
                          : 'Direct Sales Desk Chat'}
                      </p>
                      <p className="font-mono text-[11px] text-slate-600 tabular-nums truncate">
                        {chosenVehicle
                          ? `${chosenVehicle.stockNo} · $${chosenVehicle.fobUsd.toLocaleString()} FOB`
                          : `${selectedPort.portName}, ${selectedPort.country}`}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Scan with your phone camera to open this exact unit in WhatsApp.
                      </p>

                      <div
                        className={`flex items-center gap-2 pt-1 ${
                          qrExpanded ? 'justify-center' : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setQrExpanded((prev) => !prev)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded cursor-pointer whitespace-nowrap"
                        >
                          {qrExpanded ? (
                            <>
                              <Minimize2 className="w-3 h-3" aria-hidden="true" />
                              <span>Compact</span>
                            </>
                          ) : (
                            <>
                              <Maximize2 className="w-3 h-3" aria-hidden="true" />
                              <span>Enlarge QR</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyWhatsAppLink}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded cursor-pointer whitespace-nowrap"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-700" aria-hidden="true" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" aria-hidden="true" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {sentRef ? (
                <div className="p-3.5 bg-[#F8F9FA] border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="text-xs">
                      <p className="font-mono font-semibold text-emerald-800">
                        {sentRef} — Message Sent
                      </p>
                      <p className="text-slate-600 mt-1">
                        Our Yokohama sales desk has received your WhatsApp inquiry and will reply shortly.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Launch WhatsApp App</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSentRef(null)}
                      className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
                    >
                      New
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  onFocusCapture={(e) => handleFieldFocus(e.target)}
                  className="space-y-2.5 text-xs pt-1.5 border-t border-slate-200"
                >
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2">
                    <div>
                      <label
                        htmlFor="wa-name"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Your Name *
                      </label>
                      <input
                        id="wa-name"
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-2.5 py-2 sm:py-1.5 text-base sm:text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="wa-phone"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        WhatsApp No. *
                      </label>
                      <input
                        id="wa-phone"
                        type="tel"
                        required
                        value={phoneWhatsApp}
                        onChange={(e) => setPhoneWhatsApp(e.target.value)}
                        placeholder="+92 / +254..."
                        className="w-full px-2.5 py-2 sm:py-1.5 text-base sm:text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="wa-msg"
                      className="block font-semibold text-slate-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="wa-msg"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-2.5 py-2 sm:py-1.5 text-base sm:text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Send Inquiry</span>
                    </button>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-3 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>WhatsApp Chat</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Floating WhatsApp Trigger Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Message Pjs Venture sales team on WhatsApp"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#15803D] hover:bg-[#166534] text-white shadow-lg border border-emerald-700 transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold hidden sm:inline">
              WhatsApp Sales
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
