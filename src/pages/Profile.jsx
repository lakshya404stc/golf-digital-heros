import { useState } from "react";
import Navbar from "../components/Navbar";
import { getCurrentUser, getCharities, updateUser } from "../lib/store";
import { User, Heart, CreditCard, Upload, Check } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(() => getCurrentUser());
  const charities = getCharities();
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({ name: user?.name || "", charityId: user?.charityId || "c1", charityPct: user?.charityPct || 10 });
  const [msg, setMsg] = useState("");
  const [proofFile, setProofFile] = useState(null);

  if (!user) return null;

  const save = () => {
    const updated = updateUser(user.id, form);
    setUser(updated);
    setMsg("Saved successfully!");
    setTimeout(() => setMsg(""), 3000);
  };

  const uploadProof = () => {
    if (!proofFile) return;
    updateUser(user.id, { proofUploaded: true, paymentStatus: "pending" });
    setUser(getCurrentUser());
    setMsg("Proof uploaded! Under review.");
    setTimeout(() => setMsg(""), 4000);
  };

  const charity = charities.find(c => c.id === user.charityId);
  const planAmt = user.plan === "yearly" ? 99 : 9.99;

  const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "charity", label: "Charity", icon: Heart },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "proof", label: "Winner Proof", icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-display text-4xl font-black mb-8">Account Settings</h1>

        {msg && <div className="bg-green-400/10 border border-green-400/20 text-green-400 text-sm rounded-lg px-4 py-3 mb-6">{msg}</div>}

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-xl p-1 mb-8 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-display font-semibold transition-all whitespace-nowrap ${tab === id ? "bg-green-400 text-black" : "text-white/50 hover:text-white"}`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === "profile" && (
          <div className="glass rounded-2xl p-6 space-y-5">
            <h2 className="font-display text-xl font-bold">Personal Info</h2>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">Email</label>
              <input value={user.email} disabled className="opacity-50 cursor-not-allowed" />
            </div>
            <button onClick={save} className="btn-primary px-6 py-2.5 rounded-xl text-sm">Save Changes</button>
          </div>
        )}

        {/* Charity tab */}
        {tab === "charity" && (
          <div className="glass rounded-2xl p-6 space-y-6">
            <h2 className="font-display text-xl font-bold">Charity Preferences</h2>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-3 block">Select Charity</label>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {charities.map(c => (
                  <button key={c.id} onClick={() => setForm({ ...form, charityId: c.id })} className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${form.charityId === c.id ? "border-green-400 bg-green-400/10" : "border-white/10 hover:border-white/20"}`}>
                    <img src={c.image} alt={c.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <div className="font-display font-semibold text-sm">{c.name}</div>
                      <div className="text-xs text-white/40">{c.category}</div>
                    </div>
                    {form.charityId === c.id && <Check size={16} className="ml-auto text-green-400" />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">
                Contribution: <span className="text-green-400">{form.charityPct}%</span> = £{(planAmt * form.charityPct / 100).toFixed(2)}
              </label>
              <input type="range" min="10" max="50" value={form.charityPct} onChange={e => setForm({ ...form, charityPct: parseInt(e.target.value) })} className="w-full accent-green-400 bg-transparent border-0 p-0" />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>Min 10%</span><span>Max 50%</span>
              </div>
            </div>
            <button onClick={save} className="btn-primary px-6 py-2.5 rounded-xl text-sm">Save Preferences</button>
          </div>
        )}

        {/* Subscription tab */}
        {tab === "subscription" && (
          <div className="glass rounded-2xl p-6 space-y-6">
            <h2 className="font-display text-xl font-bold">Subscription Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Plan", value: user.plan === "yearly" ? "Yearly (£99/yr)" : "Monthly (£9.99/mo)" },
                { label: "Status", value: new Date(user.planExpiry) > new Date() ? "Active" : "Lapsed" },
                { label: "Expires", value: user.planExpiry },
                { label: "Charity %", value: `${user.charityPct}%` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/4 rounded-xl p-4">
                  <div className="text-xs text-white/30 mb-1 font-display uppercase tracking-widest">{label}</div>
                  <div className="font-display font-bold">{value}</div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-sm text-white/40 mb-4">Manage your billing, cancel or upgrade your subscription.</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => { setMsg("Renewal simulated!"); setTimeout(() => setMsg(""), 2000); }} className="btn-primary px-5 py-2 rounded-lg text-sm">Renew Plan</button>
                <button onClick={() => { setMsg("Cancellation request submitted."); setTimeout(() => setMsg(""), 2000); }} className="glass px-5 py-2 rounded-lg text-sm text-red-400 border border-red-400/20">Cancel Plan</button>
              </div>
            </div>
          </div>
        )}

        {/* Winner proof tab */}
        {tab === "proof" && (
          <div className="glass rounded-2xl p-6 space-y-6">
            <h2 className="font-display text-xl font-bold">Winner Verification</h2>
            <div className={`rounded-xl p-4 border text-sm ${user.proofUploaded ? "border-yellow-400/30 bg-yellow-400/5 text-yellow-400" : "border-white/10 text-white/40"}`}>
              Status: <strong>{user.proofUploaded ? "Proof Submitted — Pending Review" : "No proof submitted yet"}</strong>
            </div>
            <p className="text-white/40 text-sm">If you've won a prize, upload a screenshot of your scores from the golf platform for verification.</p>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">Upload Screenshot</label>
              <input type="file" accept="image/*" onChange={e => setProofFile(e.target.files[0])} className="text-sm" />
            </div>
            <button onClick={uploadProof} disabled={!proofFile} className="btn-primary px-6 py-2.5 rounded-xl text-sm disabled:opacity-40 flex items-center gap-2">
              <Upload size={15} /> Submit Proof
            </button>
          </div>
        )}
      </div>
    </div>
  );
}