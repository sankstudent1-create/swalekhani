import React from 'react';

export default function SoftwareAppSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Swalekhani",
    "alternateName": ["Swalekhani Letterpad Studio", "स्व-लेखनी"],
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All (Web Browser, Windows, macOS, Android, iOS)",
    "description": "India's official AI-powered letterpad generator and document drafting platform. Generate Government of India, departmental, bilingual Hindi-English, and professional letterpads with instant PDF export.",
    "url": "https://www.swalekhani.com/tools/letterpad-generator",
    "image": "https://www.swalekhani.com/icon-512.png",
    "author": {
      "@type": "Organization",
      "name": "SW InfoSystems",
      "url": "https://www.swinfosystems.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "featureList": [
      "AI Official Letter Drafting in English, Hindi & Marathi",
      "Official Government of India & State Secretariat Templates",
      "India Post, Sansad, Ministry & Institutional Letterheads",
      "Devanagari Bilingual Typography Support",
      "Endorsement & Copy-To Section Controls",
      "Integrated Digital Signature Pad",
      "Instant Vector A4 PDF Export"
    ],
    "inLanguage": ["en", "hi", "mr"]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
