import { useState } from "react";
import { getTotals, getDraws, getUsers, getCharities } from "../../lib/store";
import { Users, Trophy, Heart, TrendingUp, Activity, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [totals] = useState(() => getTotals());
  const [draws] = useState(() => getDraws());
  const [users] = useState(() => getUsers());
  const [charities] = useState(() => getCharities());

  const upcoming = draws.find(d => d.status === "upcoming");
  const recentUsers = [...users].reverse().slice(0, 5);

  const CARDS = [
    { label: "Total Users", value: totals.totalUsers, icon: Users, color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20" },
    { label: "Total Prize Pool", value: `£${totals.totalPool.toLocaleString()}`, icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
    { label: "Charity Contributions", value: `£${totals.charityTotal.toFixed(2)}`, icon: Heart, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
    { label: "Total Draws", value: totals.totalDraws, icon: Activity, color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black">Overview</h1>
        <p className="text-white/40 text-sm mt-1">Platform snapshot — all live data from localStorage</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`glass rounded-2xl p-5 border ${bg}`}>
            <Icon size={20} className={`${color} mb-3`} />
            <div className="font-display text-2xl font-black mb-1">{value}</div>
            <div className="text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming draw */}
        {upcoming && (
          <div className="glass rounded-2xl p-6 border border-cyan-400/20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold">Upcoming Draw</h2>
              <Link to="/admin/draws" className="text-green-400 text-xs flex items-center gap-1 hover:underline">Manage <ArrowUpRight size={12} /></Link>
            </div>
            <div className="font-display text-2xl font-black mb-4">{upcoming.month}</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { l: "Jackpot", v: `£${upcoming.pool.five.toLocaleString()}` },
                { l: "4-Match", v: `£${upcoming.pool.four.toLocaleString()}` },
                { l: "3-Match", v: `£${upcoming.pool.three.toLocaleString()}` },
              ].map(({ l, v }) => (
                <div key={l} className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="font-display font-bold text-sm">{v}</div>
                  <div className="text-xs text-white/30 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
            <Link to="/admin/draws" className="btn-primary w-full text-center py-2.5 rounded-xl text-sm mt-5 block">Run Draw →</Link>
          </div>
        )}

        {/* Recent users */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold">Recent Users</h2>
            <Link to="/admin/users" className="text-green-400 text-xs flex items-center gap-1 hover:underline">All users <ArrowUpRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map(u => {
              const charity = charities.find(c => c.id === u.charityId);
              return (
                <div key={u.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="font-semibold text-sm">{u.name}</div>
                    <div className="text-xs text-white/30">{u.email}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.plan === "yearly" ? "bg-green-400/15 text-green-400" : "bg-white/10 text-white/50"}`}>{u.plan}</span>
                    <div className="text-xs text-white/30 mt-1">{charity?.name?.slice(0, 16) || "—"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charity breakdown */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold">Charity Breakdown</h2>
            <Link to="/admin/charities" className="text-green-400 text-xs flex items-center gap-1 hover:underline">Manage <ArrowUpRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {charities.map(c => {
              const pct = Math.round((c.raised / c.goal) * 100);
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70 truncate max-w-[60%]">{c.name}</span>
                    <span className="text-green-400">£{c.raised.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Draw history */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold">Draw History</h2>
          </div>
          <div className="space-y-3">
            {draws.map(d => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <div className="font-semibold text-sm">{d.month}</div>
                  <div className="flex gap-1 mt-1">
                    {d.numbers?.length > 0 ? d.numbers.map((n, i) => (
                      <span key={i} className="text-xs bg-green-400/15 text-green-400 px-1.5 py-0.5 rounded font-display">{n}</span>
                    )) : <span className="text-xs text-white/20">No numbers drawn</span>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${d.status === "published" ? "bg-green-400/15 text-green-400" : d.status === "simulation" ? "bg-yellow-400/15 text-yellow-400" : "bg-white/10 text-white/40"}`}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}