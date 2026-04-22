import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/store";
import { useAuth } from "../context/AuthContext";
import { Trophy, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const s = login(form.email, form.password);
    if (!s) return setError("Invalid email or password.");
    refresh();
    navigate(s.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center"><Trophy size={16} /></div>
          <span className="font-display font-black text-xl">GolfDraws</span>
        </Link>

        <div className="glass rounded-2xl p-8">
          <h1 className="font-display text-3xl font-black mb-2">Welcome back</h1>
          <p className="text-white/40 mb-8 text-sm">Login to access your dashboard and scores.</p>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">Email</label>
              <input type="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-display mb-2 block">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} required placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm mt-2">Sign In</button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 space-y-2 text-xs text-white/30">
            <p>Test user: <span className="text-white/50">user@test.com / Test@123</span></p>
            <p>Admin: <span className="text-white/50">admin@golfdraws.com / Admin@123</span></p>
          </div>

          <p className="mt-6 text-center text-sm text-white/40">
            No account? <Link to="/register" className="text-green-400 hover:underline">Subscribe now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}