/* ================= PAGE LOADER ================= */
window.addEventListener("load", () => {
    setTimeout(() => {
        const loader = document.getElementById("loader");
        if(loader) loader.style.display = "none";
    }, 600);
});

/* ================= DASHBOARD DATA ================= */

let dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {
    students: 4396,
    teachers: 72,
    fees: 900000,
    pending: 120000,
    notifications: []
};

localStorage.setItem("dashboardData", JSON.stringify(dashboardData));

function renderDashboard(){
    const studentsEl = document.getElementById("students");
    const teachersEl = document.getElementById("teachers");
    const feesEl = document.getElementById("fees");
    const pendingEl = document.getElementById("pending");

    if(!studentsEl) return;

    studentsEl.innerText = dashboardData.students.toLocaleString();
    teachersEl.innerText = dashboardData.teachers;
    feesEl.innerText = "₹" + dashboardData.fees.toLocaleString();
    pendingEl.innerText = "₹" + dashboardData.pending.toLocaleString();
}

renderDashboard();

/* ================= CHARTS ================= */

const feeCanvas = document.getElementById("feeChart");
if(feeCanvas){
    new Chart(feeCanvas, {
        type: "bar",
        data: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun"],
            datasets: [{
                label: "Collection",
                data: [120,190,300,250,220,270],
                backgroundColor: "#38bdf8"
            }]
        }
    });
}

const attendanceCanvas = document.getElementById("attendanceChart");
if(attendanceCanvas){
    new Chart(attendanceCanvas, {
        type: "line",
        data: {
            labels: ["Mon","Tue","Wed","Thu","Fri"],
            datasets: [{
                label: "Students Present",
                data: [420,450,430,470,460],
                borderColor: "#22c55e",
                fill: false
            }]
        }
    });
}

/* ================= SIDEBAR TOGGLE ================= */

const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".menu-toggle");
const main = document.querySelector(".main");

if(toggleBtn && sidebar){
    toggleBtn.addEventListener("click", () => {

        // Desktop collapse
        if(window.innerWidth > 768){
            sidebar.classList.toggle("collapsed");
            main.classList.toggle("collapsed");
        }
        // Mobile slide
        else{
            sidebar.classList.toggle("show");
        }

    });
}


/* ================= SUBMENU TOGGLE + SAVE STATE ================= */

document.querySelectorAll(".has-sub").forEach((menu, index) => {
    const key = `submenu-${index}`;
    if(localStorage.getItem(key) === "open"){
        menu.classList.add("open");
    }

    const link = menu.querySelector(".menu-link");
    link.addEventListener("click", () => {
        menu.classList.toggle("open");
        localStorage.setItem(key, menu.classList.contains("open") ? "open" : "closed");
    });
});

/* ================= ACTIVE MENU + BREADCRUMB ================= */

const breadcrumb = document.querySelector(".breadcrumb");

document.querySelectorAll(".menu-link, .submenu li").forEach(item => {
    item.addEventListener("click", () => {

        document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
        item.closest(".menu-item")?.classList.add("active");

        if(breadcrumb){
            breadcrumb.innerHTML = `Dashboard<span>›</span> ${item.innerText.trim()}`;
        }
    });
});

/* ================= SIDEBAR SEARCH ================= */

const sidebarSearch = document.querySelector(".sidebar-search");

if(sidebarSearch){
    sidebarSearch.addEventListener("keyup", e => {
        const value = e.target.value.toLowerCase();
        document.querySelectorAll(".menu-item").forEach(item => {
            item.style.display =
                item.innerText.toLowerCase().includes(value) ? "block" : "none";
        });
    });
}

/* ================= NOTIFICATIONS ================= */

const notifyBtn = document.getElementById("notifyBtn");
const notifyMenu = document.getElementById("notifyMenu");
const notifyCount = document.getElementById("notifyCount");

function renderNotifications(){
    if(!notifyCount) return;

    notifyCount.innerText = dashboardData.notifications.length;

    notifyMenu.innerHTML = dashboardData.notifications.length
        ? dashboardData.notifications.map(n => `<p>${n}</p>`).join("")
        : "<p>No notifications</p>";
}

renderNotifications();

if(notifyBtn){
    notifyBtn.addEventListener("click", () => {
        notifyMenu.style.display =
            notifyMenu.style.display === "block" ? "none" : "block";
    });
}

/* ================= PROFILE DROPDOWN ================= */

const profileBtn = document.getElementById("profileBtn");

if(profileBtn){
    profileBtn.addEventListener("click", e => {
        e.stopPropagation();
        const dropdown = profileBtn.querySelector(".dropdown");
        dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
    });
}

/* ================= LIVE DATA UPDATE FUNCTION ================= */

window.updateDashboardData = function(type, value){
    if(dashboardData[type] === undefined) return;

    dashboardData[type] += value;
    dashboardData.notifications.push(`Updated ${type} by ${value}`);

    localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
    renderDashboard();
    renderNotifications();
};

// profile details popup
// Profile Button
document.getElementById("profile").addEventListener("click", function () {
    window.location.href = "profile.html";   // create this page later
});

// Settings Button
document.getElementById("Settings").addEventListener("click", function () {
    window.location.href = "settings.html";  // create this page later
});

// Logout Button
document.getElementById("backLoginBtn").addEventListener("click", function () {

    // Clear login session if you use localStorage
    localStorage.removeItem("isLoggedIn");

    // Redirect to login page
    window.location.href ="alogin.html";  
});
