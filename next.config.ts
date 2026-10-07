import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    const deletedToolSlugs = [
      'ssc',
      'rrb',
      'india-post-photo',
      'india-post-signature',
      'bank-thumb',
      'ibps-declaration',
      'neet-signature',
      'image-resizer',
      'image-compressor',
      'aspect-ratio-changer',
      'pdf-maker',
      'pdf-editor',
      'image-scanner',
      'image-format-converter',
      'image-rotate-flip',
      'image-cropper',
      'watermark-stamper',
      'bulk-image-converter',
      'gds-leave',
      'td-commission',
      'upi-qr',
    ];

    return deletedToolSlugs.map((slug) => ({
      source: `/tools/${slug}`,
      destination: '/tools',
      permanent: true,
    })).concat(
      // Gov templates removed in the corporate-focus redesign — send to the gallery
      ['government-letterpad', 'political-leader', 'gram-panchayat'].map(
        (slug) => ({
          source: `/templates/${slug}`,
          destination: '/templates',
          permanent: true,
        }),
      ),
    );
  },
};

export default nextConfig;
