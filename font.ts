// fonts.ts
import { Edu_AU_VIC_WA_NT_Guides } from 'next/font/google';

export const heroFont = Edu_AU_VIC_WA_NT_Guides({
  subsets: ['latin'],
  variable: '--font-hero', // this creates a CSS variable-based class
});
