/*
 * forgot.js
 *
 *   Step 1 (step-email)   – User enters email, clicks "Send Reset Link"
 *   Step 2 (step-confirm) – "Check your email" holding screen + toast
 *   Step 3 (step-reset)   – New password form (shown when token detected in URL)
 *   Step 4 (step-success) – Password updated confirmation
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL      = "https://pyglxkfdenmvywbbnfui.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AbtdIDVEEoU51BbgdQsN2A_D2yD4VC1";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const RESET_REDIRECT_URL = window.location.href.split("?")[0].split("#")[0];


// ── Element references ─────────────────────────────────────
const stepEmail   = document.getElementById("step-email");
const stepConfirm = document.getElementById("step-confirm");
const stepReset   = document.getElementById("step-reset");
const stepSuccess = document.getElementById("step-success");

const sendBtn              = document.getElementById("send-btn");
const resendBtn            = document.getElementById("resend-btn");
const resetBtn             = document.getElementById("reset-btn");
const emailInput           = document.getElementById("reset-email");
const confirmEmailEl       = document.getElementById("confirm-email");
const newPasswordInput     = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");

const leftHeading = document.getElementById("left-heading");
const leftBody    = document.getElementById("left-body");


// ── Toast ──────────────────────────────────────────────────

function showToast(message, type = "success") {
  const existing = document.getElementById("toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id          = "toast";
  toast.textContent = message;
  toast.className   = `toast toast--${type}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast--visible"));

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 4000);
}


// ── Step switcher ──────────────────────────────────────────

function showStep(stepEl) {
  [stepEmail, stepConfirm, stepReset, stepSuccess].forEach(el => {
    el.classList.add("form-wrap--hidden");
  });
  stepEl.classList.remove("form-wrap--hidden");
}


// ── Field error helpers ────────────────────────────────────

function setError(input, message) {
  const existing = input.parentElement.querySelector(".field-error");
  if (existing) existing.remove();
  input.style.borderColor = message ? "#e8504a" : "";
  if (message) {
    const err = document.createElement("span");
    err.className   = "field-error";
    err.textContent = message;
    input.parentElement.appendChild(err);
  }
}

function setButtonLoading(btn, loading, label) {
  btn.disabled    = loading;
  btn.textContent = loading ? "Please wait…" : label;
}


// ── On page load: detect recovery token ───────────────────

window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.hash.replace("#", "?"));
  if (params.get("type") === "recovery") {
    leftHeading.textContent = "Almost there!";
    leftBody.innerHTML      = "Choose a new password<br />to secure your account.";
    showStep(stepReset);
  }
});


// ── Step 1: Send reset email ───────────────────────────────

sendBtn.addEventListener("click", async () => {
  setError(emailInput, "");

  const email = emailInput.value.trim();
  if (!email) {
    setError(emailInput, "Please enter your email address.");
    emailInput.focus();
    return;
  }

  setButtonLoading(sendBtn, true, "Send Reset Link");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: RESET_REDIRECT_URL,
  });

  setButtonLoading(sendBtn, false, "Send Reset Link");

  if (error) {
    setError(emailInput, "Something went wrong. Please try again.");
    console.error("resetPasswordForEmail:", error.message);
    return;
  }

  // Show toast + switch to confirmation screen
  showToast(`Reset link sent to ${email}`);
  confirmEmailEl.textContent = email;
  showStep(stepConfirm);
});

emailInput.addEventListener("input", () => setError(emailInput, ""));


// ── Step 2: Resend ─────────────────────────────────────────

resendBtn.addEventListener("click", () => {
  emailInput.value = confirmEmailEl.textContent;
  showStep(stepEmail);
  emailInput.focus();
});


// ── Step 3: Update password ────────────────────────────────

resetBtn.addEventListener("click", async () => {
  setError(newPasswordInput, "");
  setError(confirmPasswordInput, "");

  const newPassword     = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  let hasError = false;

  if (!newPassword) {
    setError(newPasswordInput, "Please enter a new password.");
    hasError = true;
  }
  if (newPassword && newPassword.length < 6) {
    setError(newPasswordInput, "Password must be at least 6 characters.");
    hasError = true;
  }
  if (!confirmPassword) {
    setError(confirmPasswordInput, "Please confirm your password.");
    hasError = true;
  }
  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    setError(confirmPasswordInput, "Passwords do not match.");
    hasError = true;
  }
  if (hasError) return;

  setButtonLoading(resetBtn, true, "Update Password");

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  setButtonLoading(resetBtn, false, "Update Password");

  if (error) {
    setError(newPasswordInput, "Update failed. Please request a new reset link.");
    console.error("updateUser:", error.message);
    return;
  }

  showToast("Password updated successfully!");
  showStep(stepSuccess);
});

[newPasswordInput, confirmPasswordInput].forEach(input => {
  input.addEventListener("input", () => setError(input, ""));
});
