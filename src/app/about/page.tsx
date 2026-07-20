"use client";

import { siteConfig } from "@/config/site";

export default function AboutPage() {
  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Filmmaker Independen",
      text: "Gear dari Abon Kamera selalu dalam kondisi prima. Baterai penuh, sensor bersih, dan pelayanannya sangat cepat. Sangat direkomendasikan untuk produksi di Semarang!",
      stars: 5
    },
    {
      name: "Siska Saraswati",
      role: "Wedding Photographer",
      text: "Sering banget dadakan butuh lensa tambahan untuk liputan wedding, dan Abon Kamera selalu bisa diandalkan. Adminnya responsif dan bisa booking via WhatsApp 24 jam.",
      stars: 5
    },
    {
      name: "Andi Pratama",
      role: "Content Creator",
      text: "Pilihan gear-nya lengkap banget dari kamera, lensa, sampai lighting. Harga sewanya juga paling masuk akal di Semarang. Sukses terus Abon Kamera!",
      stars: 5
    }
  ];

  return (
    <div className="bg-background min-h-screen flex flex-col text-on-surface">
      {/* Hero / About Us Section */}
      <section className="py-16 md:py-24 px-margin-page bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-[48px] text-primary mb-6">info</span>
          <h1 className="font-display-xl text-[40px] md:text-[56px] uppercase font-black text-on-surface leading-none mb-6">
            Tentang <span className="text-primary">Kami</span>
          </h1>
          <p className="font-body-md text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed">
            {siteConfig.description}. Kami hadir untuk mendukung kreativitas para sineas, fotografer, dan content creator di Semarang dan sekitarnya. Dengan peralatan yang selalu terawat, kalibrasi presisi, dan ketersediaan 24 jam, kami memastikan setiap momen berharga Anda terekam dengan sempurna.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-margin-page bg-surface-container-low border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display-xl text-[32px] md:text-[40px] uppercase font-black text-on-surface">
              Apa Kata Mereka
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex gap-1 mb-4 text-primary">
                  {[...Array(t.stars)].map((_, idx) => (
                    <span key={idx} className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  ))}
                </div>
                <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed flex-grow italic mb-6">
                  "{t.text}"
                </p>
                <div>
                  <h4 className="font-category-label font-bold text-[16px] text-on-surface">{t.name}</h4>
                  <span className="font-category-label text-[13px] text-primary">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us / Map Section */}
      <section className="py-16 md:py-24 px-margin-page bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Contact Info */}
            <div className="flex flex-col">
              <h2 className="font-display-xl text-[32px] md:text-[40px] uppercase font-black text-on-surface mb-8">
                Visit <span className="text-primary">Us</span>
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mt-1">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>location_on</span>
                  </div>
                  <div>
                    <h3 className="font-category-label font-bold text-[18px] text-on-surface mb-1">Alamat</h3>
                    <p className="font-body-md text-[16px] text-on-surface-variant leading-relaxed">
                      {siteConfig.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mt-1">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>schedule</span>
                  </div>
                  <div>
                    <h3 className="font-category-label font-bold text-[18px] text-on-surface mb-1">Jam Operasional</h3>
                    <p className="font-body-md text-[16px] text-on-surface-variant leading-relaxed">
                      Setiap Hari<br/>
                      {siteConfig.hours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mt-1">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>forum</span>
                  </div>
                  <div>
                    <h3 className="font-category-label font-bold text-[18px] text-on-surface mb-1">Hubungi Kami</h3>
                    <p className="font-body-md text-[16px] text-on-surface-variant leading-relaxed mb-3">
                      Booking cepat via WhatsApp 24 Jam.
                    </p>
                    <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex bg-primary text-on-primary font-category-label text-[14px] font-bold uppercase px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all active:scale-95 items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      Chat WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Frame */}
            <div className="bg-surface-container border border-outline-variant/30 p-2 rounded-2xl shadow-sm h-[400px] lg:h-[500px]">
              <iframe
                src="https://maps.google.com/maps?q=Abon%20Kamera%20Semarang&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
