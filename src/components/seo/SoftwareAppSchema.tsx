import React from 'react';

export default function SoftwareAppSchema() {
 const schemaData = {
 "@context": "https://schema.org",
 "@type": "SoftwareApplication",
 "name": "Swalekhani",
 "alternateName": ["Swalekhani Letterpad Studio", "स्व-लेखनी"],
 "applicationCategory": "BusinessApplication",
 "operatingSystem": "All (Web Browser, Windows, macOS, Android, iOS)",
 "description": "India's professional AI-powered letterpad generator and document drafting platform. Generate corporate, legal, bilingual Hindi-English, and personal letterpads with instant PDF export.",
 "url": "https://swalekhani.vercel.app/tools/letterpad-generator",
 "image": "https://swalekhani.vercel.app/icon-512.png",
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
 "AI Business Letter Drafting in English, Hindi & Marathi",
 "Corporate, Startup & Institutional Letterhead Templates",
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
