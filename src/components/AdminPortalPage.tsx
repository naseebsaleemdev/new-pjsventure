import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Car,
  CheckCircle2,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  ImagePlus,
  Inbox,
  Lock,
  LogOut,
  Plus,
  PlusCircle,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  BlogCategory,
  BlogPost,
  BodyType,
  PortalQuery,
  QueryStatus,
  QueryType,
  StaffRole,
  StaffUser,
  SteeringSide,
  StockLocationType,
  Vehicle,
} from '../types/vehicle';

interface AdminPortalPageProps {
  initialTab?:
    | 'queries'
    | 'add-car'
    | 'inventory'
    | 'blog-posts'
    | 'users';
  vehicles: Vehicle[];
  queries: PortalQuery[];
  blogPosts: BlogPost[];
  onAddVehicle: (vehicle: Vehicle) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onBulkDeleteVehicles: (vehicleIds: string[]) => void;
  onClearAllVehicles: () => void;
  onUpdateQueryStatus: (queryId: string, status: QueryStatus, adminNote?: string) => void;
  onDeleteQuery: (queryId: string) => void;
  onClearAllQueries: () => void;
  onAddBlogPost: (post: BlogPost) => void;
  onUpdateBlogPost: (post: BlogPost) => void;
  onDeleteBlogPost: (postId: string) => void;
  onClearAllBlogPosts: () => void;
  onViewBlogPost: (post: BlogPost) => void;
  onViewVehiclePage: (vehicle: Vehicle) => void;
  onBackToStorefront: () => void;
}

const DEFAULT_FALLBACK_VEHICLE_IMAGE =
  '/src/assets/images/car_land_cruiser_prado_1795543166418.jpg';

export function AdminPortalPage({
  initialTab = 'queries',
  vehicles,
  queries,
  blogPosts,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onBulkDeleteVehicles,
  onClearAllVehicles,
  onUpdateQueryStatus,
  onDeleteQuery,
  onClearAllQueries,
  onAddBlogPost,
  onUpdateBlogPost,
  onDeleteBlogPost,
  onClearAllBlogPosts,
  onViewBlogPost,
  onViewVehiclePage,
  onBackToStorefront,
}: AdminPortalPageProps) {
  const [activeTab, setActiveTab] = useState<
    'queries' | 'add-car' | 'inventory' | 'blog-posts' | 'users'
  >(initialTab);

  // Staff Authentication & User Details State (Bearer token held strictly in React memory)
  const [authLoading, setAuthLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<{
    initialized: boolean;
    envPasscodeActive: boolean;
  }>({ initialized: false, envPasscodeActive: false });
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Login / First-Run Claim Form State
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginDesk, setLoginDesk] = useState('Yokohama HQ');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginConfirmPassword, setLoginConfirmPassword] = useState('');

  // Staff Users Directory & Add New Staff User State
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<StaffRole>('Export Coordinator');
  const [newUserDesk, setNewUserDesk] = useState('Yokohama Export Yard');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userNotice, setUserNotice] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);

  // Inventory Stock Filter (Japan Yard vs Port Balance)
  const [invLocationFilter, setInvLocationFilter] = useState<
    'all' | 'japan-yard' | 'port-balance'
  >('all');

  // WordPress-Style Blog CMS State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [blogCategory, setBlogCategory] = useState<BlogCategory>('Buying Guides');
  const [blogAuthor, setBlogAuthor] = useState('Pjs Venture Export Desk · Yokohama');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState(
    '## Export Key Points\n\nWrite your detailed export guide here.\n\n- Verified auction sheet & MLIT odometer check\n- Direct Ro-Ro or 20ft container booking from Yokohama'
  );
  const [blogCoverImage, setBlogCoverImage] = useState(
    '/src/assets/images/hero_yokohama_port_1795543166709.jpg'
  );
  const [blogCoverUrlInput, setBlogCoverUrlInput] = useState('');
  const [blogTagsText, setBlogTagsText] = useState('Japan Export, Port Balance, VIN Check');
  const [blogStatus, setBlogStatus] = useState<'Published' | 'Draft'>('Published');
  const [blogReadMinutes, setBlogReadMinutes] = useState(4);
  const [blogNotice, setBlogNotice] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState('');

  // Queries Inbox State
  const [queryFilterType, setQueryFilterType] = useState<'All' | QueryType>('All');
  const [queryFilterStatus, setQueryFilterStatus] = useState<'All' | QueryStatus>('All');
  const [querySearch, setQuerySearch] = useState('');
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(
    queries[0]?.id ?? null
  );
  const [noteDraft, setNoteDraft] = useState('');

  // Inventory Search State
  const [invSearch, setInvSearch] = useState('');

  // Add Car Form State
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [stockNo, setStockNo] = useState(`PJV-${84500 + vehicles.length}`);
  const [year, setYear] = useState(2022);
  const [month, setMonth] = useState(5);
  const [bodyType, setBodyType] = useState<Exclude<BodyType, 'All'>>('SUV');
  const [chassisCode, setChassisCode] = useState('');
  const [engineCc, setEngineCc] = useState(1998);
  const [fuel, setFuel] = useState<Vehicle['fuel']>('Gasoline');
  const [transmission, setTransmission] = useState<Vehicle['transmission']>('Automatic');
  const [drive, setDrive] = useState<Vehicle['drive']>('4WD');
  const [steering, setSteering] = useState<SteeringSide>('RHD');
  const [mileageKm, setMileageKm] = useState(28000);
  const [color, setColor] = useState('Pearl White (070)');
  const [seats, setSeats] = useState(5);
  const [doors, setDoors] = useState(5);
  const [auctionGrade, setAuctionGrade] = useState('4.5');
  const [exteriorGrade, setExteriorGrade] = useState('A');
  const [interiorGrade, setInteriorGrade] = useState('A');
  const [yardPort, setYardPort] = useState<Vehicle['yardPort']>('Yokohama');
  const [inspectionAgency, setInspectionAgency] = useState<Vehicle['inspectionAgency']>('JEVIC');
  const [fobUsd, setFobUsd] = useState(21500);
  const [m3Volume, setM3Volume] = useState(14.5);
  const [stockLocation, setStockLocation] = useState<StockLocationType>('Japan Yard');
  const [yardAvailability, setYardAvailability] = useState<'Ready to Ship' | 'New Arrival'>('New Arrival');
  const [portBalancePort, setPortBalancePort] = useState('Mombasa');
  const [depositUsd, setDepositUsd] = useState(5000);
  const [portBalanceUsd, setPortBalanceUsd] = useState(18500);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [featuresText, setFeaturesText] = useState(
    'Toyota Safety Sense, Reverse Camera, Smart Key, Alloy Wheels'
  );
  const [inspectorNote, setInspectorNote] = useState(
    'Verified auction sheet and clean undercarriage. Ready for Ro-Ro or container loading.'
  );
  const [addedBanner, setAddedBanner] = useState<Vehicle | null>(null);
  const [saveToast, setSaveToast] = useState<Vehicle | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [confirmClearStock, setConfirmClearStock] = useState(false);
  const [confirmClearQueries, setConfirmClearQueries] = useState(false);
  const [confirmClearBlogs, setConfirmClearBlogs] = useState(false);

  useEffect(() => {
    if (!saveToast) return;
    const timer = window.setTimeout(() => setSaveToast(null), 8000);
    return () => window.clearTimeout(timer);
  }, [saveToast]);

  useEffect(() => {
    if (!actionToast) return;
    const timer = window.setTimeout(() => setActionToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [actionToast]);

  const filteredQueries = queries.filter((q) => {
    if (queryFilterType !== 'All' && q.type !== queryFilterType) return false;
    if (queryFilterStatus !== 'All' && q.status !== queryFilterStatus) return false;
    if (querySearch.trim()) {
      const s = querySearch.toLowerCase();
      const hay = `${q.referenceId} ${q.buyerName} ${q.companyName} ${q.email} ${q.subject} ${q.destinationPort}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });

  const selectedQuery =
    filteredQueries.find((q) => q.id === selectedQueryId) ||
    queries.find((q) => q.id === selectedQueryId) ||
    filteredQueries[0] ||
    null;

  const safeJson = async (res: Response) => {
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null;
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/auth-status');
        const data = await safeJson(res);
        if (res.ok && data && !cancelled) {
          setAuthStatus({
            initialized: Boolean(data.initialized),
            envPasscodeActive: Boolean(data.envPasscodeActive),
          });
        }
      } catch {
        // Ignore network error during initial status probe
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadStaffUsers = async (token: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeJson(res);
      if (res.ok && data && Array.isArray(data.users)) {
        setStaffUsers(data.users);
      }
    } catch {
      // Ignore fetch failure
    }
  };

  useEffect(() => {
    if (authToken) {
      loadStaffUsers(authToken);
    }
  }, [authToken]);

  const handleFirstRunClaim = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (loginPassword !== loginConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: loginName,
          email: loginEmail,
          portDesk: loginDesk,
          password: loginPassword,
        }),
      });
      const data = await safeJson(res);
      if (!res.ok || !data?.token) {
        setAuthError(
          data?.error ||
            `Staff API error (HTTP ${res.status}). Please redeploy and retry.`
        );
        return;
      }
      setAuthToken(data.token);
      setCurrentUser(data.user);
      setAuthStatus((prev) => ({ ...prev, initialized: true }));
      setLoginPassword('');
      setLoginConfirmPassword('');
    } catch {
      setAuthError('Network error while creating admin account.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleStaffLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const data = await safeJson(res);
      if (!res.ok || !data?.token) {
        setAuthError(
          data?.error ||
            'Invalid credentials or staff API endpoint unavailable.'
        );
        return;
      }
      setAuthToken(data.token);
      setCurrentUser(data.user);
      setLoginPassword('');
    } catch {
      setAuthError('Network error while signing in.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (authToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch {
        // Ignore logout failure
      }
    }
    setAuthToken(null);
    setCurrentUser(null);
    setStaffUsers([]);
  };

  const handleCreateStaffUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setUserError(null);
    setUserNotice(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          fullName: newUserName,
          email: newUserEmail,
          role: newUserRole,
          portDesk: newUserDesk,
          password: newUserPassword,
        }),
      });
      const data = await safeJson(res);
      if (!res.ok || !data?.user) {
        setUserError(data?.error || 'Failed to add staff user.');
        return;
      }
      setStaffUsers((prev) => [data.user, ...prev]);
      setUserNotice(`Created staff user account for ${data.user.fullName} (${data.user.email}).`);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
    } catch {
      setUserError('Network error while creating staff user.');
    }
  };

  const handleToggleUserActive = async (target: StaffUser) => {
    if (!authToken) return;
    setUserError(null);
    try {
      const res = await fetch(`/api/admin/users/${target.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ active: !target.active }),
      });
      const data = await safeJson(res);
      if (res.ok && data?.user) {
        setStaffUsers((prev) =>
          prev.map((u) => (u.id === data.user.id ? data.user : u))
        );
      } else {
        setUserError(data?.error || 'Could not update user status.');
      }
    } catch {
      setUserError('Network error while updating user.');
    }
  };

  const handleDeleteStaffUser = async (userId: string) => {
    if (!authToken) return;
    setUserError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await safeJson(res);
      if (res.ok) {
        setStaffUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        setUserError(data?.error || 'Could not delete user.');
      }
    } catch {
      setUserError('Network error while deleting user.');
    }
  };

  const filteredInventory = vehicles.filter((v) => {
    const isPb =
      v.availability === 'Port Balance' ||
      (v.stockLocation !== undefined && v.stockLocation !== 'Japan Yard');
    if (invLocationFilter === 'port-balance' && !isPb) return false;
    if (invLocationFilter === 'japan-yard' && isPb) return false;
    if (!invSearch.trim()) return true;
    const s = invSearch.toLowerCase();
    return `${v.stockNo} ${v.make} ${v.model} ${v.chassisCode} ${v.yardPort} ${v.portBalancePort || ''}`
      .toLowerCase()
      .includes(s);
  });

  const handleImageFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          setGalleryImages((prev) => [...prev, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setGalleryImages((prev) => [...prev, trimmed]);
    setUrlInput('');
  };

  const handleSetCover = (idx: number) => {
    setGalleryImages((prev) => {
      if (idx <= 0 || idx >= prev.length) return prev;
      const picked = prev[idx];
      return [picked, ...prev.filter((_, i) => i !== idx)];
    });
  };

  const handleRemoveImage = (idx: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCopyAdminUrl = () => {
    const fullUrl = `${window.location.origin}/staff-portal`;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const toSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleBlogTitleChange = (val: string) => {
    setBlogTitle(val);
    if (!slugManual) {
      setBlogSlug(toSlug(val));
    }
  };

  const handleBlogCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBlogCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const appendBlogBlock = (snippet: string) => {
    setBlogContent((prev) => `${prev.trimEnd()}\n\n${snippet}`);
  };

  const resetBlogEditor = () => {
    setEditingPostId(null);
    setBlogTitle('');
    setBlogSlug('');
    setSlugManual(false);
    setBlogCategory('Buying Guides');
    setBlogAuthor('Pjs Venture Export Desk · Yokohama');
    setBlogExcerpt('');
    setBlogContent(
      '## Export Key Points\n\nWrite your detailed export guide here.\n\n- Verified auction sheet & MLIT odometer check\n- Direct Ro-Ro or 20ft container booking from Yokohama'
    );
    setBlogCoverImage('/src/assets/images/hero_yokohama_port_1795543166709.jpg');
    setBlogCoverUrlInput('');
    setBlogTagsText('Japan Export, Port Balance, VIN Check');
    setBlogStatus('Published');
    setBlogReadMinutes(4);
  };

  const startEditBlogPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setBlogTitle(post.title);
    setBlogSlug(post.slug);
    setSlugManual(true);
    setBlogCategory(post.category);
    setBlogAuthor(post.author);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content);
    setBlogCoverImage(post.coverImage);
    setBlogTagsText(post.tags.join(', '));
    setBlogStatus(post.status);
    setBlogReadMinutes(post.readMinutes);
    setBlogNotice(null);
  };

  const handleBlogSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) return;
    const computedSlug = toSlug(blogSlug || blogTitle) || `post-${Date.now()}`;
    const cleanExcerpt =
      blogExcerpt.trim() ||
      blogContent
        .replace(/^##\s+/gm, '')
        .replace(/^>\s+/gm, '')
        .replace(/^-\s+/gm, '')
        .slice(0, 155)
        .trim() + '...';

    const payload: BlogPost = {
      id: editingPostId || `blog-${Date.now()}`,
      slug: computedSlug,
      title: blogTitle.trim(),
      excerpt: cleanExcerpt,
      content: blogContent.trim(),
      category: blogCategory,
      author: blogAuthor.trim() || 'Pjs Venture Export Desk',
      coverImage: blogCoverImage || '/src/assets/images/hero_yokohama_port_1795543166709.jpg',
      tags: blogTagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      status: blogStatus,
      publishedAt: new Date().toISOString().slice(0, 10),
      readMinutes: Math.max(1, Number(blogReadMinutes) || 4),
    };

    if (editingPostId) {
      onUpdateBlogPost(payload);
      setBlogNotice(`Updated article "${payload.title}" (${payload.status}).`);
    } else {
      onAddBlogPost(payload);
      setBlogNotice(`Published article "${payload.title}" at /blog/${payload.slug}.`);
    }
    resetBlogEditor();
  };

  const filteredBlogPosts = blogPosts.filter((p) => {
    if (!blogSearch.trim()) return true;
    const s = blogSearch.toLowerCase();
    return `${p.title} ${p.slug} ${p.category} ${p.author}`.toLowerCase().includes(s);
  });

  const handleAddCarSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim() || !chassisCode.trim()) return;

    const finalGallery =
      galleryImages.length > 0 ? galleryImages : [DEFAULT_FALLBACK_VEHICLE_IMAGE];

    const newVehicle: Vehicle = {
      id: `pjv-${make.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}`,
      stockNo: stockNo.trim() || `PJV-${84500 + vehicles.length + 1}`,
      make: make.trim(),
      model: model.trim(),
      trim: trim.trim() || 'Standard Export Package',
      year: Number(year),
      month: Number(month),
      bodyType,
      chassisCode: chassisCode.trim().toUpperCase(),
      engineCc: Number(engineCc),
      fuel,
      transmission,
      drive,
      steering,
      mileageKm: Number(mileageKm),
      color: color.trim() || 'Metallic Silver',
      seats: Number(seats),
      doors: Number(doors),
      auctionGrade,
      exteriorGrade,
      interiorGrade,
      yardPort,
      stockLocation,
      ...(stockLocation !== 'Japan Yard'
        ? {
            portBalancePort: portBalancePort.trim() || 'Mombasa',
            depositUsd: Number(depositUsd),
            portBalanceUsd: Number(portBalanceUsd),
          }
        : {}),
      fobUsd: Number(fobUsd),
      m3Volume: Number(m3Volume),
      imageUrl: finalGallery[0],
      galleryImages: finalGallery,
      inspectionAgency,
      features: featuresText
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      inspectorNote: inspectorNote.trim(),
      availability: stockLocation === 'Japan Yard' ? yardAvailability : 'Port Balance',
    };

    onAddVehicle(newVehicle);
    setAddedBanner(newVehicle);
    setSaveToast(newVehicle);
    setModel('');
    setTrim('');
    setChassisCode('');
    setGalleryImages([]);
    setStockNo(`PJV-${84500 + vehicles.length + 2}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statusTextColor = (status: QueryStatus) => {
    switch (status) {
      case 'New':
        return 'text-[#B91C1C] font-semibold';
      case 'Proforma Sent':
        return 'text-amber-700 font-semibold';
      case 'Completed':
        return 'text-emerald-700 font-semibold';
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-sm text-slate-600">
          Verifying staff session...
        </div>
      </div>
    );
  }

  if (!authToken || !currentUser) {
    const isFirstRunSetup = !authStatus.initialized && !authStatus.envPasscodeActive;
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[#0F172A] text-white px-6 py-5 flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#B91C1C] shrink-0" aria-hidden="true" />
            <div>
              <p className="font-mono text-[11px] text-slate-300">
                Pjs Venture Staff Portal · /staff-portal
              </p>
              <h1 className="font-display text-lg font-bold">
                {isFirstRunSetup
                  ? 'Initial Admin Account Setup'
                  : 'Staff Portal Sign In'}
              </h1>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {isFirstRunSetup
                ? 'Set up your primary Super Admin user details to secure this operations portal. Once saved, you can add additional staff accounts inside User Details.'
                : 'Sign in with your Pjs Venture staff email and password to manage vehicles, inquiries, VIN reports, blog posts, and staff accounts.'}
            </p>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-[#B91C1C]">
                {authError}
              </div>
            )}

            {isFirstRunSetup ? (
              <form onSubmit={handleFirstRunClaim} className="space-y-3.5 text-xs">
                <div>
                  <label htmlFor="setup-name" className="block font-semibold text-slate-700 mb-1">
                    Admin Full Name *
                  </label>
                  <input
                    id="setup-name"
                    type="text"
                    required
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="e.g. Tariq Mahmood"
                    className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="setup-email" className="block font-semibold text-slate-700 mb-1">
                      Admin Email *
                    </label>
                    <input
                      id="setup-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@pjsventure.jp"
                      className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="setup-desk" className="block font-semibold text-slate-700 mb-1">
                      Office / Port Desk
                    </label>
                    <input
                      id="setup-desk"
                      type="text"
                      value={loginDesk}
                      onChange={(e) => setLoginDesk(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="setup-pass" className="block font-semibold text-slate-700 mb-1">
                      Password (6+ chars) *
                    </label>
                    <input
                      id="setup-pass"
                      type="password"
                      required
                      minLength={6}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="setup-confirm" className="block font-semibold text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      id="setup-confirm"
                      type="password"
                      required
                      minLength={6}
                      value={loginConfirmPassword}
                      onChange={(e) => setLoginConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onBackToStorefront}
                    className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Back to Storefront
                  </button>
                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="px-5 py-2.5 font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer disabled:opacity-60"
                  >
                    {authSubmitting ? 'Creating Account...' : 'Create Admin Account & Enter'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleStaffLogin} className="space-y-3.5 text-xs">
                <div>
                  <label htmlFor="login-email" className="block font-semibold text-slate-700 mb-1">
                    Staff Email *
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required={!authStatus.envPasscodeActive}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="staff@pjsventure.jp"
                    className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="login-pass" className="block font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    id="login-pass"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="pt-1 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onBackToStorefront}
                    className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Back to Storefront
                  </button>
                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="px-5 py-2.5 font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer disabled:opacity-60"
                  >
                    {authSubmitting ? 'Signing In...' : 'Sign In to Staff Portal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      {/* Floating Save Notification Toast */}
      {saveToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 max-w-sm w-full bg-[#0F172A] text-white border border-emerald-500/60 rounded-xl shadow-xl p-4 flex items-start gap-3"
        >
          <CheckCircle2
            className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0 text-xs space-y-1">
            <p className="font-mono font-bold text-emerald-300 uppercase tracking-wide">
              Car Saved &amp; Published
            </p>
            <p className="font-semibold text-white truncate">
              {saveToast.year} {saveToast.make} {saveToast.model}
            </p>
            <p className="text-slate-300 font-mono text-[11px]">
              {saveToast.stockNo} ·{' '}
              {saveToast.availability === 'Port Balance'
                ? 'Port Balance (/port-balance)'
                : 'Japan Yard (/used-cars)'}
            </p>
            <div className="pt-1.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewVehiclePage(saveToast)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer"
              >
                Open Car Page
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('inventory');
                  setSaveToast(null);
                }}
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
              >
                Manage Stock
              </button>
            </div>
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setSaveToast(null)}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Generic Action Notification Toast */}
      {actionToast && !saveToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 max-w-sm w-full bg-[#0F172A] text-white border border-slate-700 rounded-xl shadow-xl p-4 flex items-center gap-3 text-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span className="flex-1 font-medium">{actionToast}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setActionToast(null)}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Breadcrumb & Top Bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-xs text-slate-500">
            Private Staff URL: <strong className="text-slate-800">/staff-portal</strong> ·{' '}
            {activeTab === 'queries'
              ? 'Form Queries Inbox'
              : activeTab === 'add-car'
                ? 'Add New Vehicle'
                : activeTab === 'inventory'
                  ? 'Manage Stock'
                  : activeTab === 'blog-posts'
                    ? 'WordPress-Style Blog Manager'
                    : 'Staff User Details'}
          </p>
          <h1 className="font-display text-xl font-bold text-slate-950 mt-0.5">
            Pjs Venture Export Operations Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Signed in as <strong className="text-slate-800">{currentUser.fullName}</strong> ({currentUser.role} · {currentUser.portDesk})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyAdminUrl}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-[#F8F9FA] border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{copiedUrl ? 'Copied /staff-portal' : 'Copy Portal URL'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('add-car')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Car to Stock</span>
          </button>
          <button
            type="button"
            onClick={onBackToStorefront}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            View Live Storefront
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Workspace Split: Sidebar Navigation (240px) + Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <aside className="w-full lg:w-60 shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#0F172A] text-white">
            <p className="font-display text-xs font-bold">Admin Workspace</p>
          </div>
          <nav className="p-2 space-y-1 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab('queries')}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                activeTab === 'queries'
                  ? 'bg-red-50 text-[#B91C1C] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Inbox className="w-4 h-4" aria-hidden="true" />
                <span>Form Queries</span>
              </span>
              <span className="font-mono text-xs tabular-nums">
                {queries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('add-car')}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                activeTab === 'add-car'
                  ? 'bg-red-50 text-[#B91C1C] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" aria-hidden="true" />
                <span>Add New Car</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-red-50 text-[#B91C1C] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Car className="w-4 h-4" aria-hidden="true" />
                <span>Manage Stock</span>
              </span>
              <span className="font-mono text-xs tabular-nums">
                {vehicles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('blog-posts')}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                activeTab === 'blog-posts'
                  ? 'bg-red-50 text-[#B91C1C] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Blog Posts</span>
              </span>
              <span className="font-mono text-xs tabular-nums">
                {blogPosts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-red-50 text-[#B91C1C] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" aria-hidden="true" />
                <span>User Details</span>
              </span>
              <span className="font-mono text-xs tabular-nums">
                {staffUsers.length || 1}
              </span>
            </button>
          </nav>

          {/* Compact Operational Summary */}
          <div className="p-4 border-t border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">New Queries</span>
              <span className="font-mono font-bold text-[#B91C1C] tabular-nums">
                {queries.filter((q) => q.status === 'New').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Proforma Sent</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {queries.filter((q) => q.status === 'Proforma Sent').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active Yard Units</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {vehicles.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Published Blogs</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {blogPosts.filter((b) => b.status === 'Published').length}
              </span>
            </div>
          </div>
        </aside>

        {/* Main Workspace Panel */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* TAB 1: FORM QUERIES INBOX */}
          {activeTab === 'queries' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={querySearch}
                    onChange={(e) => setQuerySearch(e.target.value)}
                    placeholder="Search reference ID, buyer name, email, or port..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Filter by query type"
                    value={queryFilterType}
                    onChange={(e) =>
                      setQueryFilterType(e.target.value as 'All' | QueryType)
                    }
                    className="px-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  >
                    <option value="All">All Query Types</option>
                    <option value="Vehicle Inquiry">Vehicle Inquiry</option>
                    <option value="Proforma Cart">Proforma Cart</option>
                    <option value="Auction Request">Auction Request</option>
                    <option value="General Contact">General Contact</option>
                  </select>

                  <select
                    aria-label="Filter by status"
                    value={queryFilterStatus}
                    onChange={(e) =>
                      setQueryFilterStatus(e.target.value as 'All' | QueryStatus)
                    }
                    className="px-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Proforma Sent">Proforma Sent</option>
                    <option value="Completed">Completed</option>
                  </select>

                  {queries.length > 0 && (
                    confirmClearQueries ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const count = queries.length;
                            onClearAllQueries();
                            setSelectedQueryId(null);
                            setConfirmClearQueries(false);
                            setActionToast(`Removed all ${count} form queries.`);
                          }}
                          className="px-3 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
                        >
                          Confirm Clear All ({queries.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmClearQueries(false)}
                          className="px-2.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmClearQueries(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#B91C1C] bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Clear All Queries</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                {/* High-Density Queries Table */}
                <div className="xl:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
                  {filteredQueries.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="font-display text-sm font-bold text-slate-900">
                        No matching form queries
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Submissions from vehicle single pages, proforma cart, auction orders, and contact forms appear here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#F8F9FA] border-b border-slate-200 text-slate-600">
                            <th className="py-3 px-4 font-semibold">Ref / Type</th>
                            <th className="py-3 px-4 font-semibold">Buyer</th>
                            <th className="py-3 px-4 font-semibold">Subject / Port</th>
                            <th className="py-3 px-4 font-semibold text-right">Status</th>
                            <th className="py-3 px-4 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredQueries.map((q) => {
                            const active = selectedQuery?.id === q.id;
                            return (
                              <tr
                                key={q.id}
                                onClick={() => {
                                  setSelectedQueryId(q.id);
                                  setNoteDraft(q.adminNote || '');
                                }}
                                className={`cursor-pointer transition-colors ${
                                  active ? 'bg-red-50/60' : 'hover:bg-slate-50'
                                }`}
                              >
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <span className="block font-mono font-semibold text-slate-950">
                                    {q.referenceId}
                                  </span>
                                  <span className="text-[11px] text-slate-500">
                                    {q.type}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="block font-semibold text-slate-900">
                                    {q.buyerName}
                                  </span>
                                  <span className="text-[11px] text-slate-500 truncate block max-w-[140px]">
                                    {q.companyName}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="block text-slate-800 font-medium truncate max-w-[170px]">
                                    {q.subject}
                                  </span>
                                  <span className="text-[11px] text-slate-500">
                                    {q.destinationPort}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <span className={statusTextColor(q.status)}>
                                    {q.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteQuery(q.id);
                                      setActionToast(`Deleted query ${q.referenceId}.`);
                                    }}
                                    aria-label={`Delete query ${q.referenceId}`}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-[#B91C1C] bg-red-50 hover:bg-red-100 rounded cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" aria-hidden="true" />
                                    <span>Delete</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Query Detail & Status Management Panel */}
                <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
                  {selectedQuery ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                        <div>
                          <p className="font-mono text-xs text-slate-500">
                            {selectedQuery.referenceId} · {selectedQuery.type} · {selectedQuery.createdAt}
                          </p>
                          <h2 className="font-display text-base font-bold text-slate-950 mt-1">
                            {selectedQuery.subject}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const ref = selectedQuery.referenceId;
                            onDeleteQuery(selectedQuery.id);
                            setActionToast(`Deleted query ${ref}.`);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-[#B91C1C] bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <dl className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <dt className="text-slate-500">Buyer Name</dt>
                          <dd className="font-semibold text-slate-900 mt-0.5">
                            {selectedQuery.buyerName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Company</dt>
                          <dd className="font-medium text-slate-900 mt-0.5">
                            {selectedQuery.companyName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Email</dt>
                          <dd className="font-mono text-slate-900 mt-0.5 break-all">
                            {selectedQuery.email}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">WhatsApp / Phone</dt>
                          <dd className="font-mono text-slate-900 mt-0.5">
                            {selectedQuery.phoneWhatsApp}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Destination Port</dt>
                          <dd className="font-medium text-slate-900 mt-0.5">
                            {selectedQuery.destinationPort}
                          </dd>
                        </div>
                        {selectedQuery.estimatedCifUsd && (
                          <div>
                            <dt className="text-slate-500">Est. Total CIF</dt>
                            <dd className="font-mono font-bold text-[#B91C1C] mt-0.5 tabular-nums">
                              ${selectedQuery.estimatedCifUsd.toLocaleString()}
                            </dd>
                          </div>
                        )}
                      </dl>

                      <div className="p-3.5 bg-[#F8F9FA] border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                        <span className="block font-semibold text-slate-900 mb-1">
                          Buyer Notes / Request
                        </span>
                        {selectedQuery.notes}
                      </div>

                      <div className="pt-2 border-t border-slate-200 space-y-3">
                        <div>
                          <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Update Dispatch Status
                          </span>
                          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
                            {(['New', 'Proforma Sent', 'Completed'] as QueryStatus[]).map(
                              (st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() =>
                                    onUpdateQueryStatus(selectedQuery.id, st, noteDraft)
                                  }
                                  className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                    selectedQuery.status === st
                                      ? 'bg-white text-slate-950 shadow-sm'
                                      : 'text-slate-600 hover:text-slate-950'
                                  }`}
                                >
                                  {st}
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="admin-dispatch-note"
                            className="block text-xs font-semibold text-slate-700 mb-1"
                          >
                            Internal Dispatch Note
                          </label>
                          <div className="flex gap-2">
                            <input
                              id="admin-dispatch-note"
                              type="text"
                              value={noteDraft || selectedQuery.adminNote || ''}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder="e.g. Sent Proforma & MUFG TT details..."
                              className="flex-1 px-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQueryStatus(
                                  selectedQuery.id,
                                  selectedQuery.status,
                                  noteDraft
                                )
                              }
                              className="px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-8 text-center">
                      Select a query row to inspect buyer details and update dispatch status.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD NEW CAR */}
          {activeTab === 'add-car' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Add New Vehicle to Export Inventory
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Published vehicles appear immediately in the Used Cars catalog, sidebar counts, and receive a dedicated single car page.
                </p>
              </div>

              {addedBanner && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-mono text-xs font-semibold text-emerald-800">
                        {addedBanner.stockNo} — Saved &amp; Published to{' '}
                        {addedBanner.availability === 'Port Balance'
                          ? 'Port Balance Inventory'
                          : 'Live Japan Yard Stock'}
                      </p>
                      <p className="text-sm font-bold text-slate-950">
                        {addedBanner.year} {addedBanner.make} {addedBanner.model} ({addedBanner.trim})
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewVehiclePage(addedBanner)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      <span>Open Vehicle Single Page</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('inventory')}
                      className="px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
                    >
                      View in Manage Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddedBanner(null)}
                      className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-900 underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleAddCarSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="add-make" className="block text-xs font-semibold text-slate-700 mb-1">
                    Make *
                  </label>
                  <input
                    id="add-make"
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="Toyota"
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-model" className="block text-xs font-semibold text-slate-700 mb-1">
                    Model *
                  </label>
                  <input
                    id="add-model"
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. RAV4 Adventure"
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-trim" className="block text-xs font-semibold text-slate-700 mb-1">
                    Trim / Package
                  </label>
                  <input
                    id="add-trim"
                    type="text"
                    value={trim}
                    onChange={(e) => setTrim(e.target.value)}
                    placeholder="e.g. Hybrid G Z-Package"
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-stock" className="block text-xs font-semibold text-slate-700 mb-1">
                    Stock Number
                  </label>
                  <input
                    id="add-stock"
                    type="text"
                    value={stockNo}
                    onChange={(e) => setStockNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-chassis" className="block text-xs font-semibold text-slate-700 mb-1">
                    Chassis Code *
                  </label>
                  <input
                    id="add-chassis"
                    type="text"
                    required
                    value={chassisCode}
                    onChange={(e) => setChassisCode(e.target.value)}
                    placeholder="e.g. AXAH54-0192831"
                    className="w-full px-3 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-body" className="block text-xs font-semibold text-slate-700 mb-1">
                    Body Type
                  </label>
                  <select
                    id="add-body"
                    value={bodyType}
                    onChange={(e) =>
                      setBodyType(e.target.value as Exclude<BodyType, 'All'>)
                    }
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Van / Mini Van">Van / Mini Van</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="add-year" className="block text-xs font-semibold text-slate-700 mb-1">
                    Year
                  </label>
                  <input
                    id="add-year"
                    type="number"
                    min={1995}
                    max={2027}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-month" className="block text-xs font-semibold text-slate-700 mb-1">
                    Reg. Month
                  </label>
                  <input
                    id="add-month"
                    type="number"
                    min={1}
                    max={12}
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-mileage" className="block text-xs font-semibold text-slate-700 mb-1">
                    Mileage (km)
                  </label>
                  <input
                    id="add-mileage"
                    type="number"
                    min={0}
                    value={mileageKm}
                    onChange={(e) => setMileageKm(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-engine" className="block text-xs font-semibold text-slate-700 mb-1">
                    Engine (cc)
                  </label>
                  <input
                    id="add-engine"
                    type="number"
                    min={600}
                    value={engineCc}
                    onChange={(e) => setEngineCc(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-fuel" className="block text-xs font-semibold text-slate-700 mb-1">
                    Fuel
                  </label>
                  <select
                    id="add-fuel"
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value as Vehicle['fuel'])}
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="add-trans" className="block text-xs font-semibold text-slate-700 mb-1">
                    Transmission
                  </label>
                  <select
                    id="add-trans"
                    value={transmission}
                    onChange={(e) =>
                      setTransmission(e.target.value as Vehicle['transmission'])
                    }
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="add-drive" className="block text-xs font-semibold text-slate-700 mb-1">
                    Drivetrain
                  </label>
                  <select
                    id="add-drive"
                    value={drive}
                    onChange={(e) => setDrive(e.target.value as Vehicle['drive'])}
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  >
                    <option value="4WD">4WD</option>
                    <option value="AWD">AWD</option>
                    <option value="2WD">2WD</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="add-steering" className="block text-xs font-semibold text-slate-700 mb-1">
                    Steering
                  </label>
                  <select
                    id="add-steering"
                    value={steering}
                    onChange={(e) => setSteering(e.target.value as SteeringSide)}
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  >
                    <option value="RHD">RHD (Right-Hand Drive)</option>
                    <option value="LHD">LHD (Left-Hand Drive)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="add-fob" className="block text-xs font-semibold text-slate-700 mb-1">
                    FOB Price (USD) *
                  </label>
                  <input
                    id="add-fob"
                    type="number"
                    required
                    min={1000}
                    value={fobUsd}
                    onChange={(e) => setFobUsd(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-yard" className="block text-xs font-semibold text-slate-700 mb-1">
                    Japan Departure Yard
                  </label>
                  <select
                    id="add-yard"
                    value={yardPort}
                    onChange={(e) =>
                      setYardPort(e.target.value as Vehicle['yardPort'])
                    }
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  >
                    <option value="Yokohama">Yokohama</option>
                    <option value="Nagoya">Nagoya</option>
                    <option value="Kobe">Kobe</option>
                    <option value="Hakata">Hakata</option>
                    <option value="Osaka">Osaka</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="add-grade" className="block text-xs font-semibold text-slate-700 mb-1">
                    Auction Grade
                  </label>
                  <select
                    id="add-grade"
                    value={auctionGrade}
                    onChange={(e) => setAuctionGrade(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  >
                    <option value="5.0">5.0</option>
                    <option value="4.5">4.5</option>
                    <option value="4.0">4.0</option>
                    <option value="3.5">3.5</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="add-m3" className="block text-xs font-semibold text-slate-700 mb-1">
                    Volume (m³)
                  </label>
                  <input
                    id="add-m3"
                    type="number"
                    step="0.1"
                    min={6}
                    value={m3Volume}
                    onChange={(e) => setM3Volume(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-color" className="block text-xs font-semibold text-slate-700 mb-1">
                    Exterior Color
                  </label>
                  <input
                    id="add-color"
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="add-agency" className="block text-xs font-semibold text-slate-700 mb-1">
                    Inspection Agency
                  </label>
                  <select
                    id="add-agency"
                    value={inspectionAgency}
                    onChange={(e) =>
                      setInspectionAgency(e.target.value as Vehicle['inspectionAgency'])
                    }
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  >
                    <option value="JEVIC">JEVIC</option>
                    <option value="JAAI">JAAI</option>
                    <option value="QISJ">QISJ</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label htmlFor="add-ext" className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Ext
                    </label>
                    <input
                      id="add-ext"
                      type="text"
                      value={exteriorGrade}
                      onChange={(e) => setExteriorGrade(e.target.value)}
                      className="w-full px-2 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="add-int" className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Int
                    </label>
                    <input
                      id="add-int"
                      type="text"
                      value={interiorGrade}
                      onChange={(e) => setInteriorGrade(e.target.value)}
                      className="w-full px-2 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="add-seats" className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Seats
                    </label>
                    <input
                      id="add-seats"
                      type="number"
                      value={seats}
                      onChange={(e) => setSeats(Number(e.target.value))}
                      className="w-full px-2 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="add-doors" className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Doors
                    </label>
                    <input
                      id="add-doors"
                      type="number"
                      value={doors}
                      onChange={(e) => setDoors(Number(e.target.value))}
                      className="w-full px-2 py-2 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Stock Type & Port Balance Configuration */}
                <div className="sm:col-span-2 lg:col-span-3 p-4 bg-[#F8F9FA] border border-slate-200 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Stock Type &amp; Dispatch Allocation
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {stockLocation === 'Japan Yard'
                        ? 'Publishes to Regular Stock (/used-cars)'
                        : 'Publishes exclusively to Port Balance (/port-balance)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className={stockLocation === 'Japan Yard' ? 'md:col-span-2' : ''}>
                      <label htmlFor="add-stock-loc" className="block text-xs font-semibold text-slate-700 mb-1">
                        Stock Type
                      </label>
                      <select
                        id="add-stock-loc"
                        value={stockLocation}
                        onChange={(e) =>
                          setStockLocation(e.target.value as StockLocationType)
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="Japan Yard">Japan Yard Stock (Regular Export)</option>
                        <option value="Port Balance (At Port)">Port Balance — Arrived at Port</option>
                        <option value="Port Balance (In Transit)">Port Balance — In Transit (On Vessel)</option>
                      </select>
                    </div>

                    {stockLocation === 'Japan Yard' ? (
                      <div className="md:col-span-2">
                        <label htmlFor="add-yard-availability" className="block text-xs font-semibold text-slate-700 mb-1">
                          Yard Availability Badge
                        </label>
                        <select
                          id="add-yard-availability"
                          value={yardAvailability}
                          onChange={(e) =>
                            setYardAvailability(
                              e.target.value as 'Ready to Ship' | 'New Arrival'
                            )
                          }
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                        >
                          <option value="New Arrival">New Arrival</option>
                          <option value="Ready to Ship">Ready to Ship</option>
                        </select>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label htmlFor="add-pb-port" className="block text-xs font-semibold text-slate-700 mb-1">
                            Arrival / Clearance Port
                          </label>
                          <input
                            id="add-pb-port"
                            type="text"
                            value={portBalancePort}
                            onChange={(e) => setPortBalancePort(e.target.value)}
                            placeholder="e.g. Port Qasim (Karachi) / Mombasa"
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label htmlFor="add-pb-deposit" className="block text-xs font-semibold text-slate-700 mb-1">
                            Booking Deposit (USD)
                          </label>
                          <input
                            id="add-pb-deposit"
                            type="number"
                            min={0}
                            value={depositUsd}
                            onChange={(e) => setDepositUsd(Number(e.target.value))}
                            className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label htmlFor="add-pb-balance" className="block text-xs font-semibold text-slate-700 mb-1">
                            Balance at Port (USD)
                          </label>
                          <input
                            id="add-pb-balance"
                            type="number"
                            min={0}
                            value={portBalanceUsd}
                            onChange={(e) => setPortBalanceUsd(Number(e.target.value))}
                            className="w-full px-3 py-2 text-sm font-mono font-bold bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Multi-Image Vehicle Gallery Manager */}
                <div className="sm:col-span-2 lg:col-span-3 p-4 bg-[#F8F9FA] border border-slate-200 rounded-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-950">
                        Vehicle Gallery Photos ({galleryImages.length} added)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload multiple photos or append image URLs. First photo is used as the primary catalog cover.
                      </p>
                    </div>
                  </div>

                  {/* Gallery Thumbnail Strip */}
                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {galleryImages.map((img, idx) => (
                        <div
                          key={`${img.slice(0, 32)}-${idx}`}
                          className={`bg-white rounded-lg overflow-hidden border ${
                            idx === 0 ? 'border-[#B91C1C]' : 'border-slate-200'
                          }`}
                        >
                          <div className="relative aspect-[4/3] bg-slate-100">
                            <img
                              src={img}
                              alt={`Vehicle gallery ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              aria-label={`Remove photo ${idx + 1}`}
                              className="absolute top-1.5 right-1.5 p-1 rounded bg-slate-950/75 text-white hover:bg-[#B91C1C] cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="px-2 py-1.5 flex items-center justify-between text-[11px]">
                            {idx === 0 ? (
                              <span className="font-semibold text-[#B91C1C]">
                                Cover Photo
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetCover(idx)}
                                className="font-medium text-slate-600 hover:text-slate-950 underline cursor-pointer"
                              >
                                Set Cover
                              </button>
                            )}
                            <span className="font-mono text-slate-400">#{idx + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Multi-Upload and URL Adder */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label
                        htmlFor="add-upload-photo"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Upload Multiple Local Photos
                      </label>
                      <input
                        id="add-upload-photo"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFileUpload}
                        className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="add-url-photo"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Or Append Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="add-url-photo"
                          type="text"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label htmlFor="add-features" className="block text-xs font-semibold text-slate-700 mb-1">
                    Equipped Options (comma-separated)
                  </label>
                  <input
                    id="add-features"
                    type="text"
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label htmlFor="add-note" className="block text-xs font-semibold text-slate-700 mb-1">
                    Yard Inspector Assessment
                  </label>
                  <textarea
                    id="add-note"
                    rows={2}
                    value={inspectorNote}
                    onChange={(e) => setInspectorNote(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3 pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors cursor-pointer"
                  >
                    Publish Vehicle to Export Stock
                  </button>
                  {addedBanner && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>
                        Saved {addedBanner.year} {addedBanner.make} {addedBanner.model} ({addedBanner.stockNo})
                      </span>
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: MANAGE INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search
                      className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={invSearch}
                      onChange={(e) => setInvSearch(e.target.value)}
                      placeholder="Filter stock no., make, model, chassis..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs">
                    {(
                      [
                        { id: 'all', label: 'All' },
                        { id: 'japan-yard', label: 'Japan Yard' },
                        { id: 'port-balance', label: 'Port Balance' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setInvLocationFilter(opt.id)}
                        className={`px-2.5 py-1 font-semibold rounded-md cursor-pointer ${
                          invLocationFilter === opt.id
                            ? 'bg-white text-slate-950 shadow-xs'
                            : 'text-slate-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-slate-500 tabular-nums mr-1">
                    {filteredInventory.length} units
                  </span>

                  {selectedVehicleIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const count = selectedVehicleIds.length;
                        onBulkDeleteVehicles(selectedVehicleIds);
                        setSelectedVehicleIds([]);
                        setActionToast(`Deleted ${count} selected vehicles.`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Delete Selected ({selectedVehicleIds.length})</span>
                    </button>
                  )}

                  {vehicles.length > 0 && (
                    confirmClearStock ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const count = vehicles.length;
                            onClearAllVehicles();
                            setSelectedVehicleIds([]);
                            setConfirmClearStock(false);
                            setActionToast(`Cleared all ${count} vehicles from stock.`);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
                        >
                          Confirm Clear All ({vehicles.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmClearStock(false)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmClearStock(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#B91C1C] bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Clear All Stock</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {filteredInventory.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <p className="font-display text-base font-bold text-slate-900">
                    {vehicles.length === 0
                      ? 'Inventory is empty'
                      : 'No matching vehicles'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {vehicles.length === 0
                      ? 'All sample vehicles have been cleared. Click below to start adding your own live inventory.'
                      : 'Try clearing your search or location filter to see remaining units.'}
                  </p>
                  {vehicles.length === 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('add-car')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Add Your First Vehicle</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8F9FA] border-b border-slate-200 text-slate-600">
                        <th className="py-3 px-4 w-8">
                          <input
                            type="checkbox"
                            aria-label="Select all visible vehicles"
                            checked={
                              filteredInventory.length > 0 &&
                              filteredInventory.every((v) =>
                                selectedVehicleIds.includes(v.id)
                              )
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedVehicleIds(filteredInventory.map((v) => v.id));
                              } else {
                                setSelectedVehicleIds([]);
                              }
                            }}
                            className="rounded border-slate-300 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-4 font-semibold">Stock No.</th>
                        <th className="py-3 px-4 font-semibold">Vehicle</th>
                        <th className="py-3 px-4 font-semibold">Yard / Grade</th>
                        <th className="py-3 px-4 font-semibold text-right">FOB (USD)</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredInventory.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              aria-label={`Select ${v.stockNo}`}
                              checked={selectedVehicleIds.includes(v.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedVehicleIds((prev) => [...prev, v.id]);
                                } else {
                                  setSelectedVehicleIds((prev) =>
                                    prev.filter((id) => id !== v.id)
                                  );
                                }
                              }}
                              className="rounded border-slate-300 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-950 whitespace-nowrap">
                            {v.stockNo}
                          </td>
                          <td className="py-3 px-4">
                            <span className="block font-semibold text-slate-900">
                              {v.year} {v.make} {v.model}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">
                              {v.chassisCode} · {v.mileageKm.toLocaleString()} km
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                            {v.yardPort} · Grade {v.auctionGrade}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-950 tabular-nums whitespace-nowrap">
                            ${v.fobUsd.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                const nextAvailability: Vehicle['availability'] =
                                  v.availability === 'Ready to Ship'
                                    ? 'New Arrival'
                                    : v.availability === 'New Arrival'
                                      ? 'Port Balance'
                                      : 'Ready to Ship';
                                onUpdateVehicle({
                                  ...v,
                                  availability: nextAvailability,
                                  stockLocation:
                                    nextAvailability === 'Port Balance'
                                      ? v.stockLocation && v.stockLocation !== 'Japan Yard'
                                        ? v.stockLocation
                                        : 'Port Balance (At Port)'
                                      : 'Japan Yard',
                                });
                              }}
                              className="text-xs font-medium text-slate-700 underline underline-offset-2 hover:text-[#B91C1C] cursor-pointer"
                            >
                              {v.availability}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                            <button
                              type="button"
                              onClick={() => onViewVehiclePage(v)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded cursor-pointer"
                            >
                              View Page
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteVehicle(v.id);
                                setSelectedVehicleIds((prev) =>
                                  prev.filter((id) => id !== v.id)
                                );
                                setActionToast(`Deleted ${v.year} ${v.make} ${v.model} (${v.stockNo}).`);
                              }}
                              aria-label={`Remove ${v.stockNo}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#B91C1C] bg-red-50 hover:bg-red-100 rounded cursor-pointer align-middle"
                            >
                              <Trash2 className="w-3 h-3" aria-hidden="true" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WORDPRESS-STYLE BLOG CMS */}
          {activeTab === 'blog-posts' && (
            <div className="space-y-6">
              {blogNotice && (
                <div className="bg-white border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{blogNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBlogNotice(null)}
                    className="text-slate-500 hover:text-slate-900 underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* WordPress-Style Post Editor */}
              <form
                onSubmit={handleBlogSubmit}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                {/* Left: Main Content Editor */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="font-display text-lg font-bold text-slate-950">
                        {editingPostId ? 'Edit Blog Post' : 'Add New Blog Post'}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Create export guides, VIN inspection explainers, or Port Balance announcements.
                      </p>
                    </div>
                    {editingPostId && (
                      <button
                        type="button"
                        onClick={resetBlogEditor}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div>
                    <label htmlFor="wp-title" className="block text-xs font-semibold text-slate-700 mb-1">
                      Post Title *
                    </label>
                    <input
                      id="wp-title"
                      type="text"
                      required
                      value={blogTitle}
                      onChange={(e) => handleBlogTitleChange(e.target.value)}
                      placeholder="Enter article headline (e.g. How to Verify a Japanese VIN Report Before Bidding)..."
                      className="w-full px-3.5 py-2.5 text-sm font-display font-bold bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="wp-slug" className="block text-xs font-semibold text-slate-700 mb-1">
                      Permalink Slug
                    </label>
                    <div className="flex items-center bg-[#F8F9FA] border border-slate-300 rounded-lg overflow-hidden text-xs">
                      <span className="px-3 py-2 bg-slate-100 text-slate-500 font-mono border-r border-slate-300">
                        /blog/
                      </span>
                      <input
                        id="wp-slug"
                        type="text"
                        value={blogSlug}
                        onChange={(e) => {
                          setSlugManual(true);
                          setBlogSlug(toSlug(e.target.value));
                        }}
                        placeholder="article-url-slug"
                        className="flex-1 px-3 py-2 font-mono bg-transparent focus:outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Formatting Toolbar */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <label htmlFor="wp-content" className="text-xs font-semibold text-slate-700">
                        Article Body *
                      </label>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => appendBlogBlock('## Section Heading')}
                          className="px-2.5 py-1 font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded cursor-pointer"
                        >
                          + H2 Heading
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            appendBlogBlock('- Bullet point one\n- Bullet point two')
                          }
                          className="px-2.5 py-1 font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded cursor-pointer"
                        >
                          + Bullet List
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            appendBlogBlock('> Key Buyer Takeaway: Verify chassis history before wire transfer.')
                          }
                          className="px-2.5 py-1 font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded cursor-pointer"
                        >
                          + Quote Block
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="wp-content"
                      rows={11}
                      required
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-sans bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C] leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Separate paragraphs with a blank line. Prefix lines with <code className="font-mono">## </code> for headings, <code className="font-mono">- </code> for bullet lists, or <code className="font-mono">&gt; </code> for callout quotes.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="wp-excerpt" className="block text-xs font-semibold text-slate-700 mb-1">
                      Summary Excerpt (shown on Blog index cards)
                    </label>
                    <textarea
                      id="wp-excerpt"
                      rows={2}
                      value={blogExcerpt}
                      onChange={(e) => setBlogExcerpt(e.target.value)}
                      placeholder="Short 1–2 sentence summary (auto-generated from body if left blank)..."
                      className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                </div>

                {/* Right: WordPress Publish & Media Sidebar */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-[#0F172A] text-white">
                      <h3 className="font-display text-sm font-bold">Publish Settings</h3>
                    </div>
                    <div className="p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="wp-status" className="block font-semibold text-slate-700 mb-1">
                            Status
                          </label>
                          <select
                            id="wp-status"
                            value={blogStatus}
                            onChange={(e) =>
                              setBlogStatus(e.target.value as 'Published' | 'Draft')
                            }
                            className="w-full px-2.5 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                          >
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="wp-read" className="block font-semibold text-slate-700 mb-1">
                            Read (min)
                          </label>
                          <input
                            id="wp-read"
                            type="number"
                            min={1}
                            max={30}
                            value={blogReadMinutes}
                            onChange={(e) => setBlogReadMinutes(Number(e.target.value))}
                            className="w-full px-2.5 py-2 font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="wp-category" className="block font-semibold text-slate-700 mb-1">
                          Category
                        </label>
                        <select
                          id="wp-category"
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value as BlogCategory)}
                          className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                        >
                          <option value="Buying Guides">Buying Guides</option>
                          <option value="VIN & Inspection">VIN &amp; Inspection</option>
                          <option value="Port Balance">Port Balance</option>
                          <option value="Shipping & Ports">Shipping &amp; Ports</option>
                          <option value="Auction Tips">Auction Tips</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="wp-author" className="block font-semibold text-slate-700 mb-1">
                          Author Byline
                        </label>
                        <input
                          id="wp-author"
                          type="text"
                          value={blogAuthor}
                          onChange={(e) => setBlogAuthor(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label htmlFor="wp-tags" className="block font-semibold text-slate-700 mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          id="wp-tags"
                          type="text"
                          value={blogTagsText}
                          onChange={(e) => setBlogTagsText(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
                      >
                        {editingPostId
                          ? 'Update Blog Post'
                          : blogStatus === 'Published'
                            ? 'Publish Post'
                            : 'Save as Draft'}
                      </button>
                    </div>
                  </div>

                  {/* Featured Image Panel */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                    <h3 className="font-display text-sm font-bold text-slate-950">
                      Featured Image
                    </h3>
                    <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={blogCoverImage}
                        alt="Featured cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg cursor-pointer">
                        <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Upload Featured Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBlogCoverUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={blogCoverUrlInput}
                        onChange={(e) => setBlogCoverUrlInput(e.target.value)}
                        placeholder="Or paste image path/URL..."
                        className="flex-1 px-2.5 py-1.5 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (blogCoverUrlInput.trim()) {
                            setBlogCoverImage(blogCoverUrlInput.trim());
                            setBlogCoverUrlInput('');
                          }
                        }}
                        className="px-3 py-1.5 font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* All Blog Posts Table (WordPress Posts List) */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-950">
                      All Blog Posts ({blogPosts.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage published articles, toggle drafts, edit copy, or preview live pages.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search
                        className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="text"
                        value={blogSearch}
                        onChange={(e) => setBlogSearch(e.target.value)}
                        placeholder="Filter posts..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                      />
                    </div>
                    {blogPosts.length > 0 && (
                      confirmClearBlogs ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const count = blogPosts.length;
                              onClearAllBlogPosts();
                              setConfirmClearBlogs(false);
                              setActionToast(`Deleted all ${count} blog posts.`);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
                          >
                            Confirm Clear All ({blogPosts.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmClearBlogs(false)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmClearBlogs(true)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#B91C1C] bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Clear All Posts</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8F9FA] border-b border-slate-200 text-slate-600">
                        <th className="py-3 px-4 font-semibold">Article</th>
                        <th className="py-3 px-4 font-semibold">Category</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Date</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredBlogPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-14 h-10 rounded object-cover bg-slate-100 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-950 truncate max-w-md">
                                  {post.title}
                                </p>
                                <p className="font-mono text-[11px] text-slate-500 truncate max-w-md">
                                  /blog/{post.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                            {post.category}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateBlogPost({
                                  ...post,
                                  status:
                                    post.status === 'Published' ? 'Draft' : 'Published',
                                })
                              }
                              className={`font-mono font-semibold underline underline-offset-2 cursor-pointer ${
                                post.status === 'Published'
                                  ? 'text-emerald-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {post.status}
                            </button>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                            {post.publishedAt}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => onViewBlogPost(post)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded cursor-pointer"
                            >
                              <Eye className="w-3 h-3" aria-hidden="true" />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => startEditBlogPost(post)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" aria-hidden="true" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteBlogPost(post.id);
                                setActionToast(`Deleted blog post "${post.title}".`);
                              }}
                              aria-label={`Delete post ${post.title}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#B91C1C] bg-red-50 hover:bg-red-100 rounded cursor-pointer align-middle"
                            >
                              <Trash2 className="w-3 h-3" aria-hidden="true" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: STAFF USER DETAILS & ACCOUNTS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Signed-In User Detail Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#B91C1C]" aria-hidden="true" />
                    <h2 className="font-display text-lg font-bold text-slate-950">
                      Active Staff Profile Details
                    </h2>
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-700">
                    Authenticated Session
                  </span>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3.5 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                    <dt className="text-slate-500">Full Name</dt>
                    <dd className="font-display font-bold text-slate-950 mt-0.5 text-sm">
                      {currentUser.fullName}
                    </dd>
                  </div>
                  <div className="p-3.5 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                    <dt className="text-slate-500">Staff Email</dt>
                    <dd className="font-mono font-semibold text-slate-950 mt-0.5">
                      {currentUser.email}
                    </dd>
                  </div>
                  <div className="p-3.5 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                    <dt className="text-slate-500">Role</dt>
                    <dd className="font-semibold text-[#B91C1C] mt-0.5">
                      {currentUser.role}
                    </dd>
                  </div>
                  <div className="p-3.5 bg-[#F8F9FA] border border-slate-200 rounded-lg">
                    <dt className="text-slate-500">Assigned Office / Desk</dt>
                    <dd className="font-semibold text-slate-950 mt-0.5">
                      {currentUser.portDesk}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Add New Staff User Detail Form */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                  <UserPlus className="w-5 h-5 text-slate-900" aria-hidden="true" />
                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-950">
                      Create New Staff User Detail
                    </h2>
                    <p className="text-xs text-slate-500">
                      Provision portal credentials for export coordinators, port desks, or blog editors.
                    </p>
                  </div>
                </div>

                {userNotice && (
                  <div className="p-3 bg-[#F8F9FA] border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{userNotice}</span>
                  </div>
                )}
                {userError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-[#B91C1C] font-semibold">
                    {userError}
                  </div>
                )}

                <form
                  onSubmit={handleCreateStaffUser}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs"
                >
                  <div>
                    <label htmlFor="nu-name" className="block font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="nu-name"
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Kenji Sato"
                      className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="nu-email" className="block font-semibold text-slate-700 mb-1">
                      Staff Email *
                    </label>
                    <input
                      id="nu-email"
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="kenji@pjsventure.jp"
                      className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="nu-role" className="block font-semibold text-slate-700 mb-1">
                      Role
                    </label>
                    <select
                      id="nu-role"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as StaffRole)}
                      className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Export Coordinator">Export Coordinator</option>
                      <option value="Blog Editor">Blog Editor</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="nu-desk" className="block font-semibold text-slate-700 mb-1">
                      Port Desk
                    </label>
                    <input
                      id="nu-desk"
                      type="text"
                      value={newUserDesk}
                      onChange={(e) => setNewUserDesk(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="nu-pass" className="block font-semibold text-slate-700 mb-1">
                      Password (6+ chars) *
                    </label>
                    <input
                      id="nu-pass"
                      type="password"
                      required
                      minLength={6}
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-5 flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2.5 font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
                    >
                      Add Staff User Account
                    </button>
                  </div>
                </form>
              </div>

              {/* Staff Accounts Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200">
                  <h3 className="font-display text-base font-bold text-slate-950">
                    Registered Staff Users ({staffUsers.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8F9FA] border-b border-slate-200 text-slate-600">
                        <th className="py-3 px-4 font-semibold">Name</th>
                        <th className="py-3 px-4 font-semibold">Email</th>
                        <th className="py-3 px-4 font-semibold">Role</th>
                        <th className="py-3 px-4 font-semibold">Port Desk</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {staffUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-950 whitespace-nowrap">
                            {u.fullName}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                            {u.email}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                            {u.role}
                          </td>
                          <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                            {u.portDesk}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleToggleUserActive(u)}
                              disabled={u.id === currentUser.id}
                              className={`font-mono font-semibold underline underline-offset-2 cursor-pointer disabled:no-underline disabled:cursor-default ${
                                u.active ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            >
                              {u.active ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {u.id !== currentUser.id ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteStaffUser(u.id)}
                                aria-label={`Delete staff user ${u.email}`}
                                className="p-1 text-slate-400 hover:text-[#B91C1C] rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="font-mono text-[11px] text-slate-400">
                                Current
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
