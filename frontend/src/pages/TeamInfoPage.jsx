import { useState } from "react";

export default function TeamInfoPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How do I make a reservation?",
      a: "Sign in to your account, navigate to 'My Orders' in the navigation bar, and select the 'Reservations' tab. Fill out the booking form with your preferred date, time, and party size.",
    },
    {
      q: "Can I modify or cancel my reservation?",
      a: "Yes! Go to your account page and find your reservation. You can update the details or cancel it anytime before the reservation date.",
    },
    {
      q: "How does the ordering system work?",
      a: "Browse our menu, click on any dish to view details, and click 'Add to Order' to add it to your cart. You can manage quantities and special instructions from the 'My Orders' tab.",
    },
    {
      q: "What dietary options are available?",
      a: "We offer vegetarian, vegan, gluten-free, dairy-free, and nut-free options. Use the dietary filters on our Drinks & Desserts menu page to find items matching your preferences.",
    },
    {
      q: "How do I leave a review?",
      a: "Navigate to any dish details page while signed in. Scroll down to the reviews section, select a star rating, write your comment, and submit.",
    },
    {
      q: "What is an admin account?",
      a: "Admin accounts have access to the Admin Dashboard where they can manage the full menu catalog, moderate customer reviews, and oversee all reservations.",
    },
    {
      q: "What technologies power this application?",
      a: "The Foundry is built with React.js on the frontend, Node.js/Express.js on the backend, and MongoDB for the database. It uses Bootstrap for responsive styling and JWT for authentication.",
    },
  ];

  return (
    <div className="page-content">
      {/* Hero */}
      <section
        className="hero-section"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400)",
          minHeight: "40vh",
        }}
      >
        <div className="hero-content">
          <h1>Team & FAQ</h1>
          <p>Meet the developers and find answers to common questions</p>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-dark">
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 className="section-title">Meet the Team</h2>
          <p className="section-subtitle">SE/COM S 3190 · Spring 2026 · Team MS_12</p>
          <div className="gold-divider"></div>

          <div className="row g-4 mb-5">
            {[
              {
                name: "Joshua Reis",
                role: "Admin & Core Data Management",
                pages: "Home Page, Menu Listing 1, Dish Details, Admin Dashboard",
                features: "Menu Catalog Management, Reviews & Feedback Management",
                desc: "Responsible for building the menu catalog system with full CRUD operations, the dish details page with review integration, and the admin dashboard for system management.",
              },
              {
                name: "Grayson Burton",
                role: "User Interaction & Experience",
                pages: "Our Story, Menu Listing 2, My Reservations & Orders, Team Info/FAQ",
                features: "Reservation Management, Active Order/Cart Management",
                desc: "Responsible for the reservation booking system, order cart management, dietary-filtered menu browsing, and the story/FAQ content pages.",
              },
            ].map((member, i) => (
              <div className="col-md-6" key={i}>
                <div
                  style={{
                    background: "var(--color-bg-card)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    borderRadius: "4px",
                    padding: "1.5rem",
                    height: "100%",
                  }}
                >
                  <h4 style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}>
                    {member.name}
                  </h4>
                  <p style={{ color: "var(--color-cream)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                    {member.role}
                  </p>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", lineHeight: "1.7" }}>
                    {member.desc}
                  </p>
                  <div className="mt-2">
                    <small style={{ color: "var(--color-text-muted)" }}>
                      <strong style={{ color: "var(--color-cream)" }}>Pages:</strong> {member.pages}
                    </small>
                  </div>
                  <div className="mt-1">
                    <small style={{ color: "var(--color-text-muted)" }}>
                      <strong style={{ color: "var(--color-cream)" }}>Features:</strong> {member.features}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="gold-divider"></div>

          <div>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="mb-2"
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <button
                  className="w-100 text-start border-0 p-3 d-flex justify-content-between align-items-center"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    background: "transparent",
                    color: "var(--color-cream)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  {faq.q}
                  <span style={{ color: "var(--color-gold)", fontSize: "1.2rem" }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div
                    className="px-3 pb-3"
                    style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: "1.7" }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
