import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h3>CampusOra</h3>
          <p>
            Helping students find safe, affordable rooms near their colleges.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/rooms">Rooms</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="socials">
  <button className="social-btn">🌐</button>
  <button className="social-btn">📘</button>
  <button className="social-btn">📸</button>
  <button className="social-btn">🐦</button>
</div>

        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} CampusOra. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
