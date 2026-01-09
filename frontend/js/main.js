console.log("✅ main.js loaded");

/* ================================
   COLLEGE AUTOCOMPLETE (SAFE)
================================ */

const colleges = [
    "ABC Engineering College",
    "XYZ University",
    "National Institute of Technology",
    "Government Polytechnic",
    "City Engineering College",
    "Institute of Technology",
    "State University"
];

const input = document.getElementById("collegeInput");
const suggestionsBox = document.getElementById("suggestions");

if (input && suggestionsBox) {
    input.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        suggestionsBox.innerHTML = "";

        if (value === "") {
            suggestionsBox.style.display = "none";
            return;
        }

        const filtered = colleges.filter(college =>
            college.toLowerCase().includes(value)
        );

        if (filtered.length === 0) {
            suggestionsBox.style.display = "none";
            return;
        }

        filtered.forEach(college => {
            const div = document.createElement("div");
            div.textContent = college;
            div.onclick = () => {
                input.value = college;
                suggestionsBox.style.display = "none";
            };
            suggestionsBox.appendChild(div);
        });

        suggestionsBox.style.display = "block";
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".autocomplete")) {
            suggestionsBox.style.display = "none";
        }
    });
}

/* ================================
   LOGIN
================================ */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Invalid credentials");
                return;
            }

            alert("Login successful");
            window.location.href = "index.html";

        } catch (err) {
            alert("Server error. Is backend running?");
        }
    });
}

/* ================================
   REGISTER
================================ */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            alert("Registration successful. Please login.");
            window.location.href = "login.html";

        } catch (err) {
            alert("Server error. Is backend running?");
        }
    });
}

/* ================================
   FORGOT PASSWORD (UI ONLY)
================================ */

const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {
    forgotForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("forgotEmail").value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailPattern.test(email)) {
            alert("Please enter a valid email");
            return;
        }

        alert("Password reset link sent (backend to be connected)");
        forgotForm.reset();
    });
}

/* ================================
   ADD ROOM (WITH IMAGE UPLOAD)
================================ */

document.addEventListener("DOMContentLoaded", function () {

    const addRoomForm = document.getElementById("addRoomForm");
    console.log("📌 addRoomForm:", addRoomForm);

    if (!addRoomForm) return;

    addRoomForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("🚀 Add room submitted");

        const formData = new FormData(addRoomForm);

        try {
            const res = await fetch("http://localhost:5000/api/rooms/add", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            console.log("📦 Response:", data);

            if (!res.ok) {
                alert(data.message || "Failed to add room");
                return;
            }

            alert("✅ Room added successfully!");
            addRoomForm.reset();

        } catch (error) {
            console.error("❌ Error:", error);
            alert("Server error. Is backend running?");
        }
    });
});
