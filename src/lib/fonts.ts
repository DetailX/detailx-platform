import { Baloo_2, DM_Sans } from "next/font/google";

export const baloo = Baloo_2({
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-baloo",
});

export const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});
