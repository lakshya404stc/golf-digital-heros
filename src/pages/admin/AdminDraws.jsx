import { useState } from "react";
import { getDraws, saveDraws, runDrawSim, publishDraw } from "../../lib/store";
import { Zap, Play, CheckCircle, Plus, X, RefreshCw } from "lucide-react";

function AddDrawModal({ onSave, onClose }) {
  const [form, setForm] = useState({ month: "", jackpot: 9600, poolFive: 9600, poolFour: 8400, poolThree: 6000 });
  const save = () => {
    if (!form.month) return;
    onSave({
      id: "d" + Date.now(),
      month: form.month,
      status: "upcoming",
      numbers: [],
      jackpot: parseInt(form.jackpot),
      pool: { five: parseInt(form.poolFive), four: parseInt(form.poolFour), three: parseInt(form.poolThree) },
      winnersRaw: [],
    });
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-6 w-full max-w-md border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold">Add New Draw</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Month (e.g. July 2025)</label>
            <input placeholder="July 2025" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-1.5 block">Jackpot (£)</label>
            <input type="number" value={form.jackpot} onChange={e => setForm({ ...form, jackpot: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-white/40 font-display mb-1 block">5-Match Pool</label>
              <input type="number" value={form.poolFive} onChange={e => setForm({ ...form, poolFive: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-white/40 font-display mb-1 block">4-Match Pool</label>
              <input type="number" value={form.poolFour} onChange={e => setForm({ ...form, poolFour: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-white/40 font-display mb-1 block">3-Match Pool</label>
              <input type="number" value={form.poolThree} onChange={e => setForm({ ...form, poolThree: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 glass py-2.5 rounded-xl text-sm">Cancel</button>
          <button onClick={save} className="flex-1 btn-primary py-2.5 rounded-xl text-sm">Create Draw</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDraws() {
  const [draws, setDraws] = useState(() => getDraws());
  const [mode, setMode] = useState("random");
  const [simulating, setSimulating] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [msg, setMsg] = useState("");

  const toast = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const simulate = (drawId) => {
    setSimulating(drawId);
    setTimeout(() => {
      const updated = runDrawSim(drawId, mode);
      setDraws(getDraws());
      setSimulating(null);
      toast(`Simulation complete for ${updated.month}`);
    }, 1200);
  };

  const publish = (drawId) => {
    publishDraw(drawId);
    setDraws(getDraws());
    toast("Draw published successfully!");
  };

  const deleteDraw = (id) => {
    if (!confirm("Delete this draw?")) return;
    const updated = draws.filter(d => d.id !== id);
    saveDraws(updated);
    setDraws(updated);
  };

  const addDraw = (draw) => {
    const all = [...draws, draw];
    saveDraws(all);
    setDraws(all);
    setShowAdd(false);
    toast("Draw created!");
  };

  const STATUS_COLOR = {
    upcoming: "bg-white/10 text-white/50",
    simulation: "bg-yellow-400/15 text-yellow-400",
    published: "bg-green-400/15 text-green-400",
  };

  return (
    <div>
      {showAdd && <AddDrawModal onSave={addDraw} onClose={() => setShowAdd(false)} />}

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-black">Draw Management</h1>
          <p className="text-white/40 text-sm mt-1">Configure, simulate, and publish monthly draws</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Plus size={15} /> New Draw
        </button>
      </div>

      {msg && <div className="bg-green-400/10 border border-green-400/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-6">{msg}</div>}

      {/* Draw mode selector */}
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="font-display font-bold mb-3 text-sm">Draw Engine Mode</h2>
        <div className="flex gap-3">
          {[
            { id: "random", label: "🎲 Random", desc: "Standard lottery-style random draw" },
            { id: "weighted", label: "⚖️ Weighted", desc: "Algorithmic — based on most frequent user scores" },
          ].map(({ id, label, desc }) => (
            <button key={id} onClick={() => setMode(id)} className={`flex-1 p-4 rounded-xl border text-left transition-all ${mode === id ? "border-green-400 bg-green-400/10" : "border-white/10 hover:border-white/20"}`}>
              <div className="font-display font-bold text-sm mb-1">{label}</div>
              <div className="text-xs text-white/40">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Draw cards */}
      <div className="space-y-4">
        {draws.map(draw => (
          <div key={draw.id} className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display text-xl font-bold">{draw.month}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[draw.status]}`}>{draw.status}</span>
                </div>
                <div className="text-sm text-white/40">Jackpot: <span className="text-white font-semibold">£{draw.jackpot.toLocaleString()}</span></div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {draw.status !== "published" && (
                  <button onClick={() => simulate(draw.id)} disabled={simulating === draw.id} className="flex items-center gap-2 glass px-4 py-2 rounded-lg text-sm border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10 transition-all disabled:opacity-50">
                    {simulating === draw.id ? <><RefreshCw size={14} className="animate-spin" /> Simulating…</> : <><Play size={14} /> Simulate</>}
                  </button>
                )}
                {draw.status === "simulation" && (
                  <button onClick={() => publish(draw.id)} className="flex items-center gap-2 btn-primary px-4 py-2 rounded-lg text-sm">
                    <CheckCircle size={14} /> Publish
                  </button>
                )}
                <button onClick={() => deleteDraw(draw.id)} className="text-white/20 hover:text-red-400 transition-colors px-2">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Prize pools */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "5-Match Jackpot", val: draw.pool?.five },
                { label: "4-Match", val: draw.pool?.four },
                { label: "3-Match", val: draw.pool?.three },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white/4 rounded-xl p-3 text-center">
                  <div className="font-display font-bold text-sm">£{val?.toLocaleString() || 0}</div>
                  <div className="text-xs text-white/30 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Numbers */}
            {draw.numbers?.length > 0 ? (
              <div>
                <p className="text-xs text-white/30 uppercase tracking-widest font-display mb-3">
                  {draw.status === "simulation" ? "Simulated Numbers (not published)" : "Winning Numbers"}
                </p>
                <div className="flex gap-3 flex-wrap">
                  {draw.numbers.map((n, i) => (
                    <div key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-lg ${draw.status === "published" ? "bg-green-400/20 text-green-400 border border-green-400/30" : "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"}`}>
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-white/20 text-sm">No numbers drawn yet. Run a simulation first.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}