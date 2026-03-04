import "./HowItWorks.css";

function HowItWorks() {
  return (
    <div className="how-container">

      <h1 className="how-title">How CampusOra Works</h1>
      <p className="how-subtitle">
        Making off-campus living simple, safe, and stress-free for students.
      </p>

      <div className="steps">

        <div className="step-card">
          <h2>1. Search Nearby Rooms</h2>
          <p>
            Students can instantly find rooms near their college using
            smart location-based search and filters like rent, BHK, and facilities.
          </p>
        </div>

        <div className="step-card">
          <h2>2. View Exact Location</h2>
          <p>
            Every room includes a map location so students know exactly
            where they are going — just like Zomato or delivery apps.
          </p>
        </div>

        <div className="step-card">
          <h2>3. Verified Room Details</h2>
          <p>
            See amenities like electricity, water supply, furnished status,
            nearby hospital, parks, Wi-Fi and more before visiting.
          </p>
        </div>

        <div className="step-card">
          <h2>4. Owners List Their Rooms</h2>
          <p>
            Property owners can easily upload rooms with images,
            description, and location using the Add Room dashboard.
          </p>
        </div>

        <div className="step-card">
          <h2>5. Connect Directly</h2>
          <p>
            Students can contact owners directly — no brokers,
            no hidden charges, no confusion.
          </p>
        </div>

      </div>

    </div>
  );
}

export default HowItWorks;
