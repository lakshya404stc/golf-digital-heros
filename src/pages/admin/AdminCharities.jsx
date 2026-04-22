import { useState } from "react";
import { getCharities, saveCharities } from "../../lib/store";
import { Plus, Edit2, Trash2, X, Check, Image } from "lucide-react";

const CATEGORIES = ["Health", "Education", "Mental Health", "Children", "Environment", "Food Security"];
const EMPTY = { name: "", description: "", image: "", category: "Health", raised: 0, goal: 50000, events: [] };

function CharityModal({ charity, onSave, onClose }) {
  const [form, setForm] = useState(charity ? { ...charity } : { ...EMPTY });
  const [evInput, setEvInput] = useState("");

  const addEvent = () => {
    if (!evInput.trim()) return;
    setForm({ ...form, events: [...(form.events || []), evInput.trim()] });
    setEvInput("");
  };

  const removeEvent = (i) => setForm({ ...form, events: form.events.filter((_, idx) => idx !== i) });

  const save = () => {
    if (!form.name || !form.description) return;
    onSave({ id: charity?.id || "c" + Date.now(), ...form, raised: parseInt(form.raised) || 0, goal: parseInt(form.goal) || 50000 });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4 overflow-y-auto py-8">
      <div className="glass rounded-2xl p-6 w-full max-w-lg border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold">{charity ? "Edit Charity" : "Add Charity"}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Name</label>
            <input placeholder="Charity name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Description</label>
            <textarea rows={3} placeholder="About this charity..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="resize-none" />
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Image URL</label>
            <input placeholder="https://images.unsplash.com/..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Raised (£)</label>
              <input type="number" value={form.raised} onChange={e => setForm({ ...form, raised: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Goal (£)</label>
              <input type="number" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Events</label>
            <div className="flex gap-2 mb-2">
              <input placeholder="e.g. Golf Day – Jun 14" value={evInput} onChange={e => setEvInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addEvent()} />
              <button onClick={addEvent} className="btn-primary px-3 rounded-lg text-sm whitespace-nowrap">Add</button>
            </div>
            <div className="space-y-1">
              {form.events?.map((ev, i) => (
                <div key={i} className="flex items-center justify-between glass rounded-lg px-3 py-1.5 text-sm">
                  <span className="text-white/70">{ev}</span>
                  <button onClick={() => removeEvent(i)} className="text-white/20 hover:text-red-400"><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 glass py-2.5 rounded-xl text-sm">Cancel</button>
          <button onClick={save} className="flex-1 btn-primary py-2.5 rounded-xl text-sm">Save Charity</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCharities() {
  const [charities, setCharities] = useState(() => getCharities());
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const toast = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const save = (charity) => {
    const all = charities.find(c => c.id === charity.id)
      ? charities.map(c => c.id === charity.id ? charity : c)
      : [...charities, charity];
    saveCharities(all);
    setCharities(all);
    setEditing(null);
    setAdding(false);
    toast("Charity saved!");
  };

  const del = (id) => {
    if (!confirm("Delete this charity?")) return;
    const all = charities.filter(c => c.id !== id);
    saveCharities(all);
    setCharities(all);
    toast("Charity deleted.");
  };

  return (
    <div>
      {(editing || adding) && (
        <CharityModal charity={editing} onSave={save} onClose={() => { setEditing(null); setAdding(false); }} />
      )}

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-black">Charity Management</h1>
          <p className="text-white/40 text-sm mt-1">{charities.length} charities listed</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Plus size={15} /> Add Charity
        </button>
      </div>

      {msg && <div className="bg-green-400/10 border border-green-400/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-6">{msg}</div>}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {charities.map(c => {
          const pct = Math.round((c.raised / c.goal) * 100);
          return (
            <div key={c.id} className="glass rounded-2xl overflow-hidden">
              <div className="relative h-36">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center"><Image size={24} className="text-white/20" /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => setEditing(c)} className="glass p-1.5 rounded-lg hover:bg-cyan-400/20 text-white/60 hover:text-cyan-400 transition-all">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => del(c.id)} className="glass p-1.5 rounded-lg hover:bg-red-400/20 text-white/60 hover:text-red-400 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="glass text-xs px-2 py-0.5 rounded-full text-white/60">{c.category}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold mb-1 truncate">{c.name}</h3>
                <p className="text-xs text-white/40 mb-3 line-clamp-2">{c.description}</p>
                <div className="mb-1.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/30">£{c.raised.toLocaleString()} raised</span>
                    <span className="text-green-400">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                {c.events?.length > 0 && (
                  <div className="mt-2 text-xs text-white/30">{c.events.length} event{c.events.length > 1 ? "s" : ""} scheduled</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}