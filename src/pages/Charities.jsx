import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCharities } from "../lib/store";
import { Search, Heart, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Health", "Education", "Mental Health", "Children", "Environment", "Food Security"];

export default function Charities() {
  const charities = getCharities();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = charities.filter(c => {
    const matchCat = cat === "All" || c.category === cat;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalRaised = charities.reduce((a, c) => a + c.raised, 0);

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-400/10 text-red-400 px-3 py-1 rounded-full text-xs font-display font-semibold uppercase tracking-widest mb-6">
            <Heart size={12} /> Charities We Support
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black mb-4">Where Your Money Goes</h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">Every subscription automatically contributes to your chosen charity. <strong className="text-white">£{totalRaised.toLocaleString()}</strong> raised so far.</p>
        </div>

        {/* Featured charity */}
        <div className="glass rounded-3xl overflow-hidden mb-12 border border-red-400/10">
          <div className="grid md:grid-cols-2">
            <img src={charities[0]?.image} alt="featured" className="w-full h-64 md:h-full object-cover" />
            <div className="p-8 flex flex-col justify-center">
              <div className="text-xs text-red-400 font-display font-semibold uppercase tracking-widest mb-3">⭐ Spotlight Charity</div>
              <h2 className="font-display text-3xl font-black mb-3">{charities[0]?.name}</h2>
              <p className="text-white/50 mb-6 leading-relaxed">{charities[0]?.description}</p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/40">Progress</span>
                  <span className="text-green-400">£{charities[0]?.raised.toLocaleString()} / £{charities[0]?.goal.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full" style={{ width: `${Math.min(100, (charities[0]?.raised / charities[0]?.goal) * 100)}%` }} />
                </div>
              </div>
              <Link to={`/charities/${charities[0]?.id}`} className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl self-start">
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input placeholder="Search charities..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-lg text-sm font-display font-semibold transition-all ${cat === c ? "bg-green-400 text-black" : "glass text-white/50 hover:text-white"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <Link key={c.id} to={`/charities/${c.id}`} className="glass rounded-2xl overflow-hidden card-hover group">
                <div className="relative overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="glass text-xs px-2 py-1 rounded-full text-white/70">{c.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg mb-2">{c.name}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-4 line-clamp-2">{c.description}</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/30">Raised</span>
                      <span className="text-green-400">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-white/30 mt-2">
                    <span>£{c.raised.toLocaleString()}</span>
                    <span>Goal: £{c.goal.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">No charities match your search.</div>
        )}
      </div>
    </div>
  );
}