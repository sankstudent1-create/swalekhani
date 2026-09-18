declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: any;
  export default content;
}

declare module 'next' {
  export type NextConfig = Record<string, any>;
  export type Metadata = any;
  export type Viewport = any;
  export namespace MetadataRoute {
    export type Manifest = any;
    export type Robots = any;
    export type Sitemap = any;
  }
}

declare module 'next/link' {
  const Link: any;
  export default Link;
}

declare module 'next/image' {
  const Image: any;
  export default Image;
}

declare module 'next/script' {
  const Script: any;
  export default Script;
}

declare module 'next/font/google' {
  export const Outfit: any;
  export const Poppins: any;
  export const JetBrains_Mono: any;
  export const Yatra_One: any;
  export const Inter: any;
  export const Roboto: any;
  export const Libre_Baskerville: any;
  export const Source_Serif_4: any;
  export const Noto_Serif_Devanagari: any;
  export const Noto_Sans_Devanagari: any;
  export const Tiro_Devanagari_Hindi: any;
  export const DM_Sans: any;
  export const DM_Mono: any;
  export const EB_Garamond: any;
}

declare module 'next/font/local' {
  const localFont: any;
  export default localFont;
}

declare module 'next/server' {
  export type NextRequest = any;
  export type NextResponse = any;
  export const NextRequest: any;
  export const NextResponse: any;
}

declare module 'next/navigation' {
  export const useRouter: any;
  export const usePathname: any;
  export const useSearchParams: any;
  export const useParams: any;
  export const redirect: (url: string) => never;
  export const notFound: () => never;
}

declare module 'next/types.js' {
  export type ResolvingMetadata = Promise<any>;
  export type ResolvingViewport = Promise<any>;
}

declare module 'next/server.js' {
  export type NextRequest = any;
  export type NextResponse = any;
  export const NextRequest: any;
  export const NextResponse: any;
}

declare module 'next/navigation.js' {
  export const useRouter: any;
  export const usePathname: any;
  export const useSearchParams: any;
  export const useParams: any;
  export const redirect: (url: string) => never;
  export const notFound: () => never;
}
