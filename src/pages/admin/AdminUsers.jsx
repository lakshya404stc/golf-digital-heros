import { useState } from "react";
import { getUsers, saveUsers, getCharities } from "../../lib/store";
import { Search, Edit2, Trash2, Check, X, ChevronDown } from "lucide-react";

function EditModal({ user, charities, onSave, onClose }) {
  const [form, setForm] = useState({ name: user.name, plan: user.plan, charityId: user.charityId, charityPct: user.charityPct, planExpiry: user.planExpiry });

  const save = () => onSave({ ...user, ...form });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-6 w-full max-w-md border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold">Edit User</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Plan</label>
            <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Plan Expiry</label>
            <input type="date" value={form.planExpiry} onChange={e => setForm({ ...form, planExpiry: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Charity</label>
            <select value={form.charityId} onChange={e => setForm({ ...form, charityId: e.target.value })}>
              {charities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Charity % ({form.charityPct}%)</label>
            <input type="range" min="10" max="50" value={form.charityPct} onChange={e => setForm({ ...form, charityPct: parseInt(e.target.value) })} className="w-full accent-green-400 bg-transparent border-0 p-0" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 glass py-2.5 rounded-xl text-sm">Cancel</button>
          <button onClick={save} className="flex-1 btn-primary py-2.5 rounded-xl text-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ScoresModal({ user, onSave, onClose }) {
  const [scores, setScores] = useState(user.scores ? [...user.scores] : []);
  const [newScore, setNewScore] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));

  const add = () => {
    const v = parseInt(newScore);
    if (isNaN(v) || v < 1 || v > 45) return;
    const updated = [{ value: v, date: newDate }, ...scores].slice(0, 5);
    setScores(updated);
    setNewScore("");
  };

  const remove = (i) => setScores(scores.filter((_, idx) => idx !== i));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-6 w-full max-w-md border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold">Edit Scores — {user.name}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex gap-2 mb-4">
          <input type="number" min="1" max="45" placeholder="Score (1-45)" value={newScore} onChange={e => setNewScore(e.target.value)} className="flex-1" />
          <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="flex-1" />
          <button onClick={add} className="btn-primary px-3 py-2 rounded-lg text-sm">Add</button>
        </div>
        <div className="space-y-2 mb-6">
          {scores.map((s, i) => (
            <div key={i} className="flex items-center justify-between glass rounded-lg px-3 py-2">
              <div className="text-sm"><span className="font-display font-bold text-green-400">{s.value}</span> pts — {s.date}</div>
              <button onClick={() => remove(i)} className="text-white/30 hover:text-red-400"><X size={14} /></button>
            </div>
          ))}
          {scores.length === 0 && <p className="text-white/30 text-sm text-center py-4">No scores</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 glass py-2.5 rounded-xl text-sm">Cancel</button>
          <button onClick={() => onSave({ ...user, scores })} className="flex-1 btn-primary py-2.5 rounded-xl text-sm">Save Scores</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const charities = getCharities();
  const [users, setUsers] = useState(() => getUsers());
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [scoresUser, setScoresUser] = useState(null);
  const [planFilter, setPlanFilter] = useState("all");

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || u.plan === planFilter;
    return matchSearch && matchPlan;
  });

  const saveUser = (updated) => {
    const all = users.map(u => u.id === updated.id ? updated : u);
    saveUsers(all);
    setUsers(all);
    setEditUser(null);
    setScoresUser(null);
  };

  const deleteUser = (id) => {
    if (!confirm("Delete this user?")) return;
    const all = users.filter(u => u.id !== id);
    saveUsers(all);
    setUsers(all);
  };

  const isActive = (u) => new Date(u.planExpiry) > new Date();

  return (
    <div>
      {editUser && <EditModal user={editUser} charities={charities} onSave={saveUser} onClose={() => setEditUser(null)} />}
      {scoresUser && <ScoresModal user={scoresUser} onSave={saveUser} onClose={() => setScoresUser(null)} />}

      <div className="mb-8">
        <h1 className="font-display text-3xl font-black">User Management</h1>
        <p className="text-white/40 text-sm mt-1">{users.length} total users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value)} className="w-36">
          <option value="all">All Plans</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["User", "Plan", "Status", "Charity", "Scores", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-white/30 uppercase tracking-widest font-display">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const charity = charities.find(c => c.id === u.charityId);
                const active = isActive(u);
                return (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-xs text-white/30">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.plan === "yearly" ? "bg-green-400/15 text-green-400" : "bg-white/10 text-white/50"}`}>{u.plan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${active ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-red-400"}`} />{active ? "Active" : "Lapsed"}
                      </span>
                      <div className="text-xs text-white/20 mt-0.5">exp {u.planExpiry}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/50 max-w-[120px] truncate">{charity?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {u.scores?.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-xs bg-white/8 px-1.5 py-0.5 rounded font-display text-white/60">{s.value}</span>
                        ))}
                        {(u.scores?.length || 0) > 3 && <span className="text-xs text-white/30">+{u.scores.length - 3}</span>}
                        {!u.scores?.length && <span className="text-xs text-white/20">none</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditUser(u)} className="text-white/40 hover:text-cyan-400 transition-colors" title="Edit user"><Edit2 size={14} /></button>
                        <button onClick={() => setScoresUser(u)} className="text-white/40 hover:text-green-400 transition-colors text-xs border border-white/10 px-2 py-0.5 rounded">Scores</button>
                        <button onClick={() => deleteUser(u.id)} className="text-white/40 hover:text-red-400 transition-colors" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-white/30 py-10">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}