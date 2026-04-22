const CHARITIES = [
  { id: "c1", name: "Birdies for Blindness", description: "Funding sight-saving surgeries across South Asia through golf fundraising.", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400", category: "Health", raised: 84200, goal: 120000, events: ["Golf Day – Jun 14", "Charity Dinner – Jul 2"] },
  { id: "c2", name: "Green Jacket Foundation", description: "Scholarships for underprivileged youth to access golf coaching and education.", image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400", category: "Education", raised: 61500, goal: 80000, events: ["Junior Open – May 28"] },
  { id: "c3", name: "Fairway to Recovery", description: "Mental health support for veterans through therapeutic golf programmes.", image: "https://images.unsplash.com/photo-1470549813517-2fa741d25c92?w=400", category: "Mental Health", raised: 39800, goal: 60000, events: ["Veteran Round – Jun 21"] },
  { id: "c4", name: "Eagle Eye Children", description: "Providing glasses and eye care to children in rural communities worldwide.", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400", category: "Children", raised: 22100, goal: 50000, events: [] },
  { id: "c5", name: "Albatross Ocean Fund", description: "Marine conservation — every score entered plants coral reef restoration patches.", image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400", category: "Environment", raised: 17400, goal: 40000, events: ["Beach Cleanup – Jun 7"] },
  { id: "c6", name: "Hole in One Hunger", description: "Fighting food insecurity — each draw entry contributes a meal to food banks.", image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400", category: "Food Security", raised: 55000, goal: 90000, events: ["Food Drive – Jun 1"] },
];

const DRAWS_SEED = [
  { id: "d1", month: "May 2025", status: "published", numbers: [12, 27, 8, 34, 19], jackpot: 4800, pool: { five: 4800, four: 4200, three: 3000 }, winnersRaw: [] },
  { id: "d2", month: "June 2025", status: "upcoming", numbers: [], jackpot: 9600, pool: { five: 9600, four: 8400, three: 6000 }, winnersRaw: [] },
];

const ADMIN_CREDS = { email: "admin@golfdraws.com", password: "Admin@123", name: "Admin" };

function seed() {
  if (localStorage.getItem("gd_seeded")) return;
  localStorage.setItem("gd_charities", JSON.stringify(CHARITIES));
  localStorage.setItem("gd_draws", JSON.stringify(DRAWS_SEED));
  localStorage.setItem("gd_users", JSON.stringify([
    { id: "u1", email: "user@test.com", password: "Test@123", name: "Alex Morgan", plan: "yearly", planExpiry: "2026-01-01", charityId: "c1", charityPct: 10, scores: [{ value: 32, date: "2025-05-10" }, { value: 28, date: "2025-04-22" }, { value: 35, date: "2025-04-01" }], drawsEntered: ["d1"], totalWon: 0, paymentStatus: "none", proofUploaded: false }
  ]));
  localStorage.setItem("gd_seeded", "1");
}
seed();

export const getUsers = () => JSON.parse(localStorage.getItem("gd_users") || "[]");
export const saveUsers = (u) => localStorage.setItem("gd_users", JSON.stringify(u));
export const getCharities = () => JSON.parse(localStorage.getItem("gd_charities") || "[]");
export const saveCharities = (c) => localStorage.setItem("gd_charities", JSON.stringify(c));
export const getDraws = () => JSON.parse(localStorage.getItem("gd_draws") || "[]");
export const saveDraws = (d) => localStorage.setItem("gd_draws", JSON.stringify(d));
export const getSession = () => JSON.parse(localStorage.getItem("gd_session") || "null");
export const saveSession = (s) => localStorage.setItem("gd_session", JSON.stringify(s));
export const clearSession = () => localStorage.removeItem("gd_session");

export function login(email, password) {
  if (email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
    const s = { role: "admin", email, name: ADMIN_CREDS.name };
    saveSession(s); return s;
  }
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user) return null;
  const s = { role: "user", email, name: user.name, id: user.id };
  saveSession(s); return s;
}

export function register({ name, email, password, plan, charityId }) {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { error: "Email already registered" };
  const days = plan === "yearly" ? 365 : 30;
  const expiry = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
  const user = { id: "u" + Date.now(), email, password, name, plan, planExpiry: expiry, charityId: charityId || "c1", charityPct: 10, scores: [], drawsEntered: [], totalWon: 0, paymentStatus: "none", proofUploaded: false };
  users.push(user);
  saveUsers(users);
  const s = { role: "user", email, name, id: user.id };
  saveSession(s);
  return { user: s };
}

export function getCurrentUser() {
  const s = getSession();
  if (!s || s.role !== "user") return null;
  return getUsers().find(u => u.id === s.id) || null;
}

export function updateUser(id, data) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return;
  users[idx] = { ...users[idx], ...data };
  saveUsers(users);
  return users[idx];
}

export function addScore(userId, score, date) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return;
  let scores = [{ value: Number(score), date }, ...(users[idx].scores || [])].slice(0, 5);
  users[idx].scores = scores;
  saveUsers(users);
  return users[idx];
}

export function runDrawSim(drawId, mode = "random") {
  const draws = getDraws();
  const idx = draws.findIndex(d => d.id === drawId);
  if (idx === -1) return;
  let numbers;
  if (mode === "random") {
    const pool = Array.from({ length: 45 }, (_, i) => i + 1);
    numbers = pool.sort(() => Math.random() - 0.5).slice(0, 5).sort((a, b) => a - b);
  } else {
    const allScores = getUsers().flatMap(u => (u.scores || []).map(s => s.value));
    const freq = {};
    allScores.forEach(s => { freq[s] = (freq[s] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([v]) => parseInt(v));
    const pool = sorted.length >= 5 ? sorted.slice(0, 5) : [...sorted, ...Array.from({ length: 5 - sorted.length }, () => Math.floor(Math.random() * 45) + 1)];
    numbers = pool.sort((a, b) => a - b);
  }
  draws[idx] = { ...draws[idx], numbers, status: "simulation" };
  saveDraws(draws);
  return draws[idx];
}

export function publishDraw(drawId) {
  const draws = getDraws();
  const idx = draws.findIndex(d => d.id === drawId);
  if (idx === -1) return;
  draws[idx].status = "published";
  saveDraws(draws);
  return draws[idx];
}

export function getTotals() {
  const users = getUsers();
  const draws = getDraws();
  const totalPool = draws.reduce((a, d) => a + (d.jackpot || 0), 0);
  const charityTotal = users.reduce((a, u) => {
    const amt = u.plan === "yearly" ? 99 : 9.99;
    return a + amt * ((u.charityPct || 10) / 100);
  }, 0);
  return { totalUsers: users.length, totalPool, charityTotal, totalDraws: draws.length };
}