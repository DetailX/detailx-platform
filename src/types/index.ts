import { z } from "zod";

export const CATEGORIES = [
  "facade",
  "roofing",
  "foundation",
  "insulation",
  "joints",
  "waterproofing",
  "structural",
  "mep",
] as const;

export const BUILDING_TYPES = [
  "residential",
  "commercial",
  "industrial",
  "mixed-use",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type BuildingType = (typeof BUILDING_TYPES)[number];

export const categoryLabels: Record<Category, string> = {
  facade: "Facade",
  roofing: "Roofing",
  foundation: "Foundation",
  insulation: "Insulation",
  joints: "Joints",
  waterproofing: "Waterproofing",
  structural: "Structural",
  mep: "MEP",
};

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["firm", "buyer"]),
  firmName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const submitDetailSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(CATEGORIES),
  buildingType: z.enum(BUILDING_TYPES),
  price: z.number().min(100, "Minimum price is $1.00"),
  previewImageKey: z.string().min(1),
  detailFileKeys: z.string().min(1),
});
