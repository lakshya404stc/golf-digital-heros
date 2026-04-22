import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCharities } from "../lib/store";
import { ArrowLeft, Heart, Calendar, ExternalLink } from "lucide-react";

export default function CharityDetail() {
  const { id } = useParams();
  const charity = getCharities().find(c => c.id === id);

  if (!charity) return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/40 mb-4">Charity not found</p>
        <Link to="/charities" className="text-green-400 hover:underline">← Back to charities</Link>
      </div>
    </div>
  );

  const pct = Math.min(100, Math.round((charity.raised / charity.goal) * 100));

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <Link to="/charities" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to charities
        </Link>

        {/* Hero image */}
        <div className="relative rounded-3xl overflow-hidden mb-10 h-72">
          <img src={charity.image} alt={charity.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="glass text-xs px-3 py-1 rounded-full text-white/70 mb-3 inline-block">{charity.category}</span>
            <h1 className="font-display text-4xl font-black">{charity.name}</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold mb-4">About</h2>
              <p className="text-white/60 leading-relaxed">{charity.description}</p>
              <p className="text-white/40 leading-relaxed mt-4">
                GolfDraws partners with {charity.name} to ensure that a percentage of every subscriber's plan fee goes directly to supporting this cause. Contributions are pooled monthly and transferred in full.
              </p>
            </div>

            {/* Events */}
            {charity.events?.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-cyan-400" /> Upcoming Events
                </h2>
                <div className="space-y-3">
                  {charity.events.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Progress */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart size={16} className="text-red-400" />
                <span className="font-display font-bold text-sm">Fundraising Progress</span>
              </div>
              <div className="font-display text-3xl font-black text-green-400 mb-1">£{charity.raised.toLocaleString()}</div>
              <div className="text-white/30 text-sm mb-4">of £{charity.goal.toLocaleString()} goal</div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-white/30">{pct}% funded</div>
            </div>

            {/* CTA */}
            <div className="glass rounded-2xl p-6 border border-green-400/20">
              <p className="text-sm text-white/60 mb-4">Subscribe to GolfDraws and automatically contribute to {charity.name} every month.</p>
              <Link to="/register" className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                Subscribe & Support <Heart size={14} />
              </Link>
            </div>

            {/* Stats */}
            <div className="glass rounded-2xl p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Category</span>
                  <span className="font-semibold">{charity.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Min contribution</span>
                  <span className="font-semibold">10% of plan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Events scheduled</span>
                  <span className="font-semibold">{charity.events?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}