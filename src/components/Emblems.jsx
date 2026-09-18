import React from 'react';

/**
 * High-fidelity Vector Emblems compliant with State Emblem of India Act, 2005
 * Note: Under Section 3 & 7 of the 2005 Act, the State Emblem MUST ALWAYS carry
 * the motto "सत्यमेव जयते" in Devanagari script.
 */

export function AshokaEmblem({ size = 80, color = '#7c2d12' }) {
  // Using rich antique bronze/deep gold/indigo as used in official D.O. letterheads
  return (
    <div className="emblem-container" style={{ width: size, textAlign: 'center', display: 'inline-block' }}>
      <svg
        viewBox="0 0 200 240"
        width={size}
        height={(size * 240) / 200}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="emblem-svg"
      >
        <g fill={color} stroke={color} strokeWidth="1.2">
          {/* Central Lion Head & Mane */}
          <path d="M100 25 C92 25, 86 32, 86 42 C86 52, 90 58, 88 68 C87 74, 83 78, 83 85 C83 95, 90 102, 100 102 C110 102, 117 95, 117 85 C117 78, 113 74, 112 68 C110 58, 114 52, 114 42 C114 32, 108 25, 100 25 Z" fill={color} opacity="0.95"/>
          {/* Lion Eyes, Snout & Whiskers */}
          <circle cx="94" cy="52" r="3" fill="#fff" />
          <circle cx="106" cy="52" r="3" fill="#fff" />
          <path d="M98 62 L102 62 L100 66 Z" fill="#fff" />
          <path d="M93 72 Q100 78 107 72" stroke="#fff" strokeWidth="2" fill="none" />
          {/* Central Crown / Crest */}
          <path d="M95 18 L100 8 L105 18 Z" fill={color} />
          
          {/* Left Lion (Profile facing Left) */}
          <path d="M72 45 C65 42, 55 48, 55 60 C55 72, 60 78, 62 88 C63 94, 68 100, 78 102 C82 92, 80 75, 78 65 C76 56, 75 48, 72 45 Z" fill={color} opacity="0.9" />
          <circle cx="63" cy="62" r="2.5" fill="#fff" />
          <path d="M57 70 Q62 74 67 71" stroke="#fff" strokeWidth="1.5" fill="none" />

          {/* Right Lion (Profile facing Right) */}
          <path d="M128 45 C135 42, 145 48, 145 60 C145 72, 140 78, 138 88 C137 94, 132 100, 122 102 C118 92, 120 75, 122 65 C124 56, 125 48, 128 45 Z" fill={color} opacity="0.9" />
          <circle cx="137" cy="62" r="2.5" fill="#fff" />
          <path d="M143 70 Q138 74 133 71" stroke="#fff" strokeWidth="1.5" fill="none" />

          {/* Lions' Paws & Chest Pedestal */}
          <rect x="52" y="102" width="96" height="8" rx="3" fill={color} />

          {/* Abacus (Chakra Platform) */}
          <path d="M38 114 L162 114 L158 142 L42 142 Z" fill={color} opacity="0.88" />
          
          {/* Ashoka Chakra in Center of Abacus */}
          <circle cx="100" cy="128" r="11" fill="#fff" stroke={color} strokeWidth="2.5" />
          <circle cx="100" cy="128" r="2.5" fill={color} />
          {/* 24 spokes (represented cleanly) */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1={100 + 3 * Math.cos((deg * Math.PI) / 180)}
              y1={128 + 3 * Math.sin((deg * Math.PI) / 180)}
              x2={100 + 10 * Math.cos((deg * Math.PI) / 180)}
              y2={128 + 10 * Math.sin((deg * Math.PI) / 180)}
              stroke={color}
              strokeWidth="1.2"
            />
          ))}

          {/* Bull on Left Abacus */}
          <path d="M52 134 C50 128, 56 122, 64 122 C70 122, 74 126, 75 132 C70 134, 60 135, 52 134 Z" fill="#fff" />
          
          {/* Galloping Horse on Right Abacus */}
          <path d="M148 134 C150 128, 144 122, 136 122 C130 122, 126 126, 125 132 C130 134, 140 135, 148 134 Z" fill="#fff" />

          {/* Lotus Base / Bell-shaped Lotus */}
          <path d="M45 146 C60 162, 140 162, 155 146 C145 170, 55 170, 45 146 Z" fill={color} opacity="0.9" />
          <path d="M60 152 Q100 165 140 152" stroke="#fff" strokeWidth="2" fill="none" />
          
          {/* Base Platform Bar */}
          <rect x="50" y="168" width="100" height="4" rx="2" fill={color} />
        </g>

        {/* STATUTORY MANDATORY MOTTO: सत्यमेव जयते */}
        <text
          x="100"
          y="204"
          textAnchor="middle"
          fontSize="24"
          fontWeight="800"
          fontFamily="'Tiro Devanagari Marathi', 'Mukta', sans-serif"
          fill={color}
          letterSpacing="2"
        >
          सत्यमेव जयते
        </text>
      </svg>
    </div>
  );
}

/**
 * Official Right to Information (RTI) Emblem used alongside D.O. letterheads
 */
export function RtiLogo({ size = 44 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="10" width="70" height="80" rx="6" fill="#0284c7" />
        {/* Horizontal text lines representing document */}
        <line x1="30" y1="28" x2="70" y2="28" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <line x1="30" y1="42" x2="70" y2="42" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <line x1="30" y1="56" x2="58" y2="56" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <line x1="30" y1="70" x2="50" y2="70" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        {/* Eye/Magnifying indicator representing transparency */}
        <circle cx="68" cy="68" r="16" fill="#0284c7" stroke="#ffffff" strokeWidth="4" />
        <circle cx="68" cy="68" r="7" fill="#ffffff" />
      </svg>
      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0284c7', lineHeight: 1.1, textAlign: 'left' }}>
        <div>RIGHT TO</div>
        <div>INFORMATION</div>
      </div>
    </div>
  );
}

export function MaharashtraStateSeal({ size = 80, color = '#991b1b' }) {
  return (
    <div className="emblem-container" style={{ width: size, textAlign: 'center', display: 'inline-block' }}>
      <svg
        viewBox="0 0 220 220"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="emblem-svg"
      >
        <circle cx="110" cy="110" r="102" stroke={color} strokeWidth="4" fill="#fff" />
        <circle cx="110" cy="110" r="94" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />

        <g fill={color}>
          <text
            x="110"
            y="36"
            textAnchor="middle"
            fontSize="16"
            fontWeight="800"
            fontFamily="'Tiro Devanagari Marathi', 'Mukta', sans-serif"
          >
            ★ महाराष्ट्र शासन ★
          </text>

          {/* Historic Shivaji Maharaj Rajmudra Text (Octagonal) */}
          <polygon
            points="110,48 165,70 178,125 140,168 80,168 42,125 55,70"
            stroke={color}
            strokeWidth="2.5"
            fill="#fffbeb"
          />

          <text x="110" y="74" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="'Tiro Devanagari Marathi', serif">
            प्रतिपच्चंद्रलेखेव
          </text>
          <text x="110" y="90" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="'Tiro Devanagari Marathi', serif">
            वर्धिष्णुर्विश्ववंदिता
          </text>
          <text x="110" y="106" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="'Tiro Devanagari Marathi', serif">
            शाहसूनोः शिवस्यैषा
          </text>
          <text x="110" y="122" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="'Tiro Devanagari Marathi', serif">
            मुद्रा भद्राय
          </text>
          <text x="110" y="138" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="'Tiro Devanagari Marathi', serif">
            राजते
          </text>

          <path d="M50 148 L56 148 L53 140 Z" fill={color} />
          <path d="M170 148 L164 148 L167 140 Z" fill={color} />

          <text
            x="110"
            y="192"
            textAnchor="middle"
            fontSize="12.5"
            fontWeight="800"
            fontFamily="'Tiro Devanagari Marathi', sans-serif"
          >
            सत्यमेव जयते
          </text>
          <text
            x="110"
            y="206"
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            fontFamily="'Inter', sans-serif"
            fill="#64748b"
          >
            GOVT. OF MAHARASHTRA
          </text>
        </g>
      </svg>
    </div>
  );
}

export function BharatSarkarSeal({ size = 80, color = '#15803d' }) {
  return (
    <div className="emblem-container" style={{ width: size, textAlign: 'center', display: 'inline-block' }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="emblem-svg"
      >
        <circle cx="100" cy="100" r="92" stroke={color} strokeWidth="3" fill="#f0fdf4" />
        <circle cx="100" cy="100" r="85" stroke={color} strokeWidth="1" strokeDasharray="4 2" />

        <text x="100" y="32" textAnchor="middle" fontSize="13" fontWeight="800" fill={color} fontFamily="'Mukta', sans-serif">
          भारत सरकार
        </text>

        <g transform="translate(60, 42) scale(0.4)">
          <path d="M100 25 C92 25, 86 32, 86 42 C86 52, 90 58, 88 68 C87 74, 83 78, 83 85 C83 95, 90 102, 100 102 C110 102, 117 95, 117 85 C117 78, 113 74, 112 68 C110 58, 114 52, 114 42 C114 32, 108 25, 100 25 Z" fill={color} />
          <rect x="52" y="102" width="96" height="8" rx="3" fill={color} />
          <path d="M38 114 L162 114 L158 142 L42 142 Z" fill={color} />
          <circle cx="100" cy="128" r="11" fill="#fff" />
          <path d="M45 146 C60 162, 140 162, 155 146 C145 170, 55 170, 45 146 Z" fill={color} />
        </g>

        <text x="100" y="145" textAnchor="middle" fontSize="13" fontWeight="800" fill={color} fontFamily="'Tiro Devanagari Marathi', sans-serif">
          सत्यमेव जयते
        </text>

        <text x="100" y="172" textAnchor="middle" fontSize="10" fontWeight="700" fill={color} fontFamily="'Inter', sans-serif">
          GOVERNMENT OF INDIA
        </text>
      </svg>
    </div>
  );
}

export function VidhanMandalEmblem({ size = 80, color = '#7c2d12' }) {
  return (
    <div className="emblem-container" style={{ width: size, textAlign: 'center', display: 'inline-block' }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="emblem-svg"
      >
        <circle cx="100" cy="100" r="90" stroke={color} strokeWidth="3" fill="#fffaf5" />
        <circle cx="100" cy="100" r="82" stroke={color} strokeWidth="1" strokeDasharray="3 3" />

        <text x="100" y="34" textAnchor="middle" fontSize="13" fontWeight="800" fill={color} fontFamily="'Mukta', sans-serif">
          ★ विधिमंडळ सचिवालय ★
        </text>

        <g fill={color}>
          <path d="M60 120 L140 120 L135 128 L65 128 Z" />
          <rect x="70" y="85" width="8" height="35" rx="2" />
          <rect x="88" y="85" width="8" height="35" rx="2" />
          <rect x="104" y="85" width="8" height="35" rx="2" />
          <rect x="122" y="85" width="8" height="35" rx="2" />
          <path d="M80 85 C80 60, 120 60, 120 85 Z" />
          <line x1="100" y1="58" x2="100" y2="48" stroke={color} strokeWidth="2" />
          <polygon points="100,48 108,52 100,56" />
        </g>

        <text x="100" y="152" textAnchor="middle" fontSize="11" fontWeight="700" fill={color} fontFamily="'Mukta', sans-serif">
          लोकप्रतिनिधी पत्र
        </text>
        <text x="100" y="172" textAnchor="middle" fontSize="9" fontWeight="600" fill="#78716c" fontFamily="'Inter', sans-serif">
          LEGISLATIVE ASSEMBLY
        </text>
      </svg>
    </div>
  );
}

export function CustomLogoDisplay({ logoUrl, orgName = 'LOGO', size = 80 }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={orgName}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          borderRadius: 8,
          border: '1px solid #e2e8f0'
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: '#f1f5f9',
        border: '2px dashed #94a3b8',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontWeight: 600,
        fontSize: '0.8rem',
        padding: 4,
        textAlign: 'center'
      }}
    >
      <span>{orgName?.slice(0, 10) || 'LOGO'}</span>
      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>चिन्ह / लोगो</span>
    </div>
  );
}

/**
 * Universal Emblem Dispatcher
 */
export function RenderEmblem({ type, logoUrl, orgName, size = 80 }) {
  switch (type) {
    case 'ASHOKA_EMBLEM':
      return <AshokaEmblem size={size} />;
    case 'STATE_SEAL':
      return <MaharashtraStateSeal size={size} />;
    case 'BHARAT_SARKAR':
      return <BharatSarkarSeal size={size} />;
    case 'VIDHAN_MANDAL':
      return <VidhanMandalEmblem size={size} />;
    case 'CUSTOM':
      return <CustomLogoDisplay logoUrl={logoUrl} orgName={orgName} size={size} />;
    case 'NONE':
    default:
      return null;
  }
}
