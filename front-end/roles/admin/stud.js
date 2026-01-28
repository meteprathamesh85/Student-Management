// ===== Loader =====
window.addEventListener("load", () => {
    document.getElementById("loader").style.display = "none";
});


// ===== Sidebar Toggle =====
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");


// ===== Submenu Toggle =====
document.querySelectorAll(".has-sub .menu-link").forEach(menu => {
    menu.addEventListener("click", () => {
        menu.parentElement.classList.toggle("open");
    });
});


// ===== Dummy Student Data =====
const students = [
    { id: 1, name: "Amit Patil", branch: "CSE", year: 4, email: "amit@gmail.com", status: "Active" },
    { id: 2, name: "Riya Deshmukh", branch: "IT", year: 3, email: "riya@gmail.com", status: "Active" },
    { id: 3, name: "Sagar Pawar", branch: "Mechanical", year: 4, email: "sagar@gmail.com", status: "Passed" },
    { id: 4, name: "Neha Kale", branch: "CSE", year: 2, email: "neha@gmail.com", status: "Active" },
    { id: 5, name: "Pratik Jadhav", branch: "IT", year: 1, email: "pratik@gmail.com", status: "Active" }
];

const tableBody = document.getElementById("studentTable");
const searchInput = document.getElementById("search");
const branchFilter = document.getElementById("branchFilter");


// ===== Render Students =====
function renderStudents(data) {
    tableBody.innerHTML = "";

    data.forEach(stu => {
        const row = `
            <tr>
                <td>${stu.id}</td>
                <td>${stu.name}</td>
                <td>${stu.branch}</td>
                <td>${stu.year}</td>
                <td>${stu.email}</td>
                <td>${stu.status}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);

        const lastRow = tableBody.lastElementChild;
        lastRow.addEventListener("click", () => {
            document.querySelectorAll("#studentTable tr").forEach(tr => tr.classList.remove("active-row"));
            lastRow.classList.add("active-row");
        });

    });

    // Dashboard cards update
    document.getElementById("total").innerText = students.length;
    document.getElementById("active").innerText =
        students.filter(s => s.status === "Active").length;
    document.getElementById("final").innerText =
        students.filter(s => s.year === 4).length;
}


// ===== Search + Filter =====
function filterStudents() {
    const searchText = searchInput.value.toLowerCase();
    const branchValue = branchFilter.value;

    const filtered = students.filter(stu => {
        return (
            stu.name.toLowerCase().includes(searchText) &&
            (branchValue === "" || stu.branch === branchValue)
        );
    });

    renderStudents(filtered);
}

searchInput.addEventListener("input", filterStudents);
branchFilter.addEventListener("change", filterStudents);


// ===== Initial Load =====
renderStudents(students);

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

// ===== Collapsible Sidebar Layout Fix =====
const mainContent = document.querySelector("main");

// Restore sidebar state
if (localStorage.getItem("sidebarCollapsed") === "true") {
    sidebar.classList.add("collapsed");
    mainContent.classList.add("collapsed");
}

// Toggle collapse
menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("collapsed");

    // Save state
    localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
});

// ================= ANALYTICS CHARTS =================

// Student Strength
new Chart(document.getElementById("strengthChart"), {
    type: "bar",
    data: {
        labels: ["Total", "Active", "Final Year"],
        datasets: [{
            label: "Students",
            data: [
                students.length,
                students.filter(s => s.status === "Active").length,
                students.filter(s => s.year === 4).length
            ]
        }]
    }
});


// Branch-wise Report
const branchCount = {};
students.forEach(s => {
    branchCount[s.branch] = (branchCount[s.branch] || 0) + 1;
});

new Chart(document.getElementById("branchChart"), {
    type: "pie",
    data: {
        labels: Object.keys(branchCount),
        datasets: [{
            data: Object.values(branchCount)
        }]
    }
});


// Attendance Graph (Demo Data)
new Chart(document.getElementById("attendanceChart"), {
    type: "line",
    data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [{
            label: "Attendance %",
            data: [82, 88, 75, 90, 85],
            tension: 0.4
        }]
    }
});


// Fee Collection Graph (Demo Data)
new Chart(document.getElementById("feeChart"), {
    type: "bar",
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [{
            label: "₹ Collection (Lakhs)",
            data: [2.1, 3.4, 2.8, 4.0, 3.6]
        }]
    }
});

// ================= ADD STUDENT POPUP =================

const addStudentBtn = document.querySelector(".btn.primary");
const modal = document.getElementById("addStudentModal");
const cancelBtn = document.getElementById("cancelStudent");
const submitBtn = document.getElementById("submitStudent");

// Open Modal
addStudentBtn.addEventListener("click", () => {
    modal.style.display = "grid";
});

// Cancel Modal
cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

const formError = document.getElementById("formError");

submitBtn.addEventListener("click", () => {

    const fields = [
        fullName.value,
        dob.value,
        gender.value,
        branch.value,
        year.value,
        roll.value,
        email.value,
        mobile.value,
        address.value,
        parentContact.value
    ];

    // Check empty fields
    const hasEmpty = fields.some(val => val.trim() === "");

    if(hasEmpty){
        formError.style.display = "block";
        formError.innerText = "⚠️ Please fill all required fields before submitting.";
        return;
    }

    // Success
    formError.style.display = "none";
    alert("✅ Student added successfully!");
    modal.style.display = "none";
});


// Close modal when clicking outside box
modal.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.style.display = "none";
    }
});

// ================= UPDATE & PROFILE VIEW =================

const updateBtn = document.querySelector(".btn.warning");
const profileBtnView = document.querySelector(".btn.info");
const profileModal = document.getElementById("profileModal");
const profileDetails = document.getElementById("profileDetails");
const closeProfile = document.getElementById("closeProfile");

let selectedIndex = null;


// Detect selected row
document.getElementById("studentTable").addEventListener("click", e => {
    const row = e.target.closest("tr");
    if(!row) return;
    selectedIndex = row.rowIndex - 1;
});


// ========== UPDATE STUDENT ==========
updateBtn.addEventListener("click", () => {

    if(selectedIndex === null){
        alert("⚠️ Please select a student row first.");
        return;
    }

    const s = students[selectedIndex];

    // Reuse your existing Add Student modal fields
    document.getElementById("fullName").value = s.name;
    document.getElementById("branch").value = s.branch;
    document.getElementById("year").value = s.year;
    document.getElementById("email").value = s.email;

    // Open modal
    document.getElementById("addStudentModal").style.display = "grid";
});


// ========== PROFILE VIEW ==========
profileBtnView.addEventListener("click", () => {

    if(selectedIndex === null){
        alert("⚠️ Please select a student row first.");
        return;
    }

    const s = students[selectedIndex];

    profileDetails.innerHTML = `
        <div><b>Name:</b> ${s.name}</div>
        <div><b>Branch:</b> ${s.branch}</div>
        <div><b>Year:</b> ${s.year}</div>
        <div><b>Email:</b> ${s.email}</div>
        <div><b>Status:</b> ${s.status}</div>
    `;

    profileModal.style.display = "grid";
});


// Close Profile Modal
closeProfile.addEventListener("click", () => {
    profileModal.style.display = "none";
});

// ================= UPDATE / DELETE / PROFILE FULL DATA =================

const deleteBtn = document.getElementById("deleteStudent");
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");

let editIndex = null;
let uploadedPhoto = "";

// Photo Preview
photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => {
            uploadedPhoto = reader.result;
            photoPreview.src = uploadedPhoto;
            photoPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});


// Modify ADD button behavior
addStudentBtn.addEventListener("click", () => {
    editIndex = null;
    deleteBtn.style.display = "none";
    photoPreview.style.display = "none";
});


// Update button behavior
updateBtn.addEventListener("click", () => {

    if(selectedIndex === null){
        alert("⚠️ Please select a student first.");
        return;
    }

    editIndex = selectedIndex;
    const s = students[selectedIndex];

    fullName.value = s.name;
    branch.value = s.branch;
    year.value = s.year;
    email.value = s.email;
    uploadedPhoto = s.photo || "";

    if(uploadedPhoto){
        photoPreview.src = uploadedPhoto;
        photoPreview.style.display = "block";
    }

    deleteBtn.style.display = "inline-block";
    modal.style.display = "grid";
});


// Save (Add / Update)
submitBtn.addEventListener("click", () => {

    if(editIndex === null){
        // ADD
        students.push({
            id: students.length + 1,
            name: fullName.value,
            branch: branch.value,
            year: year.value,
            email: email.value,
            status: "Active",
            photo: uploadedPhoto
        });
    } else {
        // UPDATE
        students[editIndex].name = fullName.value;
        students[editIndex].branch = branch.value;
        students[editIndex].year = year.value;
        students[editIndex].email = email.value;
        students[editIndex].photo = uploadedPhoto;
    }

    modal.style.display = "none";
    renderStudents(students);
});


// DELETE student
deleteBtn.addEventListener("click", () => {

    if(confirm("Are you sure you want to delete this student?")){
        students.splice(editIndex, 1);
        modal.style.display = "none";
        renderStudents(students);
    }
});


// PROFILE VIEW FULL DETAILS
profileBtnView.addEventListener("click", () => {

    if(selectedIndex === null){
        alert("⚠️ Please select a student first.");
        return;
    }

    const s = students[selectedIndex];

    document.getElementById("profilePhoto").src =
        s.photo || "https://i.pravatar.cc/150";

    profileDetails.innerHTML = `
        <div><b>Name:</b> ${s.name}</div>
        <div><b>Branch:</b> ${s.branch}</div>
        <div><b>Year:</b> ${s.year}</div>
        <div><b>Email:</b> ${s.email}</div>
        <div><b>Status:</b> ${s.status}</div>
        <div><b>ID:</b> ${s.id}</div>
    `;

    profileModal.style.display = "grid";
});

// ================= ATTENDANCE DATA =================
// ================= DATA =================
let attendanceData = [
 { id:1, name:"Amit", dept:"Comp", year:"2nd year", date:"2026-01-28", type:"Regular" },
 { id:2, name:"Riya", dept:"IT", year:"3rd year", date:"2026-01-28", type:"Regular" },
 { id:3, name:"Sagar", dept:"AIDS", year:"4th year", date:"2026-01-27", type:"Defaulter" },
 { id:4, name:"Neha", dept:"E&TC", year:"1st year", date:"2026-01-27", type:"Regular" }
];

let selectedDate = new Date().toISOString().split("T")[0];
let filteredData = [];

// ================= TABLE =================
function renderTable(data) {
  const body = document.getElementById("attendanceBody");
  body.innerHTML = "";

  data.forEach((s) => {
    body.innerHTML += `
      <tr>
        <td><input type="checkbox" class="rowCheck" data-id="${s.id}"></td>
        <td>👤</td>
        <td>${s.name}</td>
        <td>${s.id}</td>
        <td>${s.dept}</td>
        <td>${s.year}</td>
        <td>${s.date}</td>
        <td>${s.type}</td>
      </tr>
    `;
  });

  updateButtons();
}

// ================= FILTER LOGIC =================
function applyFilters() {

  const search = searchInput.value.toLowerCase();
  const dept = deptFilter.value;
  const year = yearFilter.value;
  const duration = durationFilter.value;

  filteredData = attendanceData.filter(s => {

    // ---------- DATE LOGIC ----------
    let dateMatch = true;

    if (duration === "all") {
      // calendar controls the date
      dateMatch = s.date === selectedDate;
    } 
    else {
      const recordDate = new Date(s.date);
      const selected = new Date(selectedDate);

      if (duration === "daily") {
        dateMatch = recordDate.toDateString() === selected.toDateString();
      }

      if (duration === "weekly") {
        const diff = Math.abs(recordDate - selected);
        dateMatch = diff <= 7 * 24 * 60 * 60 * 1000;
      }

      if (duration === "monthly") {
        dateMatch = recordDate.getMonth() === selected.getMonth() &&
                    recordDate.getFullYear() === selected.getFullYear();
      }
    }

    // ---------- OTHER FILTERS ----------
    return (
      dateMatch &&
      s.name.toLowerCase().includes(search) &&
      (dept === "all" || s.dept === dept) &&
      (year === "all" || s.year === year)
    );
  });

  renderTable(filteredData);
  updateCharts(filteredData);
}

// ================= SELECT ALL =================
document.getElementById("selectAll").addEventListener("change", function() {
  document.querySelectorAll(".rowCheck").forEach(cb => cb.checked = this.checked);
  updateButtons();
});

document.addEventListener("change", e => {
  if(e.target.classList.contains("rowCheck")) updateButtons();
});

function updateButtons() {
  const checkedCount = document.querySelectorAll(".rowCheck:checked").length;
  editBtn.onclick = () => {

  const selected = document.querySelectorAll(".rowCheck:checked");

  if (selected.length !== 1) {
    alert("⚠️ Please select exactly ONE student to edit.");
    return;
  }

  const id = Number(selected[0].dataset.id);
  const student = attendanceData.find(s => s.id === id);

  const newType = prompt("Enter Type: Present / Absent / Leave", student.type);

  if (newType) {
    student.type = newType;
    applyFilters();
  }
};

  deleteBtn.onclick = () => {

  const selectedIds = [...document.querySelectorAll(".rowCheck:checked")]
                        .map(cb => Number(cb.dataset.id));

  if (selectedIds.length === 0) {
    alert("⚠️ Select students to delete.");
    return;
  }

  if (!confirm("Are you sure you want to delete selected students?")) return;

  attendanceData = attendanceData.filter(s => !selectedIds.includes(s.id));

  applyFilters();
};

}

// Select All checkbox
document.getElementById("selectAll").addEventListener("change", function () {
  document.querySelectorAll(".rowCheck").forEach(cb => cb.checked = this.checked);
  updateButtons();
});

// Detect individual checkbox clicks (event delegation)
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("rowCheck")) {
    updateButtons();
  }
});

// ================= CALENDAR =================
document.addEventListener("DOMContentLoaded", function () {

    initCharts();   // 👈 initialize charts
  const calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
    initialView: "dayGridMonth",

    dateClick(info) {
      selectedDate = info.dateStr;
      applyFilters();   // reload table by date
    },

    events: attendanceData.map(s => ({
      title: s.name,
      date: s.date
    }))
  });

  calendar.render();
  applyFilters();
});


// Charts

let lineChart, barChart;

// Initialize charts once
function initCharts() {

  const lineCtx = document.getElementById("attendanceLine");
  const barCtx  = document.getElementById("attendanceBar");

  lineChart = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Attendance Count",
        data: [],
        tension: 0.4,
        fill: true
      }]
    }
  });

  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Students",
        data: []
      }]
    }
  });
}

function updateCharts(data) {

  // ---------------- LINE GRAPH (DATE WISE COUNT) ----------------
  const dateMap = {};

  data.forEach(s => {
    dateMap[s.date] = (dateMap[s.date] || 0) + 1;
  });

  lineChart.data.labels = Object.keys(dateMap);
  lineChart.data.datasets[0].data = Object.values(dateMap);
  lineChart.update();


  // ---------------- BAR GRAPH (DEPARTMENT COUNT) ----------------
  const deptMap = {};

  data.forEach(s => {
    deptMap[s.dept] = (deptMap[s.dept] || 0) + 1;
  });

  barChart.data.labels = Object.keys(deptMap);
  barChart.data.datasets[0].data = Object.values(deptMap);
  barChart.update();
}

function markAttendance() {

  const checkedBoxes = document.querySelectorAll(".rowCheck:checked");

  if (checkedBoxes.length === 0) {
    alert("⚠️ Please select at least one student.");
    return;
  }

  checkedBoxes.forEach(cb => {
    const id = Number(cb.dataset.id);
    const student = attendanceData.find(s => s.id === id);

    if (student) {
      student.type = "Present";
      student.date = selectedDate;   // mark on selected calendar date
    }
  });

  alert("✅ Attendance marked successfully!");
  applyFilters();
}

function exportExcel() {

  if (filteredData.length === 0) {
    alert("⚠️ No data to export.");
    return;
  }

  let csv = "Name,ID,Department,Year,Date,Status\n";

  filteredData.forEach(s => {
    csv += `${s.name},${s.id},${s.dept},${s.year},${s.date},${s.type}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `attendance_${selectedDate}.csv`;
  link.click();
}
