export enum AdAspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  STANDARD = '4:3',
  TALL = '3:4'
}

export interface AdRequest {
  productName: string;
  description: string;
  targetUrl: string;
  style: string;
  aspectRatios: AdAspectRatio[];
}

export interface GeneratedAd {
  id: string;
  imageUrl: string;
  aspectRatio: AdAspectRatio;
  productName: string;
  targetUrl: string;
  createdAt: number;
}

export interface StyleOption {
  id: string;
  label: string;
  promptModifier: string;
}

export const STYLE_OPTIONS: StyleOption[] = [
  { id: 'minimal', label: 'Minimalist Clean', promptModifier: 'minimalist, clean white background, studio lighting, high-end, apple style' },
  { id: 'lifestyle', label: 'Lifestyle', promptModifier: 'lifestyle photography, in context use, warm natural lighting, authentic, bokeh' },
  { id: 'vibrant', label: 'Vibrant Pop', promptModifier: 'vibrant colors, pop art energy, high contrast, neon accents, bold' },
  { id: 'luxury', label: 'Dark Luxury', promptModifier: 'dark mood, golden accents, elegant, premium texture, cinematic lighting' },
  { id: 'corporate', label: 'Corporate Professional', promptModifier: 'professional, corporate blue tones, trustworthy, clean lines, business context' },
];