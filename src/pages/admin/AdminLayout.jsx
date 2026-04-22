import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, Trophy, Heart, Medal, LogOut, Trophy as Logo } from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/draws", label: "Draws", icon: Trophy },
  { to: "/admin/charities", label: "Charities", icon: Heart },
  { to: "/admin/winners", label: "Winners", icon: Medal },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-[#080b12] flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 glass-dark border-r border-white/5 flex flex-col fixed top-0 left-0 h-full z-40">
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg btn-primary flex items-center justify-center"><Logo size={14} /></div>
          <span className="font-display font-black text-sm">GolfDraws <span className="text-green-400">Admin</span></span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-semibold transition-all ${isActive ? "bg-green-400/15 text-green-400" : "text-white/50 hover:text-white hover:bg-white/5"}`
            }>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-red-400 transition-colors w-full">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}