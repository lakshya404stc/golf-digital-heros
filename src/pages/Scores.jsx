import { useState } from "react";
import Navbar from "../components/Navbar";
import { getCurrentUser, addScore } from "../lib/store";
import { Plus, Info } from "lucide-react";

export default function Scores() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [score, setScore] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const val = parseInt(score);
    if (isNaN(val) || val < 1 || val > 45) return setError("Score must be between 1 and 45.");
    const updated = addScore(user.id, val, date);
    setUser(updated);
    setScore("");
    setMsg("Score added successfully!");
    setError("");
    setTimeout(() => setMsg(""), 3000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-display text-4xl font-black mb-2">My Scores</h1>
        <p className="text-white/40 mb-10">Your 5 most recent Stableford scores. They become your monthly draw numbers.</p>

        {/* Add score */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-bold mb-5">Add New Score</h2>
          {msg && <div className="bg-green-400/10 border border-green-400/20 text-green-400 text-sm rounded-lg px-4 py-3 mb-4">{msg}</div>}
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">Stableford Score (1–45)</label>
              <input type="number" min="1" max="45" placeholder="e.g. 32" value={score} onChange={e => setScore(e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">Date Played</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap">
                <Plus size={16} /> Add Score
              </button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="flex items-start gap-3 bg-cyan-400/5 border border-cyan-400/20 rounded-xl p-4 mb-8 text-sm text-white/50">
          <Info size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
          <p>Only your <strong className="text-white">5 most recent</strong> scores are kept. Adding a 6th automatically removes your oldest. These scores form your draw entry numbers.</p>
        </div>

        {/* Score list */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl font-bold mb-5">Score History</h2>
          {!user.scores?.length ? (
            <p className="text-white/30 text-center py-8">No scores yet. Add your first score above.</p>
          ) : (
            <div className="space-y-3">
              {user.scores.map((s, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${i === 0 ? "border-green-400/30 bg-green-400/5" : "border-white/5 bg-white/2"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-lg ${i === 0 ? "bg-green-400/20 text-green-400" : "bg-white/8 text-white/70"}`}>
                      {s.value}
                    </div>
                    <div>
                      <div className="font-display font-bold">{s.value} Stableford points</div>
                      <div className="text-sm text-white/30">{s.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {i === 0 && <span className="text-xs bg-green-400/20 text-green-400 px-3 py-1 rounded-full">Latest</span>}
                    <div className="text-xs text-white/20 mt-1">Score #{i + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Draw numbers visual */}
        {user.scores?.length > 0 && (
          <div className="mt-8 glass rounded-2xl p-6 text-center">
            <p className="text-xs text-white/40 uppercase tracking-widest font-display mb-4">Your Draw Numbers</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {user.scores.map((s, i) => (
                <div key={i} className="w-14 h-14 rounded-xl glass border border-green-400/30 flex items-center justify-center font-display font-black text-xl text-green-400">
                  {s.value}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/30 mt-4">These numbers are used in the monthly draw</p>
          </div>
        )}
      </div>
    </div>
  );
}