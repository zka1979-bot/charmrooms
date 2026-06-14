// ==================== CONFIGURAZIONE SUPABASE ====================
const SUPABASE_URL = 'https://wtybjjdmxqanfazgbbeh.supabase.co/rest/v1/';
const SUPABASE_KEY = 'process.env.SUPABASE_KEY';

// ==================== REACT SETUP ====================
const { useState, useEffect } = React;
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== COSTANTI ====================
const APARTMENTS = [
  { id: 'genziana', name: 'Appartamento Genziana', color: 'blue' },
  { id: 'magenta', name: 'Appartamento Magenta', color: 'pink' }
];

const STATUS = {
  confirmed: { label: 'Confermata', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  pending: { label: 'In attesa', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  cancelled: { label: 'Cancellata', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
};

// ==================== UTILITIES ====================
const genId = () => Math.random().toString(36).substr(2, 9);
const fmtDate = d => d ? new Date(d).toLocaleDateString('it-IT') : '-';
const getDays = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirst = (y, m) => new Date(y, m, 1).getDay();
const calcNights = (i, o) => i && o ? Math.max(0, Math.ceil((new Date(o) - new Date(i)) / 86400000)) : 0;
const inRange = (d, s, e) => { if(!s||!e) return false; const dt=new Date(d); return dt >= new Date(s) && dt <= new Date(e); };

// ==================== ICONS ====================
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
    bed: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M6 8v9"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/></svg>,
    list: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>,
    flower: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="5" cy="12" r="2"/></svg>,
    save: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>,
    loader: <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    alertCircle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    messageCircle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-6.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-6.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
    key: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  };
  return icons[name] || null;
};

// ==================== UI COMPONENTS ====================
const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '' }) => {
  const v = { primary: 'bg-slate-800 text-white hover:bg-slate-700', secondary: 'bg-white text-slate-700 border border-gray-200 hover:bg-gray-50', danger: 'bg-red-500 text-white hover:bg-red-600', blue: 'bg-blue-500 text-white hover:bg-blue-600', pink: 'bg-pink-500 text-white hover:bg-pink-600', green: 'bg-green-500 text-white hover:bg-green-600' };
  const s = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return <button onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all disabled:opacity-50 active:scale-95 ${v[variant]} ${s[size]} ${className}`}>{children}</button>;
};

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false }) => (
  <div>
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <select value={value} onChange={onChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer">{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
  </div>
);

const Badge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
};

// ==================== STATS CARDS ====================
const StatsCards = ({ bookings, year, month }) => {
  const mb = bookings.filter(b => { const d = new Date(b.checkIn); return d.getFullYear() === year && d.getMonth() === month && b.status !== 'cancelled'; });
  const nights = mb.reduce((s, b) => s + calcNights(b.checkIn, b.checkOut), 0);
  const guests = mb.reduce((s, b) => s + (b.guests || 1), 0);
  const stats = [
    { label: 'Prenotazioni', value: mb.length, icon: 'calendar', bg: 'bg-blue-50' },
    { label: 'Notti', value: nights, icon: 'bed', bg: 'bg-purple-50' },
    { label: 'Ospiti', value: guests, icon: 'users', bg: 'bg-green-50' }
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
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
        <div className="flex items-center gap-3"><Icon name="flower" size={24} /><div><h3 className="text-white font-semibold text-lg">{apartment.name}</h3></div></div>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-7 gap-1 mb-2">{days.map(d => <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">{cells}</div>
      </div>
    </div>
  );
};

// ==================== BOOKING MODAL ====================
const BookingModal = ({ isOpen, onClose, onSave, booking, selectedApartment, selectedDate, guests }) => {
  const [form, setForm] = useState({ id: '', apartmentId: 'genziana', guestId: '', guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', guests: 1, status: 'pending', notes: '' });
  
  useEffect(() => {
    if (booking) setForm(booking);
    else setForm({ id: genId(), apartmentId: selectedApartment || 'genziana', guestId: '', guestName: '', guestEmail: '', guestPhone: '', checkIn: selectedDate || '', checkOut: '', guests: 1, status: 'pending', notes: '' });
  }, [booking, selectedApartment, selectedDate, isOpen]);

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
          <Select label="Appartamento" value={form.apartmentId} onChange={e => setForm(f => ({ ...f, apartmentId: e.target.value }))} options={APARTMENTS.map(a => ({ value: a.id, label: a.name }))} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Seleziona Ospite</label>
            <select value={form.guestId || ''} onChange={e => { const g = guests.find(x => x.id === e.target.value); if (g) setForm(f => ({ ...f, guestId: g.id, guestName: g.name, guestEmail: g.email || '', guestPhone: g.phone || '' })); else setForm(f => ({ ...f, guestId: '' })); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white">
              <option value="">-- Nuovo Ospite --</option>
              {guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          {!form.guestId && (
            <div className="grid grid-cols-1 gap-4 p-4 bg-slate-50 rounded-xl">
              <Input label="Nome Ospite" value={form.guestName} onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Email" type="email" value={form.guestEmail} onChange={e => setForm(f => ({ ...f, guestEmail: e.target.value }))} />
                <Input label="Telefono" type="tel" value={form.guestPhone} onChange={e => setForm(f => ({ ...f, guestPhone: e.target.value }))} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Check-in" type="date" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} required />
            <Input label="Check-out" type="date" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Ospiti" value={form.guests} onChange={e => setForm(f => ({ ...f, guests: Number(e.target.value) }))} options={[1, 2, 3, 4, 5, 6].map(n => ({ value: n, label: `${n} ospiti` }))} />
            <Select label="Stato" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} options={[{ value: 'pending', label: 'In attesa' }, { value: 'confirmed', label: 'Confermata' }, { value: 'cancelled', label: 'Cancellata' }]} />
          </div>
          <div className="bg-slate-50 rounded-xl p-4"><p className="text-sm text-slate-500">Notti totali: <span className="font-semibold text-slate-800">{calcNights(form.checkIn, form.checkOut)}</span></p></div>
          <Input label="Note" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="secondary" className="flex-1">Annulla</Button>
            <Button type="submit" variant="primary" className="flex-1"><Icon name="save" size={18} /> Salva</Button>
          </div>
        </form>
      </div>
    </div>
  );
};