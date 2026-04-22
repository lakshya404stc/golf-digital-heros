import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, getCharities } from "../lib/store";
import { useAuth } from "../context/AuthContext";
import { Trophy, Check } from "lucide-react";

const PLANS = [
  { id: "monthly", label: "Monthly", price: "£9.99", period: "/mo", sub: "Billed monthly", pool: "£4/mo to prize pool", charity: "£1/mo to charity" },
  { id: "yearly", label: "Yearly", price: "£99", period: "/yr", sub: "Save 17%", pool: "£48/yr to prize pool", charity: "£9.90/yr to charity", badge: "Best Value" },
];

export default function Register() {
  const charities = getCharities();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", plan: "monthly", charityId: "c1" });
  const [error, setError] = useState("");
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const next = () => { setError(""); setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const submit = () => {
    if (!form.name || !form.email || !form.password) return setError("All fields required.");
    if (form.password.length < 6) return setError("Password must be 6+ characters.");
    const res = register(form);
    if (res.error) return setError(res.error);
    refresh();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center px-4 py-16">
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-400/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center"><Trophy size={16} /></div>
          <span className="font-display font-black text-xl">GolfDraws</span>
        </Link>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex items-center gap-2 ${s < step ? "text-green-400" : s === step ? "text-white" : "text-white/20"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold border ${s < step ? "bg-green-400 border-green-400 text-black" : s === step ? "border-white" : "border-white/20"}`}>
                {s < step ? <Check size={12} /> : s}
              </div>
              <span className="text-xs hidden sm:block">{["Account", "Choose Plan", "Charity"][s - 1]}</span>
              {s < 3 && <div className="w-8 h-px bg-white/10 ml-2" />}
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}

          {/* Step 1: Account */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-3xl font-black mb-6">Create account</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">Full Name</label>
                  <input placeholder="Alex Morgan" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">Email</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">Password</label>
                  <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
              </div>
              <button onClick={next} disabled={!form.name || !form.email || !form.password} className="btn-primary w-full py-3 rounded-xl mt-6 disabled:opacity-40">Continue</button>
            </div>
          )}

          {/* Step 2: Plan */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-3xl font-black mb-6">Choose your plan</h2>
              <div className="space-y-4">
                {PLANS.map(p => (
                  <button key={p.id} onClick={() => setForm({ ...form, plan: p.id })} className={`w-full text-left p-5 rounded-xl border transition-all ${form.plan === p.id ? "border-green-400 bg-green-400/10" : "border-white/10 hover:border-white/20"}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-display font-bold text-lg flex items-center gap-2">
                          {p.label}
                          {p.badge && <span className="text-xs bg-green-400/20 text-green-400 px-2 py-0.5 rounded-full">{p.badge}</span>}
                        </div>
                        <div className="text-white/40 text-xs mt-1">{p.sub}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-display font-black text-2xl">{p.price}</span>
                        <span className="text-white/40 text-sm">{p.period}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-white/40">
                      <span>🏆 {p.pool}</span>
                      <span>❤️ {p.charity}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={back} className="flex-1 glass py-3 rounded-xl text-sm">Back</button>
                <button onClick={next} className="flex-1 btn-primary py-3 rounded-xl text-sm">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Charity */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-3xl font-black mb-2">Support a charity</h2>
              <p className="text-white/40 text-sm mb-6">10% of your subscription goes to your chosen charity. You can change this later.</p>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {charities.map(c => (
                  <button key={c.id} onClick={() => setForm({ ...form, charityId: c.id })} className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${form.charityId === c.id ? "border-green-400 bg-green-400/10" : "border-white/10 hover:border-white/20"}`}>
                    <img src={c.image} alt={c.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-sm truncate">{c.name}</div>
                      <div className="text-xs text-white/40">{c.category}</div>
                    </div>
                    {form.charityId === c.id && <Check size={16} className="ml-auto text-green-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={back} className="flex-1 glass py-3 rounded-xl text-sm">Back</button>
                <button onClick={submit} className="flex-1 btn-primary py-3 rounded-xl text-sm">Complete Signup →</button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-white/40">
          Already subscribed? <Link to="/login" className="text-green-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}