import { useState } from "react";
import { getUsers, saveUsers, getDraws } from "../../lib/store";
import { CheckCircle, XCircle, DollarSign, Eye, X, Trophy, Clock, AlertCircle } from "lucide-react";

function ProofModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-6 w-full max-w-md border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold">Proof Submission</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={20} /></button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-white/60 mb-2">User: <span className="text-white font-semibold">{user.name}</span></p>
          <p className="text-sm text-white/60 mb-4">Email: <span className="text-white">{user.email}</span></p>
        </div>
        <div className="bg-white/5 rounded-xl p-6 text-center mb-4">
          <AlertCircle size={32} className="text-yellow-400 mx-auto mb-3" />
          <p className="text-sm text-white/60">Proof screenshot submitted by user.</p>
          <p className="text-xs text-white/30 mt-2">(In a real app, the uploaded image would appear here)</p>
        </div>
        <div className="text-sm text-white/40 space-y-1">
          <div className="flex justify-between"><span>Scores on file:</span><span className="text-white">{user.scores?.map(s => s.value).join(", ") || "None"}</span></div>
          <div className="flex justify-between"><span>Total won:</span><span className="text-white">£{user.totalWon || 0}</span></div>
          <div className="flex justify-between"><span>Payment status:</span><span className={user.paymentStatus === "paid" ? "text-green-400" : user.paymentStatus === "pending" ? "text-yellow-400" : "text-white/40"}>{user.paymentStatus || "none"}</span></div>
        </div>
        <button onClick={onClose} className="w-full glass py-2.5 rounded-xl text-sm mt-6">Close</button>
      </div>
    </div>
  );
}

export default function AdminWinners() {
  const [users, setUsers] = useState(() => getUsers());
  const [draws] = useState(() => getDraws());
  const [proofUser, setProofUser] = useState(null);
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState("all");

  const toast = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const updateStatus = (userId, status) => {
    const all = users.map(u => u.id === userId ? { ...u, paymentStatus: status } : u);
    saveUsers(all);
    setUsers(all);
    toast(`Payment status updated to "${status}"`);
  };

  const approve = (userId) => {
    const all = users.map(u => u.id === userId ? { ...u, paymentStatus: "pending", totalWon: (u.totalWon || 0) + 500 } : u);
    saveUsers(all);
    setUsers(all);
    toast("Winner approved! Prize assigned.");
  };

  const reject = (userId) => {
    const all = users.map(u => u.id === userId ? { ...u, proofUploaded: false, paymentStatus: "none" } : u);
    saveUsers(all);
    setUsers(all);
    toast("Proof rejected. User notified.");
  };

  const markPaid = (userId) => {
    const all = users.map(u => u.id === userId ? { ...u, paymentStatus: "paid" } : u);
    saveUsers(all);
    setUsers(all);
    toast("Marked as paid!");
  };

  // Winners = users with proofUploaded OR totalWon > 0
  const winners = users.filter(u => u.proofUploaded || u.totalWon > 0 || u.paymentStatus !== "none");

  const filtered = filter === "all" ? winners
    : filter === "pending" ? winners.filter(u => u.paymentStatus === "pending")
    : filter === "paid" ? winners.filter(u => u.paymentStatus === "paid")
    : winners.filter(u => u.proofUploaded && u.paymentStatus === "none");

  const STATUS = {
    none: { label: "Awaiting Review", color: "bg-white/10 text-white/50", icon: Clock },
    pending: { label: "Pending Payment", color: "bg-yellow-400/15 text-yellow-400", icon: Clock },
    paid: { label: "Paid", color: "bg-green-400/15 text-green-400", icon: CheckCircle },
  };

  return (
    <div>
      {proofUser && <ProofModal user={proofUser} onClose={() => setProofUser(null)} />}

      <div className="mb-8">
        <h1 className="font-display text-3xl font-black">Winners Management</h1>
        <p className="text-white/40 text-sm mt-1">Verify submissions and track payouts</p>
      </div>

      {msg && <div className="bg-green-400/10 border border-green-400/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-6">{msg}</div>}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Winners", val: winners.length, icon: Trophy, color: "text-yellow-400" },
          { label: "Pending Payment", val: winners.filter(u => u.paymentStatus === "pending").length, icon: Clock, color: "text-orange-400" },
          { label: "Paid Out", val: winners.filter(u => u.paymentStatus === "paid").length, icon: CheckCircle, color: "text-green-400" },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="glass rounded-2xl p-5 text-center">
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <div className="font-display text-2xl font-black">{val}</div>
            <div className="text-xs text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "all", label: "All" },
          { id: "review", label: "Needs Review" },
          { id: "pending", label: "Pending Payment" },
          { id: "paid", label: "Paid" },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setFilter(id)} className={`px-4 py-2 rounded-lg text-sm font-display font-semibold transition-all ${filter === id ? "bg-green-400 text-black" : "glass text-white/50 hover:text-white"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Winners table */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center text-white/30">
          <Trophy size={32} className="mx-auto mb-3 opacity-30" />
          <p>No winners in this category yet.</p>
          <p className="text-xs mt-2">Winners appear here when users submit proof or are awarded prizes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(u => {
            const s = STATUS[u.paymentStatus] || STATUS.none;
            const StatusIcon = s.icon;
            return (
              <div key={u.id} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-cyan-400/20 flex items-center justify-center font-display font-bold text-green-400 flex-shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="font-display font-bold">{u.name}</div>
                      <div className="text-sm text-white/40">{u.email}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${s.color}`}>
                          <StatusIcon size={10} /> {s.label}
                        </span>
                        {u.proofUploaded && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400">Proof Submitted</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-black text-green-400">£{u.totalWon || 0}</div>
                    <div className="text-xs text-white/30">Total won</div>
                  </div>
                </div>

                {/* Scores */}
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-white/30">Scores:</span>
                  {u.scores?.map((s, i) => (
                    <span key={i} className="text-xs bg-white/8 px-2 py-0.5 rounded font-display">{s.value}</span>
                  ))}
                  {!u.scores?.length && <span className="text-xs text-white/20">No scores</span>}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 flex-wrap">
                  {u.proofUploaded && (
                    <button onClick={() => setProofUser(u)} className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white border border-white/10">
                      <Eye size={13} /> View Proof
                    </button>
                  )}
                  {u.proofUploaded && u.paymentStatus === "none" && (
                    <>
                      <button onClick={() => approve(u.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-green-400/15 text-green-400 hover:bg-green-400/25 border border-green-400/20 transition-all">
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button onClick={() => reject(u.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-red-400/10 text-red-400 hover:bg-red-400/20 border border-red-400/20 transition-all">
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}
                  {u.paymentStatus === "pending" && (
                    <button onClick={() => markPaid(u.id)} className="flex items-center gap-1.5 btn-primary px-3 py-1.5 rounded-lg text-sm">
                      <DollarSign size={13} /> Mark as Paid
                    </button>
                  )}
                  {u.paymentStatus === "paid" && (
                    <span className="flex items-center gap-1.5 text-sm text-green-400">
                      <CheckCircle size={13} /> Payment complete
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All users with no wins — add a test winner button */}
      <div className="mt-10 glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-display font-bold mb-2 text-sm">Test: Simulate a Winner</h3>
        <p className="text-xs text-white/40 mb-3">Award the test user a win to test the verification flow.</p>
        <button onClick={() => {
          const all = users.map(u => u.id === "u1" ? { ...u, proofUploaded: true, totalWon: 500, paymentStatus: "none" } : u);
          saveUsers(all);
          setUsers(all);
          toast("Test winner created — check 'Needs Review'");
        }} className="btn-primary px-4 py-2 rounded-lg text-sm">
          Simulate Win for Alex Morgan
        </button>
      </div>
    </div>
  );
}