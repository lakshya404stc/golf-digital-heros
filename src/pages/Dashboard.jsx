import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCurrentUser, getCharities, getDraws } from "../lib/store";
import { Trophy, Heart, Calendar, TrendingUp, Clock, ArrowRight, Star } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(() => getCurrentUser());
  const charities = getCharities();
  const draws = getDraws();

  if (!user) return null;

  const charity = charities.find(c => c.id === user.charityId);
  const planAmt = user.plan === "yearly" ? 99 : 9.99;
  const charityAmt = (planAmt * user.charityPct / 100).toFixed(2);
  const upcomingDraw = draws.find(d => d.status === "upcoming");
  const pastDraws = draws.filter(d => d.status === "published");
  const isActive = new Date(user.planExpiry) > new Date();

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-white/40 text-sm mb-1">Welcome back,</p>
          <h1 className="font-display text-4xl font-black">{user.name}</h1>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Subscription status */}
          <div className={`glass rounded-2xl p-5 border ${isActive ? "border-green-400/30" : "border-red-400/30"}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
              <span className="text-xs text-white/40 uppercase tracking-widest font-display">Subscription</span>
            </div>
            <div className={`font-display text-xl font-bold ${isActive ? "text-green-400" : "text-red-400"}`}>{isActive ? "Active" : "Lapsed"}</div>
            <div className="text-xs text-white/30 mt-1">{user.plan} · expires {user.planExpiry}</div>
          </div>

          {/* Prize pool */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={14} className="text-yellow-400" />
              <span className="text-xs text-white/40 uppercase tracking-widest font-display">Total Won</span>
            </div>
            <div className="font-display text-xl font-bold">£{user.totalWon.toLocaleString()}</div>
            <div className="text-xs text-white/30 mt-1">{user.paymentStatus === "paid" ? "Paid out" : user.paymentStatus === "pending" ? "Pending verification" : "No wins yet"}</div>
          </div>

          {/* Charity */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={14} className="text-red-400" />
              <span className="text-xs text-white/40 uppercase tracking-widest font-display">Charity</span>
            </div>
            <div className="font-display text-sm font-bold truncate">{charity?.name || "—"}</div>
            <div className="text-xs text-white/30 mt-1">£{charityAmt}/mo contribution</div>
          </div>

          {/* Draws entered */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-cyan-400" />
              <span className="text-xs text-white/40 uppercase tracking-widest font-display">Draws Entered</span>
            </div>
            <div className="font-display text-xl font-bold">{user.drawsEntered?.length || 0}</div>
            <div className="text-xs text-white/30 mt-1">across all months</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scores */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">My Scores</h2>
              <Link to="/scores" className="text-green-400 text-sm flex items-center gap-1 hover:underline">
                Add Score <ArrowRight size={14} />
              </Link>
            </div>

            {user.scores?.length === 0 ? (
              <div className="text-center py-10">
                <TrendingUp size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No scores yet. Enter your first Stableford score.</p>
                <Link to="/scores" className="btn-primary inline-flex px-5 py-2 rounded-lg text-sm mt-4">Add Score</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.scores.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm ${i === 0 ? "bg-green-400/20 text-green-400 border border-green-400/30" : "bg-white/5 text-white/60"}`}>
                        {s.value}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{s.value} pts</div>
                        <div className="text-xs text-white/30">{s.date}</div>
                      </div>
                    </div>
                    {i === 0 && <span className="text-xs bg-green-400/10 text-green-400 px-2 py-1 rounded-full">Latest</span>}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-white/20 mt-4">Only your 5 most recent scores are kept. They form your draw numbers.</p>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Upcoming draw */}
            {upcomingDraw && (
              <div className="glass rounded-2xl p-6 border border-cyan-400/20">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-cyan-400" />
                  <span className="text-xs text-white/40 uppercase tracking-widest font-display">Upcoming Draw</span>
                </div>
                <div className="font-display text-2xl font-black mb-1">{upcomingDraw.month}</div>
                <div className="text-white/40 text-sm mb-4">Prize pool: <span className="text-white font-semibold">£{upcomingDraw.jackpot.toLocaleString()}</span></div>
                <div className="grid grid-cols-3 gap-2 text-xs text-white/40">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="font-display font-bold text-white text-sm">{upcomingDraw.pool.five.toLocaleString()}</div>
                    <div>Jackpot</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="font-display font-bold text-white text-sm">{upcomingDraw.pool.four.toLocaleString()}</div>
                    <div>4-Match</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="font-display font-bold text-white text-sm">{upcomingDraw.pool.three.toLocaleString()}</div>
                    <div>3-Match</div>
                  </div>
                </div>
              </div>
            )}

            {/* Charity card */}
            {charity && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart size={16} className="text-red-400" />
                  <span className="text-xs text-white/40 uppercase tracking-widest font-display">Your Charity</span>
                </div>
                <img src={charity.image} className="w-full h-28 object-cover rounded-xl mb-4" alt={charity.name} />
                <div className="font-display font-bold mb-1">{charity.name}</div>
                <div className="text-xs text-white/40 mb-3">{charity.description.slice(0, 80)}…</div>
                <div className="flex justify-between text-xs text-white/30">
                  <span>Your contribution</span>
                  <span className="text-green-400">£{charityAmt}</span>
                </div>
                <Link to="/profile" className="text-xs text-white/30 hover:text-green-400 block mt-2">Change charity →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}