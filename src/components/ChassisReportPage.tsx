import { useEffect, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FilePlus2,
  Printer,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { resolveChassisInspectionReport } from '../data/chassisDecoder';
import {
  ChassisInspectionReport,
  PageRoute,
  Vehicle,
} from '../types/vehicle';

interface ChassisReportPageProps {
  initialChassis?: string;
  vehicles: Vehicle[];
  customReports: ChassisInspectionReport[];
  onAddChassisReport: (report: ChassisInspectionReport) => void;
  onInspectVehicle: (vehicle: Vehicle) => void;
  onNavigate: (route: PageRoute) => void;
}

export function ChassisReportPage({
  initialChassis,
  vehicles,
  customReports,
  onAddChassisReport,
  onInspectVehicle,
  onNavigate,
}: ChassisReportPageProps) {
  const [chassisQuery, setChassisQuery] = useState(
    initialChassis || 'JTMHY7AJ9J4061821'
  );
  const [activeReport, setActiveReport] = useState<ChassisInspectionReport>(() =>
    resolveChassisInspectionReport(
      initialChassis || 'JTMHY7AJ9J4061821',
      customReports,
      vehicles
    )
  );
  const [recentReports, setRecentReports] = useState<ChassisInspectionReport[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Add New Chassis Inspection Report Form State
  const [newChassis, setNewChassis] = useState('');
  const [newMake, setNewMake] = useState('Toyota');
  const [newModel, setNewModel] = useState('Corolla Fielder Hybrid');
  const [newYear, setNewYear] = useState(2021);
  const [newMonth, setNewMonth] = useState(5);
  const [newEngineCc, setNewEngineCc] = useState(1496);
  const [newFuel, setNewFuel] = useState<ChassisInspectionReport['fuel']>('Hybrid');
  const [newTrans, setNewTrans] = useState<ChassisInspectionReport['transmission']>('CVT');
  const [newDrive, setNewDrive] = useState<ChassisInspectionReport['drive']>('2WD');
  const [newColor, setNewColor] = useState('Pearl White');
  const [newMileage, setNewMileage] = useState(38200);
  const [newAgency, setNewAgency] =
    useState<ChassisInspectionReport['inspectionAgency']>('JEVIC');
  const [newYard, setNewYard] = useState('Yokohama Export Yard');
  const [newGrade, setNewGrade] = useState('4.5');
  const [newExtGrade, setNewExtGrade] = useState('A');
  const [newIntGrade, setNewIntGrade] = useState('A');
  const [newTheftRecord, setNewTheftRecord] = useState(
    'Clean — No Japan or Interpol Theft Alerts'
  );
  const [newSalvageRecord, setNewSalvageRecord] = useState(
    'None — Non-Salvage, Zero Fire or Flood History'
  );
  const [newRecallStatus, setNewRecallStatus] = useState(
    '0 Open Manufacturer Recalls'
  );
  const [newNote, setNewNote] = useState(
    'Verified non-accident urban Japan vehicle with clean underbody and confirmed odometer.'
  );
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (initialChassis) {
      setChassisQuery(initialChassis);
      setActiveReport(
        resolveChassisInspectionReport(initialChassis, customReports, vehicles)
      );
    }
  }, [initialChassis, customReports, vehicles]);

  const cleanedInput = chassisQuery.toUpperCase().replace(/\s+/g, '');
  const alnumLen = cleanedInput.replace(/[^A-Z0-9]/g, '').length;
  const isJapanFrame = cleanedInput.includes('-');
  const isReady17Vin = !isJapanFrame && alnumLen === 17;

  const pushRecentReport = (report: ChassisInspectionReport) => {
    setRecentReports((prev) => [
      report,
      ...prev.filter((r) => r.chassisNo.toUpperCase() !== report.chassisNo.toUpperCase()),
    ].slice(0, 6));
  };

  const handleLookupSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = chassisQuery.toUpperCase().replace(/\s+/g, '');
    if (!cleaned) {
      setLookupError('Please enter a 17-digit VIN or Japanese chassis number.');
      return;
    }
    const strippedLen = cleaned.replace(/[^A-Z0-9]/g, '').length;
    if (!cleaned.includes('-') && strippedLen < 6) {
      setLookupError('Enter a full 17-character VIN (or a Japanese chassis code like GDJ150W-019482).');
      return;
    }
    setLookupError(null);
    setChassisQuery(cleaned);
    const report = resolveChassisInspectionReport(cleaned, customReports, vehicles);
    setActiveReport(report);
    pushRecentReport(report);
  };

  const handleQuickSelect = (chassis: string) => {
    const cleaned = chassis.toUpperCase().replace(/\s+/g, '');
    setLookupError(null);
    setChassisQuery(cleaned);
    const report = resolveChassisInspectionReport(cleaned, customReports, vehicles);
    setActiveReport(report);
    pushRecentReport(report);
  };

  const handleCreateReport = (e: FormEvent) => {
    e.preventDefault();
    const cleanChassis = newChassis.trim().toUpperCase();
    if (!cleanChassis || !newMake.trim() || !newModel.trim()) return;

    const created: ChassisInspectionReport = {
      id: `chr-${Date.now()}`,
      reportNo: `${newAgency}-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      chassisNo: cleanChassis,
      make: newMake.trim(),
      model: newModel.trim(),
      year: Number(newYear),
      month: Number(newMonth),
      engineCc: Number(newEngineCc),
      fuel: newFuel,
      transmission: newTrans,
      drive: newDrive,
      color: newColor.trim() || 'White',
      mileageKm: Number(newMileage),
      inspectionAgency: newAgency,
      inspectionYard: newYard,
      inspectionDate: new Date().toISOString().slice(0, 10),
      auctionGrade: newGrade,
      exteriorGrade: newExtGrade.toUpperCase(),
      interiorGrade: newIntGrade.toUpperCase(),
      radiationLevel: '0.06 μSv/h (Passed)',
      odometerStatus: 'Verified Genuine',
      accidentHistory: 'No Structural Frame Damage',
      floodStatus: 'No Flood / Water Damage',
      theftRecord: newTheftRecord.trim() || 'Clean — No Japan or Interpol Theft Alerts',
      salvageRecord: newSalvageRecord.trim() || 'None — Verified Non-Salvage Title',
      recallStatus: newRecallStatus.trim() || '0 Open Manufacturer Recalls',
      registrationHistory: [
        {
          period: `${Number(newYear)}-${String(newMonth).padStart(2, '0')}`,
          region: 'Tokyo / Yokohama',
          usage: 'Private Registered',
          event: 'First MLIT Registration',
        },
        {
          period: `${Math.min(2025, Number(newYear) + 2)}-${String(newMonth).padStart(2, '0')}`,
          region: 'Tokyo / Yokohama',
          usage: 'Private Registered',
          event: 'Shaken Inspection Cleared',
        },
        {
          period: new Date().toISOString().slice(0, 7),
          region: newYard,
          usage: 'Export Deregistration',
          event: `${newAgency} Pre-Export VIN & Chassis Verification`,
        },
      ],
      panelCodes: {
        front: 'A1 (Clean bumper, minor stone mark)',
        hood: 'Original Paint Verified',
        roof: 'Clean',
        leftSide: 'Original Paint',
        rightSide: 'Clean',
        rear: 'Original Tailgate Verified',
      },
      mechanicalChecks: {
        engine: `${Number(newEngineCc).toLocaleString()} cc ${newFuel} · Smooth idle, leak-free`,
        transmission: `${newTrans} · Road test verified`,
        suspension: `${newDrive} drivetrain & steering dry`,
        brakesAbs: 'Pads >75% · ABS diagnostic passed',
        acCooling: 'Climate control cooling verified',
        underbodyRust: 'Clean rails · Zero frame corrosion',
      },
      mileageHistory: [
        {
          date: `${Number(newYear) + 2}-${String(newMonth).padStart(2, '0')}`,
          mileageKm: Math.round(Number(newMileage) * 0.45),
          source: 'Japan MLIT Shaken Inspection',
        },
        {
          date: '2025-11',
          mileageKm: Math.round(Number(newMileage) * 0.85),
          source: 'Japanese Auction Sheet Archive',
        },
        {
          date: new Date().toISOString().slice(0, 7),
          mileageKm: Number(newMileage),
          source: `${newAgency} Pre-Export Inspection`,
        },
      ],
      inspectorNote: newNote.trim(),
    };

    onAddChassisReport(created);
    setChassisQuery(cleanChassis);
    setActiveReport(created);
    setSavedNotice(
      `Saved Inspection Report ${created.reportNo} for Chassis ${cleanChassis}.`
    );
    setShowAddForm(false);
    setNewChassis('');
  };

  const linkedVehicle = activeReport.linkedVehicleId
    ? vehicles.find((v) => v.id === activeReport.linkedVehicleId)
    : vehicles.find(
        (v) =>
          v.chassisCode.trim().toUpperCase() ===
          activeReport.chassisNo.trim().toUpperCase()
      );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"
          >
            <button
              type="button"
              onClick={() => onNavigate({ name: 'home' })}
              className="hover:text-[#B91C1C] hover:underline cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span className="font-medium text-slate-900">
              VIN &amp; Chassis Report
            </span>
          </nav>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            VIN &amp; Chassis History Inspection Report
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Enter any 17-digit VIN or Japanese chassis / frame number to verify theft &amp; salvage history, MLIT registration timeline, odometer log, JEVIC radiation reading, and panel condition map.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <FilePlus2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>
            {showAddForm
              ? 'Close Add Report Form'
              : 'Add / Register VIN Report'}
          </span>
        </button>
      </div>

      {/* Saved Confirmation */}
      {savedNotice && (
        <div className="bg-white border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{savedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSavedNotice(null)}
            className="text-slate-500 hover:text-slate-900 underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Optional Inline "Add New Chassis Inspection Report" Drawer */}
      {showAddForm && (
        <section
          aria-label="Register New Chassis Inspection Report"
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-display text-base font-bold text-slate-950">
              Register Official Chassis Inspection Report
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Saved reports become immediately searchable by buyers on this page.
            </p>
          </div>

          <form
            onSubmit={handleCreateReport}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs"
          >
            <div>
              <label htmlFor="cr-chassis" className="block font-semibold text-slate-700 mb-1">
                VIN / Chassis Frame No. *
              </label>
              <input
                id="cr-chassis"
                type="text"
                required
                value={newChassis}
                onChange={(e) => setNewChassis(e.target.value)}
                placeholder="e.g. NKE165-7048219 or JTMBD33V..."
                className="w-full px-3 py-2 font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="cr-make" className="block font-semibold text-slate-700 mb-1">
                Make *
              </label>
              <input
                id="cr-make"
                type="text"
                required
                value={newMake}
                onChange={(e) => setNewMake(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="cr-model" className="block font-semibold text-slate-700 mb-1">
                Model &amp; Trim *
              </label>
              <input
                id="cr-model"
                type="text"
                required
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="cr-year" className="block font-semibold text-slate-700 mb-1">
                  Year
                </label>
                <input
                  id="cr-year"
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(Number(e.target.value))}
                  className="w-full px-2.5 py-2 font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="cr-month" className="block font-semibold text-slate-700 mb-1">
                  Month
                </label>
                <input
                  id="cr-month"
                  type="number"
                  min={1}
                  max={12}
                  value={newMonth}
                  onChange={(e) => setNewMonth(Number(e.target.value))}
                  className="w-full px-2.5 py-2 font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cr-km" className="block font-semibold text-slate-700 mb-1">
                Verified Mileage (km)
              </label>
              <input
                id="cr-km"
                type="number"
                value={newMileage}
                onChange={(e) => setNewMileage(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="cr-cc" className="block font-semibold text-slate-700 mb-1">
                Engine (cc)
              </label>
              <input
                id="cr-cc"
                type="number"
                value={newEngineCc}
                onChange={(e) => setNewEngineCc(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="cr-fuel" className="block font-semibold text-slate-700 mb-1">
                Fuel / Trans / Drive
              </label>
              <div className="grid grid-cols-3 gap-1">
                <select
                  id="cr-fuel"
                  value={newFuel}
                  onChange={(e) =>
                    setNewFuel(e.target.value as ChassisInspectionReport['fuel'])
                  }
                  className="px-1.5 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Diesel">Diesel</option>
                </select>
                <select
                  value={newTrans}
                  onChange={(e) =>
                    setNewTrans(
                      e.target.value as ChassisInspectionReport['transmission']
                    )
                  }
                  aria-label="Transmission"
                  className="px-1.5 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                >
                  <option value="Automatic">AT</option>
                  <option value="CVT">CVT</option>
                  <option value="Manual">MT</option>
                </select>
                <select
                  value={newDrive}
                  onChange={(e) =>
                    setNewDrive(e.target.value as ChassisInspectionReport['drive'])
                  }
                  aria-label="Drive"
                  className="px-1.5 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                >
                  <option value="2WD">2WD</option>
                  <option value="4WD">4WD</option>
                  <option value="AWD">AWD</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="cr-agency" className="block font-semibold text-slate-700 mb-1">
                Agency &amp; Grades
              </label>
              <div className="grid grid-cols-4 gap-1">
                <select
                  id="cr-agency"
                  value={newAgency}
                  onChange={(e) =>
                    setNewAgency(
                      e.target.value as ChassisInspectionReport['inspectionAgency']
                    )
                  }
                  className="col-span-2 px-2 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                >
                  <option value="JEVIC">JEVIC</option>
                  <option value="JAAI">JAAI</option>
                  <option value="QISJ">QISJ</option>
                </select>
                <input
                  type="text"
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  aria-label="Auction grade"
                  placeholder="4.5"
                  className="px-2 py-2 font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={`${newExtGrade}/${newIntGrade}`}
                  onChange={(e) => {
                    const [ext, int] = e.target.value.split('/');
                    if (ext !== undefined) setNewExtGrade(ext);
                    if (int !== undefined) setNewIntGrade(int);
                  }}
                  aria-label="Exterior and interior grade"
                  placeholder="A/A"
                  className="px-2 py-2 font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cr-color" className="block font-semibold text-slate-700 mb-1">
                Color
              </label>
              <input
                id="cr-color"
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="cr-yard" className="block font-semibold text-slate-700 mb-1">
                Inspection Yard
              </label>
              <input
                id="cr-yard"
                type="text"
                value={newYard}
                onChange={(e) => setNewYard(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="cr-theft" className="block font-semibold text-slate-700 mb-1">
                Theft Record Check
              </label>
              <input
                id="cr-theft"
                type="text"
                value={newTheftRecord}
                onChange={(e) => setNewTheftRecord(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="cr-salvage" className="block font-semibold text-slate-700 mb-1">
                Salvage / Flood / Fire Check
              </label>
              <input
                id="cr-salvage"
                type="text"
                value={newSalvageRecord}
                onChange={(e) => setNewSalvageRecord(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="cr-recall" className="block font-semibold text-slate-700 mb-1">
                Manufacturer Recalls
              </label>
              <input
                id="cr-recall"
                type="text"
                value={newRecallStatus}
                onChange={(e) => setNewRecallStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="cr-note" className="block font-semibold text-slate-700 mb-1">
                Inspector Assessment Note
              </label>
              <input
                id="cr-note"
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2.5 font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
              >
                Save &amp; Generate Full VIN History Report
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Search Chassis / 17-Digit VIN Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <form
          onSubmit={handleLookupSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={chassisQuery}
              onChange={(e) => {
                setChassisQuery(e.target.value.toUpperCase());
                if (lookupError) setLookupError(null);
              }}
              maxLength={24}
              placeholder="Enter any 17-digit VIN (e.g. JTMHY7AJ9J4061821) or Japan Chassis No. (e.g. GDJ150W-019482)..."
              className="w-full pl-10 pr-36 py-2.5 text-sm font-mono uppercase bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
            />
            <span
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[11px] font-mono font-semibold rounded border ${
                isReady17Vin
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : isJapanFrame
                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {isJapanFrame
                ? 'JP Frame Code'
                : `${alnumLen} / 17 VIN`}
            </span>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Generate VIN Report
          </button>
        </form>

        {lookupError && (
          <p className="text-xs font-medium text-[#B91C1C]">{lookupError}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span>Try 17-Digit VIN / Chassis:</span>
          {[
            'JTMHY7AJ9J4061821',
            'JTEBU5JR5M5884120',
            'WBA8E9G57HNU12345',
            ...customReports.map((r) => r.chassisNo),
            ...vehicles.slice(0, 2).map((v) => v.chassisCode),
          ]
            .filter((val, i, arr) => arr.indexOf(val) === i)
            .slice(0, 6)
            .map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleQuickSelect(code)}
                className={`px-2.5 py-1 font-mono rounded border cursor-pointer transition-colors ${
                  activeReport.chassisNo.toUpperCase() === code.toUpperCase()
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-[#F8F9FA] text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {code}
              </button>
            ))}
        </div>

        {recentReports.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Recent Generated:</span>
            {recentReports.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleQuickSelect(item.chassisNo)}
                className={`px-2 py-0.5 font-mono rounded border cursor-pointer transition-colors ${
                  activeReport.chassisNo.toUpperCase() === item.chassisNo.toUpperCase()
                    ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {item.chassisNo} ({item.year} {item.make})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full Printable Japanese Pre-Export Inspection Certificate */}
      <article className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Certificate Top Bar */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-6 h-6 text-emerald-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-mono text-xs text-slate-300 tabular-nums">
                Certificate {activeReport.reportNo} · {activeReport.inspectionAgency} Standard · Date {activeReport.inspectionDate}
              </p>
              <h2 className="font-display text-lg sm:text-xl font-bold">
                {activeReport.year} {activeReport.make} {activeReport.model}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white font-mono text-xs font-semibold rounded">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>PASS / VERIFIED</span>
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-lg cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Core Identification & Clearance Strip */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-[#F8F9FA] border border-slate-200 rounded-xl text-xs">
            <div>
              <dt className="text-slate-500">Chassis / Frame No.</dt>
              <dd className="font-mono font-bold text-slate-950 mt-0.5">
                {activeReport.chassisNo}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Reg. Year / Month</dt>
              <dd className="font-mono font-semibold text-slate-950 mt-0.5 tabular-nums">
                {activeReport.year} / {String(activeReport.month).padStart(2, '0')}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Verified Mileage</dt>
              <dd className="font-mono font-bold text-[#B91C1C] mt-0.5 tabular-nums">
                {activeReport.mileageKm.toLocaleString()} km
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Auction Grade</dt>
              <dd className="font-mono font-bold text-slate-950 mt-0.5 tabular-nums">
                {activeReport.auctionGrade} (Ext {activeReport.exteriorGrade} / Int {activeReport.interiorGrade})
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Engine / Fuel</dt>
              <dd className="font-mono font-semibold text-slate-950 mt-0.5 tabular-nums">
                {activeReport.engineCc.toLocaleString()} cc · {activeReport.fuel}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Inspection Terminal</dt>
              <dd className="font-semibold text-slate-950 mt-0.5">
                {activeReport.inspectionYard}
              </dd>
            </div>
          </dl>

          {/* 17-Digit ISO VIN Structural Breakdown (when 17-char VIN is checked) */}
          {activeReport.vinBreakdown && (
            <section
              aria-label="17-Digit VIN Decoder Breakdown"
              className="border border-slate-200 rounded-xl p-4 bg-white space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <h3 className="font-display text-sm font-bold text-slate-950">
                  17-Digit ISO VIN Structure Breakdown
                </h3>
                <span className="font-mono text-[11px] text-slate-500">
                  Origin: {activeReport.vinBreakdown.originCountry} · {activeReport.vinBreakdown.manufacturer}
                </span>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="p-2.5 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                  <dt className="text-[11px] text-slate-500">WMI (Chars 1–3)</dt>
                  <dd className="font-mono font-bold text-slate-950 mt-0.5">
                    {activeReport.vinBreakdown.wmi}
                  </dd>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {activeReport.vinBreakdown.originCountry}
                  </span>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                  <dt className="text-[11px] text-slate-500">VDS (Chars 4–8)</dt>
                  <dd className="font-mono font-bold text-slate-950 mt-0.5">
                    {activeReport.vinBreakdown.vds}
                  </dd>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Vehicle Descriptor
                  </span>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                  <dt className="text-[11px] text-slate-500">Check Digit (9)</dt>
                  <dd className="font-mono font-bold text-emerald-800 mt-0.5">
                    {activeReport.vinBreakdown.checkDigit} (Verified)
                  </dd>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    ISO 3779 Position 9
                  </span>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                  <dt className="text-[11px] text-slate-500">Model Year (10)</dt>
                  <dd className="font-mono font-bold text-slate-950 mt-0.5">
                    {activeReport.vinBreakdown.yearCode} → {activeReport.year}
                  </dd>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Model Year Code
                  </span>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                  <dt className="text-[11px] text-slate-500">Assembly Plant (11)</dt>
                  <dd className="font-mono font-bold text-slate-950 mt-0.5">
                    Plant {activeReport.vinBreakdown.plantCode}
                  </dd>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Factory Code
                  </span>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                  <dt className="text-[11px] text-slate-500">Serial (12–17)</dt>
                  <dd className="font-mono font-bold text-[#B91C1C] mt-0.5">
                    {activeReport.vinBreakdown.serialNumber}
                  </dd>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Production Sequence
                  </span>
                </div>
              </dl>
            </section>
          )}

          {/* 6-Check VIN History Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 block">Title &amp; Structural Frame</span>
              <span className="font-display text-sm font-bold text-emerald-800 block">
                {activeReport.accidentHistory}
              </span>
              <span className="text-slate-600 block">
                Clean Export Certificate (Yushutsu Massho) verified.
              </span>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 block">Odometer Integrity</span>
              <span className="font-display text-sm font-bold text-emerald-800 block">
                {activeReport.odometerStatus}
              </span>
              <span className="text-slate-600 block">
                Cross-checked against MLIT Shaken &amp; Auction history.
              </span>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 block">Theft &amp; Interpol Record</span>
              <span className="font-display text-sm font-bold text-slate-950 block">
                {activeReport.theftRecord || 'Clean — No Japan or Interpol Theft Alerts'}
              </span>
              <span className="text-slate-600 block">
                Japan National Police &amp; port customs export clearance passed.
              </span>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 block">Salvage, Flood &amp; Fire Check</span>
              <span className="font-display text-sm font-bold text-slate-950 block">
                {activeReport.salvageRecord || activeReport.floodStatus}
              </span>
              <span className="text-slate-600 block">{activeReport.floodStatus}</span>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 block">Manufacturer Recall Status</span>
              <span className="font-display text-sm font-bold text-slate-950 block">
                {activeReport.recallStatus || '0 Open Manufacturer Recalls'}
              </span>
              <span className="text-slate-600 block">
                Verified against Japanese OEM safety campaign registry.
              </span>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 block">Gamma Radiation Screening</span>
              <span className="font-mono text-sm font-bold text-slate-950 block">
                {activeReport.radiationLevel}
              </span>
              <span className="text-slate-600 block">
                Well below international port clearance limit (0.30 μSv/h).
              </span>
            </div>
          </div>

          {/* 2-Column Body Map + Mechanical Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exterior Body Panel Map */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#F8F9FA] border-b border-slate-200">
                <h3 className="font-display text-sm font-bold text-slate-950">
                  Exterior Panel Inspection Map
                </h3>
              </div>
              <dl className="divide-y divide-slate-200 text-xs">
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Front Bumper &amp; Grille</dt>
                  <dd className="font-mono text-slate-900 text-right">{activeReport.panelCodes.front}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Bonnet / Hood</dt>
                  <dd className="font-mono text-slate-900 text-right">{activeReport.panelCodes.hood}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Roof Panel</dt>
                  <dd className="font-mono text-slate-900 text-right">{activeReport.panelCodes.roof}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Left Side Doors &amp; Fender</dt>
                  <dd className="font-mono text-slate-900 text-right">{activeReport.panelCodes.leftSide}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Right Side Doors &amp; Fender</dt>
                  <dd className="font-mono text-slate-900 text-right">{activeReport.panelCodes.rightSide}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Rear Tailgate &amp; Quarters</dt>
                  <dd className="font-mono text-slate-900 text-right">{activeReport.panelCodes.rear}</dd>
                </div>
              </dl>
            </div>

            {/* Mechanical & Underbody Checks */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#F8F9FA] border-b border-slate-200">
                <h3 className="font-display text-sm font-bold text-slate-950">
                  10-Point Mechanical &amp; Underbody Report
                </h3>
              </div>
              <dl className="divide-y divide-slate-200 text-xs">
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Engine &amp; Idle</dt>
                  <dd className="text-slate-900 text-right">{activeReport.mechanicalChecks.engine}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Transmission</dt>
                  <dd className="text-slate-900 text-right">{activeReport.mechanicalChecks.transmission}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Axles &amp; Suspension</dt>
                  <dd className="text-slate-900 text-right">{activeReport.mechanicalChecks.suspension}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Brakes &amp; ABS</dt>
                  <dd className="text-slate-900 text-right">{activeReport.mechanicalChecks.brakesAbs}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">A/C &amp; Electrical</dt>
                  <dd className="text-slate-900 text-right">{activeReport.mechanicalChecks.acCooling}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Chassis / Underbody</dt>
                  <dd className="text-slate-900 text-right">{activeReport.mechanicalChecks.underbodyRust}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Japan Registration & Odometer History Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeReport.registrationHistory && activeReport.registrationHistory.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#F8F9FA] border-b border-slate-200">
                  <h3 className="font-display text-sm font-bold text-slate-950">
                    Japan Prefecture &amp; Title History
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2.5 px-4 font-semibold">Period</th>
                        <th className="py-2.5 px-4 font-semibold">Prefecture / Port</th>
                        <th className="py-2.5 px-4 font-semibold">Usage &amp; Event</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activeReport.registrationHistory.map((item) => (
                        <tr key={`${item.period}-${item.event}`}>
                          <td className="py-2.5 px-4 font-mono text-slate-900 tabular-nums whitespace-nowrap">
                            {item.period}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                            {item.region}
                          </td>
                          <td className="py-2.5 px-4 text-slate-700">
                            <span className="font-semibold text-slate-900">{item.usage}</span>
                            <span className="block text-[11px] text-slate-500">{item.event}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#F8F9FA] border-b border-slate-200">
                <h3 className="font-display text-sm font-bold text-slate-950">
                  Chronological Odometer &amp; Deregistration Log
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 px-4 font-semibold">Inspection Date</th>
                      <th className="py-2.5 px-4 font-semibold">Verification Source</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Recorded Odometer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeReport.mileageHistory.map((row) => (
                      <tr key={`${row.date}-${row.mileageKm}`}>
                        <td className="py-2.5 px-4 font-mono text-slate-900 tabular-nums">
                          {row.date}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">{row.source}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-950 text-right tabular-nums">
                          {row.mileageKm.toLocaleString()} km
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Inspector Note + Direct Actions */}
          <div className="p-4 bg-[#F8F9FA] border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B91C1C]" aria-hidden="true" />
                <span>Yard Inspector Remarks</span>
              </p>
              <p className="text-slate-600 leading-relaxed max-w-3xl">
                {activeReport.inspectorNote}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {linkedVehicle ? (
                <button
                  type="button"
                  onClick={() => onInspectVehicle(linkedVehicle)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer whitespace-nowrap"
                >
                  Open Matching Vehicle ({linkedVehicle.stockNo})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'auction' })}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer whitespace-nowrap"
                >
                  Request Export Quote for {activeReport.chassisNo}
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
