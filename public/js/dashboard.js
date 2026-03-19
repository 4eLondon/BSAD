/*
 * dashboard.js
 *
 * 1. Auth guard — redirect to /auth?mode=login if no session
 * 2. Populate all user info from Supabase session
 * 3. Build activity log from auth state events + seed events
 * 4. Notification drawer (bell + sidebar link)
 * 5. Sign out
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL      = "https://pyglxkfdenmvywbbnfui.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AbtdIDVEEoU51BbgdQsN2A_D2yD4VC1";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ── Auth guard ─────────────────────────────────────────────

const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  window.location.href = "/auth?mode=login";
}

const user = session.user;


// ── Helpers ────────────────────────────────────────────────

function fmt(dateStr) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleString("en-JM", {
    dateStyle: "medium", timeStyle: "short",
  });
}

function fmtDate(dateStr) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("en-JM", { dateStyle: "medium" });
}

function initials(name) {
  if (!name) return "–";
  return name.trim().split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function showToast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className   = "toast toast--visible" + (isError ? " toast--error" : "");
  setTimeout(() => { t.className = "toast"; }, 3500);
}


// ── Populate UI ────────────────────────────────────────────

const name  = user.user_metadata?.name || user.email.split("@")[0];
const email = user.email;
const init  = initials(name);

// Avatars
["sidebar-avatar", "topbar-avatar", "account-avatar"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.textContent = init;
});

// Names + emails
document.getElementById("sidebar-name").textContent  = name;
document.getElementById("sidebar-email").textContent = email;
document.getElementById("topbar-name").textContent   = name;
document.getElementById("account-name").textContent  = name;
document.getElementById("account-email").textContent = email;
document.getElementById("account-since").textContent = "Since " + fmtDate(user.created_at);

// Stat cards
document.getElementById("stat-joined").textContent     = fmtDate(user.created_at);
document.getElementById("stat-last-login").textContent = fmt(user.last_sign_in_at);
document.getElementById("stat-status").textContent     = user.confirmed_at ? "Confirmed" : "Pending";

// Application count from Supabase
supabase
  .from("applications")
  .select("id", { count: "exact", head: true })
  .eq("user_id", user.id)
  .then(({ count }) => {
    document.getElementById("stat-apps").textContent = count ?? "0";
  });


// ── Activity log ───────────────────────────────────────────

const EVENT_ICONS = {
  SIGNED_IN:         "↗",
  SIGNED_OUT:        "↙",
  PASSWORD_RECOVERY: "⟳",
  USER_UPDATED:      "✎",
  TOKEN_REFRESHED:   "↺",
};

const activityList = document.getElementById("activity-list");
const notifList    = document.getElementById("notif-list");
let   unread       = 0;

function addEvent(label, icon, time, isNew = false) {
  // Remove empty placeholder
  activityList.querySelector(".activity-list__empty")?.remove();
  notifList.querySelector(".notif-list__empty")?.remove();

  // Activity item
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="activity-icon">${icon}</div>
    <div class="activity-body">
      <strong>${label}</strong>
      <span class="activity-time">${fmt(time)}</span>
    </div>
  `;
  activityList.prepend(li);

  // Notif item
  const ni = document.createElement("li");
  if (isNew) ni.classList.add("notif-item--new");
  ni.innerHTML = `${label}<span class="notif-item__time">${fmt(time)}</span>`;
  notifList.prepend(ni);

  if (isNew) {
    unread++;
    updateBadges();
    showToast(label);
  }
}

function updateBadges() {
  ["bell-badge", "sidebar-badge"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent         = unread;
    el.dataset.count       = unread;
    el.style.display       = unread > 0 ? "" : "none";
  });
}

// Seed from known user timestamps
if (user.created_at)       addEvent("Account created",   "★", user.created_at);
if (user.email_confirmed_at) addEvent("Email confirmed", "✓", user.email_confirmed_at);
if (user.last_sign_in_at)  addEvent("Signed in",         "↗", user.last_sign_in_at);

// Live auth events during this session
supabase.auth.onAuthStateChange((event, _session) => {
  if (event === "INITIAL_SESSION") return;
  const label = event.replace(/_/g, " ").toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
  addEvent(label, EVENT_ICONS[event] ?? "·", new Date().toISOString(), true);
});


// ── Notification drawer ────────────────────────────────────

const drawer   = document.getElementById("notif-drawer");
const overlay  = document.getElementById("notif-overlay");
const bellBtn  = document.getElementById("bell-btn");
const notifTrigger = document.getElementById("notif-trigger");
const notifClose   = document.getElementById("notif-close");

function openDrawer() {
  drawer.classList.add("open");
  overlay.classList.add("open");
  unread = 0;
  updateBadges();
  notifList.querySelectorAll(".notif-item--new").forEach(el =>
    el.classList.remove("notif-item--new")
  );
}

function closeDrawer() {
  drawer.classList.remove("open");
  overlay.classList.remove("open");
}

bellBtn?.addEventListener("click", openDrawer);
notifTrigger?.addEventListener("click", e => { e.preventDefault(); openDrawer(); });
notifClose?.addEventListener("click", closeDrawer);
overlay?.addEventListener("click", closeDrawer);

document.getElementById("clear-log")?.addEventListener("click", () => {
  activityList.innerHTML = '<li class="activity-list__empty">No recent activity</li>';
  notifList.innerHTML    = '<li class="notif-list__empty">No notifications</li>';
  unread = 0;
  updateBadges();
});


// ── Sign out ───────────────────────────────────────────────

document.getElementById("signout-btn")?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "/auth?mode=login";
});
