const roomsList = document.getElementById("roomsList");

async function loadRooms() {
    try {
        const res = await fetch("http://localhost:5000/api/rooms");
        const rooms = await res.json();

        if (rooms.length === 0) {
            roomsList.innerHTML = "<p>No rooms available</p>";
            return;
        }

        roomsList.innerHTML = "";

        rooms.forEach(room => {
            const card = document.createElement("div");
            card.className = "room-card";

            card.innerHTML = `
                <img src="http://localhost:5000/uploads/${room.image}" alt="Room Image">
                <h3>${room.title}</h3>
                <p><strong>BHK:</strong> ${room.bhk}</p>
                <p><strong>Rent:</strong> ₹${room.rent}/month</p>
                <p><strong>Distance:</strong> ${room.distance}</p>
                <p><strong>Location:</strong> ${room.location}</p>
                <button class="view-btn">View Details</button>
            `;

            roomsList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        roomsList.innerHTML = "<p>Failed to load rooms</p>";
    }
}

loadRooms();
