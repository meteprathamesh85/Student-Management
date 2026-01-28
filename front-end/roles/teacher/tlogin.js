const API = "http://localhost:3000";
const ROLE = "teacher";
const DASHBOARD = "tdashboard.html";

const container = document.getElementById("container");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const forgotBtn = document.getElementById("forgotBtn");
const backLoginBtn = document.getElementById("backLoginBtn");

const registerSubmit = document.getElementById("registerSubmit");
const loginSubmit = document.getElementById("loginSubmit");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const updatePasswordBtn = document.getElementById("updatePasswordBtn");

const otpBox = document.getElementById("otpBox");
const otpTimer = document.getElementById("otpTimer");
const newPassword = document.getElementById("newPassword");
const strengthFill = document.getElementById("strengthFill");

/* ---------------- PANEL SWITCH ---------------- */

registerBtn.onclick = () => container.classList.add("active");
loginBtn.onclick = () => container.classList.remove("active");

forgotBtn.onclick = () => {
    resetForgotForm();      
    container.classList.add("forgot");
};

backLoginBtn.onclick = () => {
    resetForgotForm();
    container.classList.remove("forgot");
};


/* ---------------- LOGIN (FINAL FIXED) ---------------- */

loginSubmit.onclick = () => {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email) return showToast("Email is required", "error");
    if (!password) return showToast("Password is required", "error");

    fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password,
            role: "teacher"
        })
    })
    .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
            // ❌ Backend rejected login
            showToast(data.message, "error");
            return;
        }

        // ✅ Login success
        showToast("✅ Login successful!", "success");

        localStorage.setItem("adminUser", JSON.stringify(data));

        setTimeout(() => {
            window.location.href = "adashboard.html";
        }, 1200);
    })
    .catch(() => {
        showToast("❌ Server not reachable", "error");
    });
};

/* ---------------- REGISTER (BACKEND CONNECTED) ---------------- */

registerSubmit.onclick = () => {

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const enroll = document.getElementById("regEnroll").value.trim(); // optional
    const password = document.getElementById("regPassword").value.trim();

    if (!name) return showToast("Full name is required", "error");
    if (!email) return showToast("Email is required", "error");
    if (!email.includes("@")) return showToast("Invalid email format", "error");
    if (!password) return showToast("Password is required", "error");

    fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            email,
            password,
            role: "teacher"
        })
    })
    .then(res => res.json())
    .then(result => {

        if (result.message?.includes("successful")) {
            showToast("🎉 Registration successful! Please login.", "success");

            document.querySelector(".sign-up form").reset();
            container.classList.remove("active");
        } 
        else {
            showToast(result.message || "Registration failed ❌", "error");
        }

    })
    .catch(() => {
        showToast("❌ Server not reachable", "error");
    });
};

/* ---------------- OTP ---------------- */

let generatedOTP = "";
let timerInterval;

sendOtpBtn.onclick = () => {

    const email = document.getElementById("forgotEmail").value.trim();

    if (!email) return showToast("Email is required", "error");
    if (!email.includes("@")) return showToast("Invalid email format", "error");

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("OTP (demo only):", generatedOTP);

    showToast("📩 OTP sent successfully!", "info");

    clearInterval(timerInterval);
    otpBox.classList.add("active");
    startTimer(120);
};

/* ---------------- OTP TIMER ---------------- */

function startTimer(seconds) {

    clearInterval(timerInterval);
    let time = seconds;

    timerInterval = setInterval(() => {

        let min = Math.floor(time / 60);
        let sec = time % 60;

        otpTimer.innerText =
            `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

        if (time <= 0) {
            clearInterval(timerInterval);
            alert("⏰ OTP expired. Please resend OTP.", "error");
            otpBox.classList.remove("active");
        }

        time--;
    }, 1000);
}

/* ---------------- UPDATE PASSWORD ---------------- */

updatePasswordBtn.onclick = () => {

    const otpInput = document.getElementById("otpInput").value.trim();
    const password = newPassword.value.trim();

    if (!otpInput) return showToast("OTP is required", "error");
    if (!password) return showToast("New password is required", "error");

    if (otpInput !== generatedOTP) {
        return showToast("Invalid OTP", "error");
    }

    showToast("🔐 Password updated successfully!", "success");

    resetForgotForm();
    container.classList.remove("forgot");
};

/* ---------------- PASSWORD STRENGTH ---------------- */

newPassword.addEventListener("input", () => {

    const value = newPassword.value;
    let strength = 0;

    if (value.length >= 6) strength += 25;
    if (/[A-Z]/.test(value)) strength += 25;
    if (/[0-9]/.test(value)) strength += 25;
    if (/[^A-Za-z0-9]/.test(value)) strength += 25;

    strengthFill.style.width = strength + "%";

    if (strength <= 25) strengthFill.style.background = "red";
    else if (strength <= 50) strengthFill.style.background = "orange";
    else if (strength <= 75) strengthFill.style.background = "gold";
    else strengthFill.style.background = "green";
});

/* ---------------- TOAST ---------------- */

function showToast(message, type = "info") {
    const toast = document.getElementById("toast");

    toast.innerText = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

/* ---------------- REMEMBER EMAIL ---------------- */

window.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
        document.getElementById("loginEmail").value = savedEmail;
        document.getElementById("rememberMe").checked = true;
    }
});

/* ---------------- RESET FORGOT FORM ---------------- */

function resetForgotForm() {
    document.getElementById("forgotEmail").value = "";
    document.getElementById("otpInput").value = "";
    document.getElementById("newPassword").value = "";

    otpBox.classList.remove("active");
    strengthFill.style.width = "0%";
    otpTimer.innerText = "02:00";

    clearInterval(timerInterval);
    generatedOTP = "";
}
