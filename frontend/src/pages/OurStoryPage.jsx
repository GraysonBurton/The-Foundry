export default function OurStoryPage() {
  return (
    <div className="page-content">
      {/* Hero */}
      <section
        className="hero-section"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400)",
          minHeight: "50vh",
        }}
      >
        <div className="hero-content">
          <p style={{ color: "var(--color-gold)", textTransform: "uppercase", letterSpacing: "4px", fontSize: "0.85rem" }}>
            Since 2026
          </p>
          <h1>Our Story</h1>
          <p>The passion, the craft, and the people behind The Foundry</p>
        </div>
      </section>

      {/* Story Content */}
      <section className="section-dark">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="row align-items-center mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600"
                alt="Chef at work"
                className="img-fluid"
                style={{ borderRadius: "4px" }}
              />
            </div>
            <div className="col-md-6">
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}>
                The Beginning
              </h3>
              <p style={{ color: "var(--color-text-muted)", lineHeight: "1.9" }}>
                The Foundry was born from a simple idea: food is transformation.
                Just as raw metal is shaped by fire into something enduring, the
                finest ingredients are forged through heat, time, and skill into
                dishes that tell a story.
              </p>
              <p style={{ color: "var(--color-text-muted)", lineHeight: "1.9" }}>
                Founded in 2026 in the heart of Ames, Iowa, our restaurant draws
                inspiration from the industrial spirit of the Midwest — honest,
                hardworking, and built to last.
              </p>
            </div>
          </div>

          <div className="row align-items-center mb-5 flex-md-row-reverse">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
                alt="Signature dish"
                className="img-fluid"
                style={{ borderRadius: "4px" }}
              />
            </div>
            <div className="col-md-6">
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}>
                Our Philosophy
              </h3>
              <p style={{ color: "var(--color-text-muted)", lineHeight: "1.9" }}>
                We believe every ingredient deserves respect. Our chefs work
                directly with local farmers and artisan producers to source the
                freshest seasonal ingredients. Nothing leaves our kitchen without
                passing through hands that care deeply about the craft.
              </p>
              <p style={{ color: "var(--color-text-muted)", lineHeight: "1.9" }}>
                From our dry-aged steaks to our house-made pasta, every dish
                reflects our commitment to authenticity and excellence.
              </p>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600"
                alt="Restaurant interior"
                className="img-fluid"
                style={{ borderRadius: "4px" }}
              />
            </div>
            <div className="col-md-6">
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}>
                The Experience
              </h3>
              <p style={{ color: "var(--color-text-muted)", lineHeight: "1.9" }}>
                Step inside The Foundry and you'll find a space designed for
                connection. Warm lighting, exposed brick, and an open kitchen
                create an atmosphere where every meal feels like an event.
              </p>
              <p style={{ color: "var(--color-text-muted)", lineHeight: "1.9" }}>
                Whether you're celebrating a milestone or simply enjoying a
                Tuesday evening, The Foundry is your place to slow down,
                savor, and share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-elevated">
        <div className="container">
          <h2 className="section-title">Gallery</h2>
          <div className="gold-divider"></div>
          <div className="row g-3">
            {[
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500",
              "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500",
              "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
              "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500",
              "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500",
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
            ].map((src, i) => (
              <div className="col-6 col-md-4" key={i}>
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="img-fluid"
                  style={{
                    borderRadius: "4px",
                    height: "220px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
