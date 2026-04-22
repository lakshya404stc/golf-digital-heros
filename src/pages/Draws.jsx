import Navbar from "../components/Navbar";
import { getDraws } from "../lib/store";
import { Trophy, Clock, Zap } from "lucide-react";

export default function Draws() {
  const draws = getDraws();
  const upcoming = draws.find(d => d.status === "upcoming");
  const past = draws.filter(d => d.status === "published");

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-white/60 mb-6">
            <Zap size={14} className="text-yellow-400" /> Monthly draws — algorithm or random
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black mb-4">The Draw System</h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">Your 5 Stableford scores become your lottery numbers. Each month, 5 numbers are drawn. Match them, win prizes.</p>
        </div>

        {/* How draw works */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {[
            { icon: "🎯", title: "5-Number Match", desc: "Jackpot — 40% of prize pool. Rolls over if unclaimed.", color: "from-green-400/20 to-cyan-400/10", border: "border-green-400/30" },
            { icon: "⚡", title: "4-Number Match", desc: "Major prize — 35% of prize pool. Split among winners.", color: "from-cyan-400/20 to-indigo-400/10", border: "border-cyan-400/30" },
            { icon: "✨", title: "3-Number Match", desc: "Prize — 25% of pool. Always paid, never rolls over.", color: "from-indigo-400/20 to-purple-400/10", border: "border-indigo-400/30" },
          ].map(({ icon, title, desc, color, border }) => (
            <div key={title} className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 text-center`}>
              <div className="text-3xl mb-3">{icon}</div>
              <div className="font-display font-bold text-lg mb-2">{title}</div>
              <div className="text-white/50 text-sm">{desc}</div>
            </div>
          ))}
        </div>

        {/* Upcoming draw */}
        {upcoming && (
          <div className="glass rounded-3xl p-8 mb-10 border border-cyan-400/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-cyan-400" />
                <span className="text-xs text-cyan-400 uppercase tracking-widest font-display font-semibold">Next Draw</span>
              </div>
              <h2 className="font-display text-3xl font-black mb-6">{upcoming.month}</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Jackpot Pool", val: `£${upcoming.pool.five.toLocaleString()}` },
                  { label: "4-Match Pool", val: `£${upcoming.pool.four.toLocaleString()}` },
                  { label: "3-Match Pool", val: `£${upcoming.pool.three.toLocaleString()}` },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="font-display text-2xl font-black text-white mb-1">{val}</div>
                    <div className="text-xs text-white/30">{label}</div>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-sm">Subscribe to enter. Your 5 most recent Stableford scores become your entry numbers. Draw runs at end of month.</p>
            </div>
          </div>
        )}

        {/* Past draws */}
        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy size={20} className="text-yellow-400" /> Past Draws
        </h2>
        <div className="space-y-4">
          {past.map(draw => (
            <div key={draw.id} className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold">{draw.month}</h3>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Published</span>
                </div>
                <div className="text-right">
                  <div className="text-white/40 text-xs">Jackpot</div>
                  <div className="font-display font-bold text-lg">£{draw.jackpot.toLocaleString()}</div>
                </div>
              </div>
              {draw.numbers?.length > 0 ? (
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-widest font-display mb-3">Winning Numbers</p>
                  <div className="flex gap-3 flex-wrap">
                    {draw.numbers.map((n, i) => (
                      <div key={i} className="w-12 h-12 rounded-xl glass border border-green-400/30 flex items-center justify-center font-display font-black text-lg text-green-400">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-white/30 text-sm">No numbers drawn yet.</p>
              )}
            </div>
          ))}
        </div>

        {past.length === 0 && (
          <div className="text-center py-16 text-white/30">No completed draws yet. Check back after the first monthly draw.</div>
        )}
      </div>
    </div>
  );
}