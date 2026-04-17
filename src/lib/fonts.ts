import { Baloo_2, Barlow } from "next/font/google";

export const baloo = Baloo_2({
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-baloo",
});

export const barlow = Barlow({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
});
