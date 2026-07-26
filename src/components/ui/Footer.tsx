import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto flex flex-col">
      {/* Top Section */}
      <div className="bg-surface-container-low border-t border-outline-variant/30 px-margin-page py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* ABOUT US */}
          <div className="flex flex-col gap-4">
            <h4 className="font-category-label text-[16px] font-black text-on-surface uppercase tracking-wider mb-2">
              About Us
            </h4>
            <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed">
              Rental Kamera, Lensa, Lighting, Stabilizer, Audio, Multimedia dll. Tersedia di {siteConfig.city}. Buka pukul {siteConfig.hours}.
              <br />
              <br />
              Feel free to contact us for all your production equipment needs.
            </p>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="flex flex-col gap-4 md:items-center">
            <h4 className="font-category-label text-[16px] font-black text-on-surface uppercase tracking-wider mb-2">
              Social Media
            </h4>
            <div className="flex items-center gap-6">
              {siteConfig.links.instagram && (
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface hover:text-primary transition-colors"
                  title="Instagram"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {siteConfig.links.facebook && (
                <a
                  href={siteConfig.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface hover:text-primary transition-colors"
                  title="Facebook"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* CONTACT US */}
          <div className="flex flex-col gap-4 md:items-end">
            <h4 className="font-category-label text-[16px] font-black text-on-surface uppercase tracking-wider mb-2 w-full md:text-right">
              Contact Us
            </h4>
            <div className="flex flex-col gap-2 font-body-md text-[15px] text-on-surface-variant md:text-right">
              <p>WhatsApp {siteConfig.whatsappFormatted} ({siteConfig.hours})</p>
              <p>{siteConfig.email}</p>
              <a
                href={siteConfig.links.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary hover:underline transition-colors"
              >
                {siteConfig.city}, {siteConfig.province}
              </a>
              <p>Kritik & Saran {siteConfig.whatsappFormatted} (WA)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="bg-surface-container-lowest border-t border-outline-variant/20 py-6 text-center">
        <p className="font-body-md text-[14px] text-on-surface-variant/70">
          © {currentYear} by {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
