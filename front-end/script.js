/* ================= ROLE POPUP ================= */

function openRolePopup() {
    document.getElementById("rolePopup").classList.add("active");
}

function closeRolePopup() {
    document.getElementById("rolePopup").classList.remove("active");
}

/* ================= ABOUT POPUP ================= */

const popup = document.getElementById("popup");
const title = document.getElementById("popupTitle");
const content = document.getElementById("popupContent");

/* Create Ring HTML */
function createRing(percent) {
    return `
        <div class="ring" data-target="${percent}">
            <span>0%</span>
        </div>
    `;
}

/* Animate Ring */
function animateRing(ring) {
    let current = 0;
    const target = parseInt(ring.dataset.target);
    const speed = 15;   // smaller = faster animation
    const span = ring.querySelector("span");

    ring.style.background = `conic-gradient(#3b82f6 0deg, #e5e7eb 0deg)`;
    span.innerText = "0%";

    const interval = setInterval(() => {
        current++;
        const deg = current * 3.6;

        ring.style.background = `conic-gradient(#3b82f6 ${deg}deg, #e5e7eb 0deg)`;
        span.innerText = current + "%";

        if (current >= target) {
            clearInterval(interval);
        }
    }, speed);
}

/* Open About Popup */
function openPopup(type) {
    popup.classList.add("active");

    if (type === "faculty") {
        title.innerText = "Faculty Performance";
        content.innerHTML = `
            <div class="ring-wrapper">
                ${createRing(88)}
                <ul>
                    <li>Faculty Members: 120</li>
                    <li>HODs: 8</li>
                    <li>Avg Experience: 12+ Years</li>
                </ul>
            </div>
        `;
    }

    if (type === "students") {
        title.innerText = "Student Performance";
        content.innerHTML = `
            <div class="ring-wrapper">
                ${createRing(78)}
                <ul>
                    <li>Total Students: 2400</li>
                    <li>Placed Students: 1850</li>
                </ul>
            </div>
        `;
    }

    if (type === "achievements") {
        title.innerText = "Achievements Progress";
        content.innerHTML = `
            <div class="ring-wrapper">
                ${createRing(92)}
                <ul>
                    <li>Total Achievements: 320+</li>
                    <li>National Awards</li>
                    <li>State Level Projects</li>
                </ul>
            </div>
        `;
    }

    if (type === "departments") {
        title.innerText = "Departments";
        content.innerHTML = `
            <ul>
                <li>IT</li>
                <li>Computer</li>
                <li>AIDS</li>
                <li>E&TC</li>
                <li>Electrical</li>
                <li>Mechanical</li>
                <li>Civil</li>
            </ul>
        `;
    }

    if (type === "infrastructure") {
        title.innerText = "Infrastructure";
        content.innerHTML = `
            <ul>
                <li>Modern Labs: 22</li>
                <li>Smart Classrooms: 18</li>
            </ul>
        `;
    }

    /* 🔥 Trigger Ring Animation After DOM Update */
    setTimeout(() => {
        const ring = document.querySelector(".ring");
        if (ring) animateRing(ring);
    }, 100);
}

/* ================= OUTSIDE CLICK CLOSE ================= */

function outsideClose(event) {

    // Close ROLE popup
    const rolePopup = document.getElementById("rolePopup");
    if (event.target === rolePopup) {
        closeRolePopup();
    }

    // Close ABOUT popup
    const aboutPopup = document.getElementById("popup");
    if (event.target === aboutPopup) {
        aboutPopup.classList.remove("active");
    }

    document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        document.getElementById("rolePopup").classList.remove("active");
        document.getElementById("popup").classList.remove("active");
    }
});
}
function submitSupport() {

    const data = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        topic: document.getElementById("topic").value,
        studentId: document.getElementById("studentId").value,
        message: document.getElementById("message").value
    };

    fetch("http://localhost:3000/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        alert("✅ " + result.message);

        // clear form
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("topic").value = "";
        document.getElementById("studentId").value = "";
        document.getElementById("message").value = "";
    })
    .catch(err => {
        console.error(err);
        alert("❌ Failed to submit support request");
    });
}
