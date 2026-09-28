import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="foundry-footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 style={{ fontFamily: "var(--font-display)" }}>The Foundry</h5>
            <p>An immersive fine dining experience crafted with passion, precision, and the finest ingredients.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/menu/main">Main Courses</Link></li>
              <li><Link to="/menu/drinks-desserts">Drinks & Desserts</Link></li>
              <li><Link to="/my-account">Reservations</Link></li>
              <li><Link to="/team">FAQ</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Visit Us</h5>
            <p>
              123 Forge Lane<br />
              Ames, Iowa 50011<br />
              (515) 555-0142
            </p>
            <p>Open Tue–Sun · 5:00 PM – 11:00 PM</p>
          </div>
        </div>
        <hr style={{ borderColor: "rgba(201,168,76,0.15)" }} />
        <p className="text-center mb-0" style={{ fontSize: "0.8rem" }}>
          &copy; 2026 The Foundry — SE/COM S 3190 Final Project · MS_12, Joshua Reis & Grayson Burton
        </p>
      </div>
    </footer>
  );
}
