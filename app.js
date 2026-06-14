const { useState, useEffect } = React;

// ==================== CONFIGURAZIONE ====================
const APARTMENTS = [
    { id: 'genziana', name: 'Appartamento Genziana', color: 'blue', price: 120, description: 'Vista montagna, 2 camere' },
    { id: 'magenta', name: 'Appartamento Magenta', color: 'pink', price: 150, description: 'Vista lago, 3 camere' }
];

const STATUS = {
    confirmed: { label: 'Confermata', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    pending: { label: 'In attesa', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    cancelled: { label: 'Cancellata', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
};

const API_PROVIDERS = [
    { id: 'airbnb', name: 'Airbnb', color: '#FF5A5F' },
    { id: 'booking', name: 'Booking.com', color: '#003580' }
];

// ==================== UTILITIES ====================
const genId = () => Math.random().toString(36).substr(2, 9);
const fmtDate = d => new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
const getDays = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirst = (y, m) => new Date(y, m, 1).getDay();
const calcNights = (i, o) => { if (!i || !o) return 0; return Math.max(0, Math.ceil((new Date(o) - new Date(i)) / (1000 * 60 * 60 * 24))) };
const inRange = (d, s, e) => { if (!s || !e) return false; const dt = new Date(d); return dt >= new Date(s) && dt <= new Date(e); };

// ==================== ICON COMPONENT ====================
const Icon = ({ name, size = 20, className = '' }) => {
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
        settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
        list: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>,
        flower: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="5" cy="12" r="2"/></svg>,
        key: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
        cloud: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
        refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
        save: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>,
        search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
        home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
        check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    };
    return <span className={className}>{icons[name] || null}</span>;
};

// ==================== UI COMPONENTS ====================
const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false }) => {
    const v = {
        primary: 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm',
        secondary: 'bg-white text-slate-700 border border-gray-200 hover:bg-gray-50 shadow-sm',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm',
        ghost: 'text-slate-600 hover:bg-slate-100',
        blue: 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm',
        pink: 'bg-pink-500 text-white hover:bg-pink-600 shadow-sm'
    };
    const s = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
    return (
        <button onClick={onClick} disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${v[variant]} ${s[size]} ${className}`}>
            {children}
        </button>
    );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, className = '' }) => (
    <div className={className}>
        {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
    </div>
);

const Select = ({ label, value, onChange, options, className = '' }) => (
    <div className={className}>
        {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
        <select value={value} onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer">
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

// ==================== STATS CARDS ====================
const StatsCards = ({ bookings, year, month }) => {
    const mb = bookings.filter(b => {
        const d = new Date(b.checkIn);
        return d.getFullYear() === year && d.getMonth() === month && b.status !== 'cancelled';
    });
    const nights = mb.reduce((s, b) => s + calcNights(b.checkIn, b.checkOut), 0);
    const rev = mb.reduce((s, b) => s + b.totalPrice, 0);
    const guests = mb.reduce((s, b) => s + (b.guests || 1), 0);
    const stats = [
        { label: 'Prenotazioni', value: mb.length, icon: 'calendar', bg: 'bg-blue-50', iconBg: 'bg-blue-100' },
        { label: 'Notti', value: nights, icon: 'bed', bg: 'bg-purple-50', iconBg: 'bg-purple-100' },
        { label: 'Ospiti', value: guests, icon: 'users', bg: 'bg-green-50', iconBg: 'bg-green-100' },
        { label: 'Fatturato', value: `€${rev.toLocaleString()}`, icon: 'euro', bg: 'bg-amber-50', iconBg: 'bg-amber-100' }
    ];
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
                <div key={i} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${s.iconBg}`}>
                            <Icon name={s.icon} size={20} className="text-slate-700" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                            <p className="text-sm text-slate-500">{s.label}</p>
                        </div>
                    </div>
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

    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="h-12 lg:h-14 bg-gray-50 rounded-lg" />);

    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayBookings = bookings.filter(b => b.apartmentId === apartment.id && inRange(date, b.checkIn, b.checkOut));
        const today = new Date().toDateString() === new Date(year, month, day).toDateString();
        const ongoing = dayBookings.find(b => b.checkIn < date && b.checkOut > date);
        const starting = dayBookings.find(b => b.checkIn === date);

        cells.push(
            <div key={day} onClick={() => onDayClick(date, apartment.id)}
                className={`h-12 lg:h-14 border rounded-xl p-1 cursor-pointer transition-all hover:shadow-md relative ${today ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                style={{
                    backgroundColor: ongoing ? (ongoing.status === 'confirmed' ? 'rgba(34,197,94,0.15)' : ongoing.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.1)') : 'white',
                    borderLeftWidth: starting ? '4px' : '1px',
                    borderLeftColor: starting ? (starting.status === 'confirmed' ? '#22c55e' : starting.status === 'pending' ? '#f59e0b' : '#ef4444') : '#e5e7eb'
                }}>
                <div className="flex items-center justify-between h-full">
                    <span className={`text-sm font-medium ${today ? 'text-blue-600' : 'text-slate-600'}`}>{day}</span>
                    <div className="flex gap-0.5 overflow-hidden">
                        {dayBookings.slice(0, 2).map((b, i) => (
                            <div key={i} onClick={e => { e.stopPropagation(); onBookingClick(b); }}
                                className={`w-2 h-2 rounded-full cursor-pointer hover:scale-125 transition-transform ${STATUS[b.status].dot}`}
                                title={b.guestName} />
                        ))}
                        {dayBookings.length > 2 && <span className="text-xs text-slate-400 ml-0.5">+{dayBookings.length - 2}</span>}
                    </div>
                </div>
            </div>
        );
    }

    const grad = apartment.color === 'blue' ? 'from-blue-500 to-blue-600' : 'from-pink-500 to-rose-500';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${grad} px-5 py-4`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon name="flower" size={24} className="text-white" />
                        <div>
                            <h3 className="text-white font-semibold text-lg">{apartment.name}</h3>
                            <p className="text-white/80 text-sm">{apartment.description}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-white/80 text-sm">A partire da</p>
                        <p className="text-white font-bold text-xl">€{apartment.price}<span className="text-sm font-normal">/notte</span></p>
                    </div>
                </div>
            </div>
            <div className="p-3">
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {days.map(d => <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">{cells}</div>
            </div>
        </div>
    );
};