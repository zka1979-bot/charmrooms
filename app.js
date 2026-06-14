// ==================== CONFIGURAZIONE SUPABASE ====================
const SUPABASE_URL = 'https://wtybjjdmxqanfazbbeh.supabase.co';  // <-- Il tuo URL vero
const SUPABASE_KEY = 'process.env..env.SUPABASE_KEY';  // <-- La tua chiave vera
// ==================== REACT SETUP ====================
const { useState, useEffect } = React;

// ==================== CONFIGURAZIONE ====================
const APARTMENTS = [
    { id: 'genziana', name: 'Appartamento Genziana', color: 'blue', description: 'Vista montagna, 2 camere' },
    { id: 'magenta', name: 'Appartamento Magenta', color: 'pink', description: 'Vista lago, 3 camere' }
];

const STATUS = {
    confirmed: { label: 'Confermata', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    pending: { label: 'In attesa', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    cancelled: { label: 'Cancellata', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
};

const API_PROVIDERS = [{ id: 'airbnb', name: 'Airbnb' }, { id: 'booking', name: 'Booking.com' }];

// ==================== UTILITIES ====================
const genId = () => Math.random().toString(36).substr(2, 9);
const fmtDate = d => new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
const getDays = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirst = (y, m) => new Date(y, m, 1).getDay();
const calcNights = (i, o) => { if (!i || !o) return 0; return Math.max(0, Math.ceil((new Date(o) - new Date(i)) / (1000 * 60 * 60 * 24))) };
const inRange = (d, s, e) => { if (!s || !e) return false; const dt = new Date(d); return dt >= new Date(s) && dt <= new Date(e); };

// ==================== ICON COMPONENT ====================
const Icon = ({ name, size = 20 }) => {
    const icons = {
        plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
        x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
        calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
        users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
        trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
        edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
        chevronLeft: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
        chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
        euro: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12"/><path d="M4 14h9.5"/><path d="M19 6c-1.5-2-4-3-7-3-5 0-8 4-8 9s3 9 8 9c3 0 5.5-1 7-3"/></svg>,
        bed: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M6 8v9"/></svg>,
        settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/></svg>,
        list: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>,
        flower: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="5" cy="12" r="2"/></svg>,
        key: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
        cloud: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
        refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
        save: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>,
        search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
        home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
    };
    return icons[name] || null;
};

// ==================== UI COMPONENTS ====================
const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false }) => {
    const v = { primary: 'bg-slate-800 text-white hover:bg-slate-700', secondary: 'bg-white text-slate-700 border border-gray-200 hover:bg-gray-50', danger: 'bg-red-500 text-white hover:bg-red-600', blue: 'bg-blue-500 text-white hover:bg-blue-600', pink: 'bg-pink-500 text-white hover:bg-pink-600' };
    const s = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
    return <button onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all disabled:opacity-50 active:scale-95 ${v[variant]} ${s[size]}`}>{children}</button>;
};

const Input = ({ label, type = 'text', value, onChange, placeholder }) => (
    <div>
        {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
    </div>
);

const Select = ({ label, value, onChange, options }) => (
    <div>
        {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
        <select value={value} onChange={onChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer">{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
    </div>
);

// ==================== STATS CARDS ====================
const StatsCards = ({ bookings, year, month }) => {
    const mb = bookings.filter(b => { const d = new Date(b.checkIn); return d.getFullYear() === year && d.getMonth() === month && b.status !== 'cancelled'; });
    const nights = mb.reduce((s, b) => s + calcNights(b.checkIn, b.checkOut), 0);
    const rev = mb.reduce((s, b) => s + b.totalPrice, 0);
    const guests = mb.reduce((s, b) => s + (b.guests || 1), 0);
    const stats = [
        { label: 'Prenotazioni', value: mb.length, icon: 'calendar', bg: 'bg-blue-50' },
        { label: 'Notti', value: nights, icon: 'bed', bg: 'bg-purple-50' },
        { label: 'Ospiti', value: guests, icon: 'users', bg: 'bg-green-50' },
        { label: 'Fatturato', value: `€${rev.toLocaleString()}`, icon: 'euro', bg: 'bg-amber-50' }
    ];
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
                <div key={i} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
                    <div className="flex items-center gap-3"><Icon name={s.icon} size={20} /><div><p className="text-2xl font-bold text-slate-800">{s.value}</p><p className="text-sm text-slate-500">{s.label}</p></div></div>
                </div>
            ))}
        </div>
    );
};

// ==================== CALENDAR GRID ====================
const CalendarGrid = ({ apartment, year, month, bookings, onDayClick, onBookingClick }) => {
    const daysInMonth = getDays(year, month);
    const firstDay = getFirst(year, month);
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="h-12 bg-gray-50 rounded-lg" />);
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayBookings = bookings.filter(b => b.apartmentId === apartment.id && inRange(date, b.checkIn, b.checkOut));
        const today = new Date().toDateString() === new Date(year, month, day).toDateString();
        const ongoing = dayBookings.find(b => b.checkIn <= date && b.checkOut > date);
        const starting = dayBookings.find(b => b.checkIn === date);
        cells.push(
            <div key={day} onClick={() => onDayClick(date, apartment.id)} className={`h-12 border rounded-xl p-1 cursor-pointer transition-all hover:shadow-md ${today ? 'ring-2 ring-blue-500' : ''}`}
                style={{ backgroundColor: ongoing ? (ongoing.status === 'confirmed' ? 'rgba(34,197,94,0.15)' : ongoing.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.1)') : 'white', borderLeftWidth: starting ? '4px' : '1px', borderLeftColor: starting ? (starting.status === 'confirmed' ? '#22c55e' : starting.status === 'pending' ? '#f59e0b' : '#ef4444') : '#e5e7eb' }}>
                <div className="flex items-center justify-between h-full">
                    <span className={`text-sm font-medium ${today ? 'text-blue-600' : 'text-slate-600'}`}>{day}</span>
                    <div className="flex gap-0.5">{dayBookings.slice(0, 2).map((b, i) => <div key={i} onClick={e => { e.stopPropagation(); onBookingClick(b); }} className={`w-2 h-2 rounded-full cursor-pointer hover:scale-125 transition-transform ${STATUS[b.status].dot}`} title={b.guestName} />)}</div>
                </div>
            </div>
        );
    }
    const grad = apartment.color === 'blue' ? 'from-blue-500 to-blue-600' : 'from-pink-500 to-rose-500';
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${grad} px-5 py-4`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><Icon name="flower" size={24} /><div><h3 className="text-white font-semibold text-lg">{apartment.name}</h3><p className="text-white/80 text-sm">{apartment.description}</p></div></div>
                    <div className="text-right"><p className="text-white/80 text-sm">A partire da</p><p className="text-white font-bold text-xl">€{apartment.price}<span className="text-sm font-normal">/notte</span></p></div>
                </div>
            </div>
            <div className="p-3">
                <div className="grid grid-cols-7 gap-1 mb-2">{days.map(d => <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">{d}</div>)}</div>
                <div className="grid grid-cols-7 gap-1">{cells}</div>
            </div>
        </div>
    );
};

// ==================== BOOKING MODAL ====================
const BookingModal = ({ isOpen, onClose, onSave, booking, selectedApartment, selectedDate }) => {
    const [form, setForm] = useState({ id: '', apartmentId: 'genziana', guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', guests: 1, totalPrice: 0, status: 'pending', notes: '', source: 'direct' });
    useEffect(() => {
        if (booking) setForm(booking);
        else setForm({ id: genId(), apartmentId: selectedApartment || 'genziana', guestName: '', guestEmail: '', guestPhone: '', checkIn: selectedDate || '', checkOut: '', guests: 1, totalPrice: 0, status: 'pending', notes: '', source: 'direct' });
    }, [booking, selectedApartment, selectedDate, isOpen]);
    useEffect(() => { if (form.checkIn && form.checkOut) { const apt = APARTMENTS.find(a => a.id === form.apartmentId); const n = calcNights(form.checkIn, form.checkOut); if (n > 0 && apt) setForm(f => ({ ...f, totalPrice: n * apt.price })); } }, [form.checkIn, form.checkOut, form.apartmentId]);
    if (!isOpen) return null;
    const submit = e => { e.preventDefault(); onSave(form); onClose(); };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">{booking ? 'Modifica' : 'Nuova'} Prenotazione</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><Icon name="x" size={20} /></button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <Select label="Appartamento" value={form.apartmentId} onChange={e => setForm(f => ({ ...f, apartmentId: e.target.value }))} options={APARTMENTS.map(a => ({ value: a.id, label: `${a.name} - €${a.price}/notte` }))} />
                    <Input label="Nome Ospite *" value={form.guestName} onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))} placeholder="Mario Rossi" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Email" type="email" value={form.guestEmail} onChange={e => setForm(f => ({ ...f, guestEmail: e.target.value }))} placeholder="email@esempio.com" />
                        <Input label="Telefono" type="tel" value={form.guestPhone} onChange={e => setForm(f => ({ ...f, guestPhone: e.target.value }))} placeholder="+39 123 456789" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Check-in *" type="date" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} />
                        <Input label="Check-out *" type="date" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Ospiti" value={form.guests} onChange={e => setForm(f => ({ ...f, guests: Number(e.target.value) }))} options={[1, 2, 3, 4, 5, 6].map(n => ({ value: n, label: `${n} ${n === 1 ? 'ospite' : 'ospiti'}` }))} />
                        <Select label="Stato" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} options={[{ value: 'pending', label: 'In attesa' }, { value: 'confirmed', label: 'Confermata' }, { value: 'cancelled', label: 'Cancellata' }]} />
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <div><p className="text-sm text-slate-500">Notti totali</p><p className="text-lg font-semibold text-slate-800">{calcNights(form.checkIn, form.checkOut)}</p></div>
                            <div className="text-right"><p className="text-sm text-slate-500">Prezzo totale</p><p className="text-2xl font-bold text-slate-800">€{form.totalPrice.toLocaleString()}</p></div>
                        </div>
                    </div>
                    <Input label="Note" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Richieste speciali..." />
                    <div className="flex gap-3 pt-2">
                        <Button type="button" onClick={onClose} variant="secondary" className="flex-1">Annulla</Button>
                        <Button type="submit" variant="primary" className="flex-1"><Icon name="save" size={18} /> Salva</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ==================== BOOKING LIST ====================
const BookingList = ({ bookings, onEdit, onDelete }) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const filtered = bookings.filter(b => { if (statusFilter !== 'all' && b.status !== statusFilter) return false; if (search && !b.guestName.toLowerCase().includes(search.toLowerCase())) return false; return true; }).sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca ospite..." className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white"><option value="all">Tutti</option><option value="confirmed">Confermate</option><option value="pending">In attesa</option><option value="cancelled">Cancellate</option></select>
            </div>
            {filtered.length === 0 ? <div className="text-center py-12 bg-white rounded-2xl border border-gray-100"><Icon name="calendar" size={48} /><p className="text-slate-500 mt-3">Nessuna prenotazione</p></div> : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filtered.map(b => (
                        <div key={b.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-slate-800">{b.guestName}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS[b.status].bg} ${STATUS[b.status].text}`}>{STATUS[b.status].label}</span>
                                    </div>
                                    <p className="text-sm text-slate-500">{fmtDate(b.checkIn)} - {fmtDate(b.checkOut)} ({calcNights(b.checkIn, b.checkOut)} notti)</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-slate-800">€{b.totalPrice}</p>
                                    <button onClick={() => onEdit(b)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Icon name="edit" size={16} /></button>
                                    <button onClick={() => onDelete(b.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Icon name="trash" size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ==================== SETTINGS PANEL ====================
const SettingsPanel = ({ apiKeys, setApiKeys, onSync, syncStatus }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Icon name="key" size={20} /> Configurazione API</h3>
            <div className="space-y-4">
                {APARTMENTS.map(apt => (
                    <div key={apt.id} className="border border-gray-200 rounded-xl p-4">
                        <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2"><Icon name="home" size={16} /> {apt.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {API_PROVIDERS.map(provider => (
                                <div key={provider.id}>
                                    <label className="block text-sm text-slate-500 mb-1">{provider.name} API Key</label>
                                    <input type="password" placeholder="Inserisci API Key..." value={apiKeys[apt.id]?.[provider.id] || ''} onChange={e => setApiKeys({ ...apiKeys, [apt.id]: { ...apiKeys[apt.id], [provider.id]: e.target.value } })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Icon name="cloud" size={20} /> Sincronizzazione</h3>
            <p className="text-sm text-slate-500 mb-4">Clicca per sincronizzare le prenotazioni dai portali esterni.</p>
            <div className="flex flex-wrap gap-3">
                {APARTMENTS.map(apt => (
                    <Button key={apt.id} variant={apt.color} onClick={() => onSync(apt.id)} disabled={syncStatus.loading}>
                        {syncStatus.loading && syncStatus.aptId === apt.id ? 'Sincronizzazione...' : `Sincronizza ${apt.name.split(' ')[1]}`}
                    </Button>
                ))}
            </div>
            {syncStatus.message && <div className={`mt-4 p-3 rounded-xl ${syncStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{syncStatus.message}</div>}
        </div>
    </div>
);

// ==================== MAIN APP ====================
const App = () => {
    const [view, setView] = useState('calendar');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const [bookings, setBookings] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedApartment, setSelectedApartment] = useState('');
    const [apiKeys, setApiKeys] = useState({ genziana: { airbnb: '', booking: '' }, magenta: { airbnb: '', booking: '' } });
    const [syncStatus, setSyncStatus] = useState({ loading: false, message: '', success: true, aptId: null });

    useEffect(() => { const saved = localStorage.getItem('charmrooms_bookings'); if (saved) setBookings(JSON.parse(saved)); }, []);
    useEffect(() => { localStorage.setItem('charmrooms_bookings', JSON.stringify(bookings)); }, [bookings]);

    const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
    const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };
    const openModal = (date = '', apt = 'genziana') => { setSelectedDate(date); setSelectedApartment(apt); setSelectedBooking(null); setModalOpen(true); };
    const editBooking = (b) => { setSelectedBooking(b); setSelectedDate(''); setModalOpen(true); };
    const saveBooking = (form) => { setBookings(bs => { const idx = bs.findIndex(b => b.id === form.id); if (idx >= 0) { const nb = [...bs]; nb[idx] = form; return nb; } return [...bs, form]; }); };
    const deleteBooking = (id) => { if (window.confirm('Eliminare questa prenotazione?')) setBookings(bs => bs.filter(b => b.id !== id)); };

    const syncApi = async (aptId) => {
        setSyncStatus({ loading: true, message: '', success: true, aptId });
        await new Promise(r => setTimeout(r, 1500));
        const names = ['Mario Rossi', 'Laura Bianchi', 'Giuseppe Verdi', 'Anna Neri', 'Paolo Gialli'];
        const sources = ['airbnb', 'booking'];
        const apt = APARTMENTS.find(a => a.id === aptId);
        const startDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        const endDate = new Date(startDate.getTime() + (Math.floor(Math.random() * 7) + 2) * 24 * 60 * 60 * 1000);
        const newBooking = { id: genId(), apartmentId: aptId, guestName: names[Math.floor(Math.random() * names.length)], guestEmail: 'demo@email.com', guestPhone: '+39 123 456789', checkIn: startDate.toISOString().split('T')[0], checkOut: endDate.toISOString().split('T')[0], guests: Math.floor(Math.random() * 4) + 1, totalPrice: calcNights(startDate, endDate) * apt.price, status: 'confirmed', notes: 'Importato da ' + sources[Math.floor(Math.random() * sources.length)], source: sources[Math.floor(Math.random() * sources.length)] };
        setBookings(bs => [...bs, newBooking]);
        setSyncStatus({ loading: false, message: `Prenotazione importata con successo!`, success: true, aptId: null });
    };

    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center"><Icon name="flower" size={20} /></div>
                            <div><h1 className="text-xl font-bold text-slate-800">CharmRooms</h1><p className="text-sm text-slate-500">Gestione Casa Vacanza</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant={view === 'calendar' ? 'primary' : 'secondary'} onClick={() => setView('calendar')}><Icon name="calendar" size={18} /> Calendario</Button>
                            <Button variant={view === 'list' ? 'primary' : 'secondary'} onClick={() => setView('list')}><Icon name="list" size={18} /> Prenotazioni</Button>
                            <Button variant={view === 'settings' ? 'primary' : 'secondary'} onClick={() => setView('settings')}><Icon name="settings" size={18} /> Impostazioni</Button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 py-6">
                {view === 'calendar' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="secondary" onClick={prevMonth}><Icon name="chevronLeft" size={18} /></Button>
                                <h2 className="text-2xl font-bold text-slate-800">{monthNames[month]} {year}</h2>
                                <Button variant="secondary" onClick={nextMonth}><Icon name="chevronRight" size={18} /></Button>
                            </div>
                            <Button variant="primary" onClick={() => openModal()}><Icon name="plus" size={18} /> Nuova Prenotazione</Button>
                        </div>
                        <StatsCards bookings={bookings} year={year} month={month} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {APARTMENTS.map(apt => <CalendarGrid key={apt.id} apartment={apt} year={year} month={month} bookings={bookings} onDayClick={openModal} onBookingClick={editBooking} />)}
                        </div>
                    </div>
                )}
                {view === 'list' && <BookingList bookings={bookings} onEdit={editBooking} onDelete={deleteBooking} />}
                {view === 'settings' && <SettingsPanel apiKeys={apiKeys} setApiKeys={setApiKeys} onSync={syncApi} syncStatus={syncStatus} />}
            </main>
            <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={saveBooking} booking={selectedBooking} selectedApartment={selectedApartment} selectedDate={selectedDate} />
        </div>
    );
};

// ==================== RENDER ====================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);