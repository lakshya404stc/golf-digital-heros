import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X, Trophy, LogOut, User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };
  const active = (path) => location.pathname === path ? "text-green-400" : "text-white/70 hover:text-white";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
            <Trophy size={16} />
          </div>
          <span className="font-display font-800 text-lg tracking-tight">Golf<span className="gradient-text">Draws</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/charities" className={active("/charities")}>Charities</Link>
          <Link to="/draws" className={active("/draws")}>Draws</Link>
          {session?.role === "user" && <Link to="/dashboard" className={active("/dashboard")}>Dashboard</Link>}
          {session?.role === "admin" && <Link to="/admin" className={active("/admin")}>Admin</Link>}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!session ? (
            <>
              <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="btn-primary px-4 py-2 rounded-lg text-sm">Subscribe</Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/50">{session.name}</span>
              {session.role === "user" && (
                <Link to="/dashboard" className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors">
                  <LayoutDashboard size={15} />
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-white/50 hover:text-red-400 transition-colors">
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white/70" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-dark border-t border-white/5 px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link to="/charities" onClick={() => setOpen(false)} className="text-white/70">Charities</Link>
          <Link to="/draws" onClick={() => setOpen(false)} className="text-white/70">Draws</Link>
          {session?.role === "user" && <Link to="/dashboard" onClick={() => setOpen(false)} className="text-white/70">Dashboard</Link>}
          {session?.role === "admin" && <Link to="/admin" onClick={() => setOpen(false)} className="text-white/70">Admin</Link>}
          {!session ? (
            <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-center px-4 py-2 rounded-lg">Subscribe</Link>
          ) : (
            <button onClick={() => { handleLogout(); setOpen(false); }} className="text-red-400 text-left">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}