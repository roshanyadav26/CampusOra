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

// Close suggestions when clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".autocomplete")) {
        suggestionsBox.style.display = "none";
    }
});
/* Login form*/
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            alert("Please fill in all fields");
            return;
        }

        alert("Login successful");
        
        // Redirect to homepage
        window.location.href = "index.html";
    });
}


/* Register form*/
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault(); // VERY IMPORTANT

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // ✅ Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // ✅ Indian phone number validation (10 digits, starts with 6–9)
        const phonePattern = /^[6-9]\d{9}$/;

        // ✅ Strong password validation
        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (name === "" || email === "" || phone === "" || password === "" || confirmPassword === "") {
            alert("All fields are required");
            return;
        }

        if (!emailPattern.test(email)) {
            alert("Invalid email format");
            return;
        }

        if (!phonePattern.test(phone)) {
            alert("Phone number must be 10 digits and start with 6-9");
            return;
        }

        if (!passwordPattern.test(password)) {
            alert(
                "Password must contain:\n" +
                "- Minimum 8 characters\n" +
                "- One uppercase letter\n" +
                "- One lowercase letter\n" +
                "- One number\n" +
                "- One special character"
            );
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        alert("Registration successful. Please login.");
        window.location.href = "login.html";
    });
}


/*Forget password*/
const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {
    forgotForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("forgotEmail").value.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            alert("Please enter your email address");
            return;
        }

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address");
            return;
        }

        alert("Password reset link sent to your email (backend to be connected)");
        forgotForm.reset();
    });
}

/*Rooms.*/
const roomsList = document.getElementById("roomsList");

if (roomsList) {
    const rooms = [
        {
            title: "2 BHK Flat near ABC Engineering College",
            bhk: "2 BHK",
            rent: 8000,
            distance: "1.2 km",
            location: "ABC College Road"
        },
        {
            title: "1 BHK Room near XYZ University",
            bhk: "1 BHK",
            rent: 5500,
            distance: "0.8 km",
            location: "XYZ Nagar"
        },
        {
            title: "3 BHK Apartment near City College",
            bhk: "3 BHK",
            rent: 12000,
            distance: "1.5 km",
            location: "City Center"
        }
    ];

    rooms.forEach(room => {
        const card = document.createElement("div");
        card.className = "room-card";

        card.innerHTML = `
            <h3>${room.title}</h3>
            <p><strong>BHK:</strong> ${room.bhk}</p>
            <p><strong>Rent:</strong> ₹${room.rent} / month</p>
            <p><strong>Distance:</strong> ${room.distance}</p>
            <p><strong>Location:</strong> ${room.location}</p>
            <button>View Details</button>
        `;

        roomsList.appendChild(card);
    });
}

