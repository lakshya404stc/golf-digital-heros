import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowRight, Heart, Trophy, Zap, Star, TrendingUp, Users, Globe } from "lucide-react";

const STATS = [
  { label: "Active Subscribers", value: "2,841", icon: Users },
  { label: "Prize Pool This Month", value: "£24,000", icon: Trophy },
  { label: "Donated to Charities", value: "£86,200", icon: Heart },
  { label: "Charities Supported", value: "6", icon: Globe },
];

const HOW = [
  { step: "01", title: "Subscribe", desc: "Choose monthly or yearly. A slice goes straight to your chosen charity — automatically." },
  { step: "02", title: "Enter Your Scores", desc: "Log your last 5 Stableford scores. Your numbers become your draw entries." },
  { step: "03", title: "Win & Give", desc: "Monthly draws award cash prizes. Miss the jackpot? Your contribution still changes lives." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/8 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-white/60 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            June 2025 draw — £24,000 prize pool open now
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-6 tracking-tight">
            Play golf.<br />
            <span className="gradient-text">Win big.</span><br />
            Change lives.
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            GolfDraws is the platform where your Stableford scores become lottery numbers — and every subscription powers a charity you believe in.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-4 rounded-xl text-base flex items-center gap-2 glow-green">
              Start Subscribing <ArrowRight size={18} />
            </Link>
            <Link to="/draws" className="glass px-8 py-4 rounded-xl text-base text-white/70 hover:text-white transition-colors">
              See How Draws Work
            </Link>
          </div>

          {/* Floating score numbers */}
          <div className="mt-16 flex items-center justify-center gap-3 flex-wrap">
            {[12, 27, 8, 34, 19].map((n, i) => (
              <div key={i} className="w-14 h-14 glass rounded-xl flex items-center justify-center text-xl font-display font-bold text-green-400 glow-green">
                {n}
              </div>
            ))}
            <span className="text-white/30 text-sm ml-2">← last month's winning numbers</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-2xl p-6 text-center card-hover">
              <Icon size={24} className="text-green-400 mx-auto mb-3" />
              <div className="font-display text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-sm text-white/40">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-green-400 text-sm font-display font-semibold uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="font-display text-4xl md:text-5xl font-black">Simple. Powerful. Purposeful.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {HOW.map(({ step, title, desc }) => (
            <div key={step} className="glass rounded-2xl p-8 relative overflow-hidden card-hover">
              <div className="font-display text-6xl font-black text-white/5 absolute -top-2 -right-2">{step}</div>
              <div className="relative">
                <div className="text-green-400 font-display text-sm font-semibold mb-4">{step}</div>
                <h3 className="font-display text-2xl font-bold mb-3">{title}</h3>
                <p className="text-white/50 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prize tiers */}
      <section className="py-24 bg-[#0a0e18] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-display font-semibold uppercase tracking-widest mb-3">Prize Structure</p>
            <h2 className="font-display text-4xl md:text-5xl font-black">Three Ways to Win</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { match: "5-Number Match", pct: "40%", label: "Jackpot", color: "from-green-400/20 to-cyan-400/20", border: "border-green-400/30", rollover: true },
              { match: "4-Number Match", pct: "35%", label: "Major Prize", color: "from-cyan-400/20 to-indigo-400/20", border: "border-cyan-400/30", rollover: false },
              { match: "3-Number Match", pct: "25%", label: "Prize", color: "from-indigo-400/20 to-purple-400/20", border: "border-indigo-400/30", rollover: false },
            ].map(({ match, pct, label, color, border, rollover }) => (
              <div key={match} className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-8 text-center card-hover`}>
                <div className="font-display text-5xl font-black text-white mb-2">{pct}</div>
                <div className="text-white/60 text-sm mb-4">of prize pool</div>
                <div className="font-display text-xl font-bold mb-2">{match}</div>
                <div className="text-sm text-white/40">{label}</div>
                {rollover && <div className="mt-4 inline-block bg-green-400/20 text-green-400 text-xs px-3 py-1 rounded-full">Jackpot Rolls Over</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured charity */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-400/10 text-red-400 px-3 py-1 rounded-full text-xs font-display font-semibold uppercase tracking-widest mb-6">
              <Heart size={12} /> Featured Charity
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-6">Birdies for Blindness</h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              Every subscription contributes to funding sight-saving surgeries across South Asia. 10% of your plan fee goes directly — and you can choose to give more.
            </p>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/40">Raised so far</span>
                <span className="text-green-400 font-semibold">£84,200 / £120,000</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full" style={{ width: "70%" }} />
              </div>
            </div>
            <Link to="/charities" className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2">
              Explore All Charities <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600" alt="charity" className="rounded-2xl object-cover w-full h-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] to-transparent rounded-2xl" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-cyan-400/10" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-6xl font-black mb-6">Ready to play with purpose?</h2>
          <p className="text-white/50 text-lg mb-10">Join 2,841 subscribers who are winning prizes and changing lives — one score at a time.</p>
          <Link to="/register" className="btn-primary px-10 py-5 rounded-xl text-lg inline-flex items-center gap-3 glow-green">
            Get Started — From £9.99/mo <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-white/30 text-sm">
        <div className="font-display font-bold text-white mb-2">GolfDraws</div>
        <p>© 2025 GolfDraws. Play responsibly. 18+.</p>
      </footer>
    </div>
  );
}