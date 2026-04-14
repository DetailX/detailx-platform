import { db } from "./index";
import { users, details, purchases, uploads, userEvents } from "./schema";
import { hashSync } from "bcryptjs";
import { sql } from "drizzle-orm";

// Helper: date relative to Apr 14 2026
function d(daysAgo: number, hour = 9, min = 0): Date {
  const dt = new Date("2026-04-14T00:00:00");
  dt.setDate(dt.getDate() - daysAgo);
  dt.setHours(hour, min, 0, 0);
  return dt;
}
function meta(obj: Record<string, unknown> | null): string | null {
  return obj ? JSON.stringify(obj) : null;
}

const password = hashSync("password123", 10);

const firmUsers = [
  {
    id: "firm-1",
    name: "Sarah Chen",
    email: "sarah@arcstudio.com",
    passwordHash: password,
    role: "firm" as const,
    firmName: "ARC Studio Architects",
  },
  {
    id: "firm-2",
    name: "Marcus Weber",
    email: "marcus@weberdesign.com",
    passwordHash: password,
    role: "firm" as const,
    firmName: "Weber Design Group",
  },
  {
    id: "firm-3",
    name: "Priya Patel",
    email: "priya@modernform.com",
    passwordHash: password,
    role: "firm" as const,
    firmName: "Modern Form Architecture",
  },
];

const buyerUsers = [
  {
    id: "buyer-1",
    name: "James Morrison",
    email: "james@buildcorp.com",
    passwordHash: password,
    role: "buyer" as const,
    firmName: null,
  },
  {
    id: "buyer-2",
    name: "Lisa Nakamura",
    email: "lisa@constructionplus.com",
    passwordHash: password,
    role: "buyer" as const,
    firmName: null,
  },
];

const adminUsers = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@detailx.com",
    passwordHash: hashSync("admin123", 10),
    role: "admin" as const,
    firmName: null,
  },
];

type UploadStatus = "pending" | "processing" | "completed" | "failed";

const mockUploads: {
  id: string;
  userId: string;
  projectName: string;
  fileName: string;
  fileType: string;
  status: UploadStatus;
  location: string;
  notes: string | null;
  createdAt: Date;
}[] = [
  // Apr 14 (today) — 3 uploads
  { id: "upload-1",  userId: "firm-1", projectName: "Marina Tower",          fileName: "facade-section.pdf",     fileType: "pdf", status: "completed",  location: "New York, NY",       notes: "Ventilated rain screen — ready for review.",       createdAt: new Date("2026-04-14T09:15:00") },
  { id: "upload-2",  userId: "firm-2", projectName: "Marina Tower",          fileName: "foundation-plan.dwg",    fileType: "dwg", status: "processing", location: "New York, NY",       notes: null,                                              createdAt: new Date("2026-04-14T11:30:00") },
  { id: "upload-3",  userId: "firm-3", projectName: "Marina Tower",          fileName: "mep-diagram.dxf",        fileType: "dxf", status: "pending",    location: "New York, NY",       notes: "Awaiting engineer sign-off.",                     createdAt: new Date("2026-04-14T14:00:00") },
  // Apr 13 — 2 uploads
  { id: "upload-4",  userId: "firm-1", projectName: "Civic Center Expansion","fileName": "roof-assembly.pdf",    fileType: "pdf", status: "completed",  location: "Chicago, IL",        notes: null,                                              createdAt: new Date("2026-04-13T08:45:00") },
  { id: "upload-5",  userId: "firm-2", projectName: "Riverside Condos",      fileName: "insulation-detail.dwg",  fileType: "dwg", status: "failed",     location: "Los Angeles, CA",    notes: "File corrupted — resubmission required.",         createdAt: new Date("2026-04-13T15:20:00") },
  // Apr 12 — 3 uploads
  { id: "upload-6",  userId: "firm-1", projectName: "Harbor View",           fileName: "waterproofing-spec.pdf", fileType: "pdf", status: "completed",  location: "Miami, FL",          notes: null,                                              createdAt: new Date("2026-04-12T09:00:00") },
  { id: "upload-7",  userId: "firm-3", projectName: "Tech Campus Phase 2",   fileName: "structural-joint.dxf",   fileType: "dxf", status: "completed",  location: "San Francisco, CA",  notes: null,                                              createdAt: new Date("2026-04-12T11:00:00") },
  { id: "upload-8",  userId: "firm-2", projectName: "Tech Campus Phase 2",   fileName: "mep-shaft.dwg",          fileType: "dwg", status: "pending",    location: "San Francisco, CA",  notes: "Pending format check.",                           createdAt: new Date("2026-04-12T16:30:00") },
  // Apr 11 — 2 uploads
  { id: "upload-9",  userId: "firm-1", projectName: "Stadium Redevelopment", fileName: "expansion-joint.pdf",    fileType: "pdf", status: "completed",  location: "Chicago, IL",        notes: null,                                              createdAt: new Date("2026-04-11T10:10:00") },
  { id: "upload-10", userId: "firm-3", projectName: "Airport Terminal C",    fileName: "facade-panel.dxf",       fileType: "dxf", status: "processing", location: "Dallas, TX",         notes: "Large file — processing may take up to 10 min.", createdAt: new Date("2026-04-11T13:45:00") },
  // Apr 10 — 4 uploads
  { id: "upload-11", userId: "firm-2", projectName: "Museum Expansion",      fileName: "curtain-wall.dwg",       fileType: "dwg", status: "completed",  location: "Boston, MA",         notes: null,                                              createdAt: new Date("2026-04-10T09:30:00") },
  { id: "upload-12", userId: "firm-1", projectName: "Museum Expansion",      fileName: "roofing-detail.pdf",     fileType: "pdf", status: "completed",  location: "Boston, MA",         notes: null,                                              createdAt: new Date("2026-04-10T10:00:00") },
  { id: "upload-13", userId: "firm-3", projectName: "Highrise Tower",        fileName: "pile-cap.dxf",           fileType: "dxf", status: "failed",     location: "New York, NY",       notes: "Schema version mismatch — needs re-export.",      createdAt: new Date("2026-04-10T14:20:00") },
  { id: "upload-14", userId: "firm-1", projectName: "Highrise Tower",        fileName: "window-install.pdf",     fileType: "pdf", status: "pending",    location: "New York, NY",       notes: null,                                              createdAt: new Date("2026-04-10T16:00:00") },
  // Apr 9 — 2 uploads
  { id: "upload-15", userId: "firm-2", projectName: "Corporate HQ",          fileName: "moment-frame.dwg",       fileType: "dwg", status: "completed",  location: "Seattle, WA",        notes: null,                                              createdAt: new Date("2026-04-09T08:00:00") },
  { id: "upload-16", userId: "firm-3", projectName: "Corporate HQ",          fileName: "firestop-assy.dxf",      fileType: "dxf", status: "completed",  location: "Seattle, WA",        notes: null,                                              createdAt: new Date("2026-04-09T09:30:00") },
  // Apr 8 — 1 upload
  { id: "upload-17", userId: "firm-1", projectName: "Waterfront Residences", fileName: "below-grade-wp.pdf",     fileType: "pdf", status: "processing", location: "Miami, FL",          notes: "Follow-up from walk-in consult on Apr 7.",        createdAt: new Date("2026-04-08T11:15:00") },
  // Earlier — 3 uploads (pre-chart window, still in table)
  { id: "upload-18", userId: "firm-2", projectName: "University Science Lab", fileName: "slab-grade.dwg",        fileType: "dwg", status: "completed",  location: "Austin, TX",         notes: null,                                              createdAt: new Date("2026-04-05T10:00:00") },
  { id: "upload-19", userId: "firm-3", projectName: "Convention Center",      fileName: "rainscreen.dxf",        fileType: "dxf", status: "failed",     location: "Las Vegas, NV",      notes: "Client cancelled project — archive only.",        createdAt: new Date("2026-04-03T14:30:00") },
  { id: "upload-20", userId: "firm-1", projectName: "Luxury Condos",          fileName: "standing-seam.pdf",     fileType: "pdf", status: "completed",  location: "Los Angeles, CA",    notes: null,                                              createdAt: new Date("2026-04-01T09:00:00") },
];

const mockDetails = [
  {
    id: "detail-1",
    title: "Ventilated Facade Rain Screen System",
    description:
      "Complete rain screen cladding detail with aluminum subframe, mineral wool insulation, and fiber cement panels. Includes thermal break calculations and drainage provisions.",
    category: "facade",
    buildingType: "commercial",
    firmId: "firm-1",
    previewImageKey: "/mock/preview-1.jpg",
    detailFileKeys: JSON.stringify(["details/firm-1/facade-rainscreen.dwg", "details/firm-1/facade-rainscreen-specs.pdf"]),
    price: 4500,
  },
  {
    id: "detail-2",
    title: "Green Roof Assembly with Drainage Layer",
    description:
      "Extensive green roof system showing all layers from structural deck to vegetation. Includes waterproofing membrane, root barrier, drainage mat, and growing medium specifications.",
    category: "roofing",
    buildingType: "residential",
    firmId: "firm-2",
    previewImageKey: "/mock/preview-2.jpg",
    detailFileKeys: JSON.stringify(["details/firm-2/green-roof.dwg"]),
    price: 3500,
  },
  {
    id: "detail-3",
    title: "Deep Foundation Pile Cap Detail",
    description:
      "Reinforced concrete pile cap connecting steel H-piles to grade beams. Includes rebar schedule, concrete specs, and waterproofing at below-grade transition.",
    category: "foundation",
    buildingType: "commercial",
    firmId: "firm-3",
    previewImageKey: "/mock/preview-3.jpg",
    detailFileKeys: JSON.stringify(["details/firm-3/pile-cap.dwg", "details/firm-3/pile-cap-calc.pdf"]),
    price: 5000,
  },
  {
    id: "detail-4",
    title: "Exterior Wall Insulation Retrofit",
    description:
      "EIFS retrofit detail for existing masonry buildings. Shows mechanical attachment, continuous insulation, air barrier, and finish coat system with window head/sill transitions.",
    category: "insulation",
    buildingType: "mixed-use",
    firmId: "firm-1",
    previewImageKey: "/mock/preview-4.jpg",
    detailFileKeys: JSON.stringify(["details/firm-1/eifs-retrofit.dwg"]),
    price: 3000,
  },
  {
    id: "detail-5",
    title: "Structural Expansion Joint at Parking Deck",
    description:
      "Expansion joint detail for post-tensioned parking structure. Covers joint sizing, sealant selection, nosing protection, and waterproofing continuity across the joint.",
    category: "joints",
    buildingType: "commercial",
    firmId: "firm-2",
    previewImageKey: "/mock/preview-5.jpg",
    detailFileKeys: JSON.stringify(["details/firm-2/expansion-joint.dwg"]),
    price: 4000,
  },
  {
    id: "detail-6",
    title: "Below-Grade Waterproofing with Blind-Side Membrane",
    description:
      "Blind-side waterproofing for basement construction against retention walls. Includes bentonite sheet membrane, protection board, drainage composite, and tie-in to footing drain.",
    category: "waterproofing",
    buildingType: "residential",
    firmId: "firm-3",
    previewImageKey: "/mock/preview-6.jpg",
    detailFileKeys: JSON.stringify(["details/firm-3/blindside-wp.dwg", "details/firm-3/blindside-wp-specs.pdf"]),
    price: 4500,
  },
  {
    id: "detail-7",
    title: "Steel Moment Frame Connection",
    description:
      "Pre-qualified welded unreinforced flange-bolted web (WUF-B) moment connection. Includes weld access hole geometry, bolt pattern, and continuity plate requirements per AISC 358.",
    category: "structural",
    buildingType: "commercial",
    firmId: "firm-1",
    previewImageKey: "/mock/preview-7.jpg",
    detailFileKeys: JSON.stringify(["details/firm-1/moment-frame.dwg"]),
    price: 5500,
  },
  {
    id: "detail-8",
    title: "Mechanical Shaft Fire-Stop Assembly",
    description:
      "UL-listed fire-stop detail for mechanical penetrations through 2-hour rated shaft walls. Covers pipe, duct, and cable tray penetrations with specific sealant and collar requirements.",
    category: "mep",
    buildingType: "mixed-use",
    firmId: "firm-2",
    previewImageKey: "/mock/preview-8.jpg",
    detailFileKeys: JSON.stringify(["details/firm-2/firestop.dwg"]),
    price: 2500,
  },
  {
    id: "detail-9",
    title: "Curtain Wall Spandrel Panel Detail",
    description:
      "Unitized curtain wall spandrel section showing shadow box assembly, insulated metal panel, vapor barrier, and perimeter sealant joint to vision glass units.",
    category: "facade",
    buildingType: "commercial",
    firmId: "firm-3",
    previewImageKey: "/mock/preview-9.jpg",
    detailFileKeys: JSON.stringify(["details/firm-3/curtainwall-spandrel.dwg"]),
    price: 6000,
  },
  {
    id: "detail-10",
    title: "Standing Seam Metal Roof Ridge Detail",
    description:
      "Ridge cap detail for standing seam zinc roof. Shows clip attachment, underlayment continuity, ridge ventilation, and snow guard integration at the ridge zone.",
    category: "roofing",
    buildingType: "residential",
    firmId: "firm-1",
    previewImageKey: "/mock/preview-10.jpg",
    detailFileKeys: JSON.stringify(["details/firm-1/standing-seam-ridge.dwg"]),
    price: 3000,
  },
  {
    id: "detail-11",
    title: "Slab-on-Grade with Vapor Barrier",
    description:
      "Detailed slab-on-grade section with 15-mil vapor barrier, capillary break gravel layer, underslab insulation, and reinforcement placement for crack control joints.",
    category: "foundation",
    buildingType: "industrial",
    firmId: "firm-2",
    previewImageKey: "/mock/preview-11.jpg",
    detailFileKeys: JSON.stringify(["details/firm-2/slab-on-grade.dwg"]),
    price: 2000,
  },
  {
    id: "detail-12",
    title: "High-Performance Window Installation Detail",
    description:
      "Triple-glazed window installation in a thick-wall passive house assembly. Shows continuous air barrier tie-in, sill pan flashing, thermal break at frame, and exterior trim attachment.",
    category: "insulation",
    buildingType: "residential",
    firmId: "firm-3",
    previewImageKey: "/mock/preview-12.jpg",
    detailFileKeys: JSON.stringify(["details/firm-3/window-install.dwg", "details/firm-3/window-thermal-calc.pdf"]),
    price: 4000,
  },
];

// ── Mock user events ────────────────────────────────────────────────────────
// eventType: login | view_library | view_detail | view_dashboard | search | upload | purchase | download

const mockEvents = [
  // ── firm-1: Sarah Chen (heavy uploader, active Mon–Fri) ──────────────────
  { id:"ev-f1-01", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(0,8,30) },
  { id:"ev-f1-02", userId:"firm-1", eventType:"view_dashboard", resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(0,8,32) },
  { id:"ev-f1-03", userId:"firm-1", eventType:"view_library",   resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(0,8,40) },
  { id:"ev-f1-04", userId:"firm-1", eventType:"search",         resourceType:null,     resourceId:null,       metadata:meta({query:"facade rain screen",resultCount:4}),  createdAt:d(0,8,42) },
  { id:"ev-f1-05", userId:"firm-1", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-5", metadata:meta({title:"Structural Expansion Joint"}),        createdAt:d(0,8,50) },
  { id:"ev-f1-06", userId:"firm-1", eventType:"upload",         resourceType:"upload", resourceId:"upload-1", metadata:meta({projectName:"Marina Tower",fileType:"pdf"}), createdAt:d(0,9,15) },
  { id:"ev-f1-07", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(1,8,45) },
  { id:"ev-f1-08", userId:"firm-1", eventType:"upload",         resourceType:"upload", resourceId:"upload-4", metadata:meta({projectName:"Civic Center",fileType:"pdf"}), createdAt:d(1,8,55) },
  { id:"ev-f1-09", userId:"firm-1", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-2", metadata:meta({title:"Green Roof Assembly"}),               createdAt:d(1,10,0) },
  { id:"ev-f1-10", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(2,9,0) },
  { id:"ev-f1-11", userId:"firm-1", eventType:"upload",         resourceType:"upload", resourceId:"upload-6", metadata:meta({projectName:"Harbor View",fileType:"pdf"}),  createdAt:d(2,9,10) },
  { id:"ev-f1-12", userId:"firm-1", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-8", metadata:meta({title:"Mechanical Shaft Fire-Stop"}),        createdAt:d(2,11,0) },
  { id:"ev-f1-13", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(3,8,15) },
  { id:"ev-f1-14", userId:"firm-1", eventType:"upload",         resourceType:"upload", resourceId:"upload-9", metadata:meta({projectName:"Stadium",fileType:"pdf"}),      createdAt:d(3,10,10) },
  { id:"ev-f1-15", userId:"firm-1", eventType:"search",         resourceType:null,     resourceId:null,       metadata:meta({query:"waterproofing membrane",resultCount:3}), createdAt:d(3,14,0) },
  { id:"ev-f1-16", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(4,8,30) },
  { id:"ev-f1-17", userId:"firm-1", eventType:"upload",         resourceType:"upload", resourceId:"upload-12",metadata:meta({projectName:"Museum Expansion",fileType:"pdf"}), createdAt:d(4,10,0) },
  { id:"ev-f1-18", userId:"firm-1", eventType:"upload",         resourceType:"upload", resourceId:"upload-14",metadata:meta({projectName:"Highrise Tower",fileType:"pdf"}),   createdAt:d(4,16,0) },
  { id:"ev-f1-19", userId:"firm-1", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-3", metadata:meta({title:"Deep Foundation Pile Cap"}),          createdAt:d(4,17,0) },
  { id:"ev-f1-20", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(6,11,0) },
  { id:"ev-f1-21", userId:"firm-1", eventType:"upload",         resourceType:"upload", resourceId:"upload-17",metadata:meta({projectName:"Waterfront Residences",fileType:"pdf"}), createdAt:d(6,11,15) },
  { id:"ev-f1-22", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(7,9,0) },
  { id:"ev-f1-23", userId:"firm-1", eventType:"view_library",   resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(7,9,10) },
  { id:"ev-f1-24", userId:"firm-1", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-6", metadata:meta({title:"Below-Grade Waterproofing"}),         createdAt:d(7,9,30) },
  { id:"ev-f1-25", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(10,8,45) },
  { id:"ev-f1-26", userId:"firm-1", eventType:"search",         resourceType:null,     resourceId:null,       metadata:meta({query:"insulation retrofit",resultCount:2}), createdAt:d(10,9,0) },
  { id:"ev-f1-27", userId:"firm-1", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-9", metadata:meta({title:"Curtain Wall Spandrel"}),             createdAt:d(10,9,20) },
  { id:"ev-f1-28", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(13,9,0) },
  { id:"ev-f1-29", userId:"firm-1", eventType:"upload",         resourceType:"upload", resourceId:"upload-20",metadata:meta({projectName:"Luxury Condos",fileType:"pdf"}), createdAt:d(13,9,10) },
  { id:"ev-f1-30", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(14,8,30) },
  { id:"ev-f1-31", userId:"firm-1", eventType:"view_library",   resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(14,9,0) },
  { id:"ev-f1-32", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(21,9,0) },
  { id:"ev-f1-33", userId:"firm-1", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-11",metadata:meta({title:"Slab-on-Grade"}),                     createdAt:d(21,9,30) },
  { id:"ev-f1-34", userId:"firm-1", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(28,9,0) },

  // ── firm-2: Marcus Weber (mixed file types, moderate activity) ────────────
  { id:"ev-f2-01", userId:"firm-2", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(0,11,0) },
  { id:"ev-f2-02", userId:"firm-2", eventType:"upload",         resourceType:"upload", resourceId:"upload-2", metadata:meta({projectName:"Marina Tower",fileType:"dwg"}), createdAt:d(0,11,30) },
  { id:"ev-f2-03", userId:"firm-2", eventType:"view_library",   resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(0,12,0) },
  { id:"ev-f2-04", userId:"firm-2", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(1,15,0) },
  { id:"ev-f2-05", userId:"firm-2", eventType:"upload",         resourceType:"upload", resourceId:"upload-5", metadata:meta({projectName:"Riverside Condos",fileType:"dwg"}), createdAt:d(1,15,20) },
  { id:"ev-f2-06", userId:"firm-2", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-1", metadata:meta({title:"Ventilated Facade Rain Screen"}),     createdAt:d(1,16,0) },
  { id:"ev-f2-07", userId:"firm-2", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(2,16,0) },
  { id:"ev-f2-08", userId:"firm-2", eventType:"upload",         resourceType:"upload", resourceId:"upload-8", metadata:meta({projectName:"Tech Campus",fileType:"dwg"}),  createdAt:d(2,16,30) },
  { id:"ev-f2-09", userId:"firm-2", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(4,9,0) },
  { id:"ev-f2-10", userId:"firm-2", eventType:"search",         resourceType:null,     resourceId:null,       metadata:meta({query:"MEP shaft detail",resultCount:2}),    createdAt:d(4,9,5) },
  { id:"ev-f2-11", userId:"firm-2", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-7", metadata:meta({title:"Steel Moment Frame"}),                createdAt:d(4,9,30) },
  { id:"ev-f2-12", userId:"firm-2", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(5,10,0) },
  { id:"ev-f2-13", userId:"firm-2", eventType:"upload",         resourceType:"upload", resourceId:"upload-11",metadata:meta({projectName:"Museum Expansion",fileType:"dwg"}), createdAt:d(4,9,30) },
  { id:"ev-f2-14", userId:"firm-2", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(5,10,0) },
  { id:"ev-f2-15", userId:"firm-2", eventType:"upload",         resourceType:"upload", resourceId:"upload-15",metadata:meta({projectName:"Corporate HQ",fileType:"dwg"}), createdAt:d(5,10,15) },
  { id:"ev-f2-16", userId:"firm-2", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-4", metadata:meta({title:"Exterior Wall Insulation"}),          createdAt:d(5,11,0) },
  { id:"ev-f2-17", userId:"firm-2", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(9,9,0) },
  { id:"ev-f2-18", userId:"firm-2", eventType:"view_library",   resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(9,9,10) },
  { id:"ev-f2-19", userId:"firm-2", eventType:"search",         resourceType:null,     resourceId:null,       metadata:meta({query:"expansion joint parking",resultCount:1}), createdAt:d(9,9,15) },
  { id:"ev-f2-20", userId:"firm-2", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(13,10,0) },
  { id:"ev-f2-21", userId:"firm-2", eventType:"upload",         resourceType:"upload", resourceId:"upload-18",metadata:meta({projectName:"University Lab",fileType:"dwg"}), createdAt:d(9,10,0) },
  { id:"ev-f2-22", userId:"firm-2", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-12",metadata:meta({title:"High-Performance Window"}),           createdAt:d(13,10,30) },
  { id:"ev-f2-23", userId:"firm-2", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(20,9,0) },
  { id:"ev-f2-24", userId:"firm-2", eventType:"view_dashboard", resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(20,9,5) },
  { id:"ev-f2-25", userId:"firm-2", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(27,9,0) },

  // ── firm-3: Priya Patel (DXF-heavy, project-focused) ──────────────────────
  { id:"ev-f3-01", userId:"firm-3", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(0,14,0) },
  { id:"ev-f3-02", userId:"firm-3", eventType:"upload",         resourceType:"upload", resourceId:"upload-3", metadata:meta({projectName:"Marina Tower",fileType:"dxf"}), createdAt:d(0,14,10) },
  { id:"ev-f3-03", userId:"firm-3", eventType:"view_library",   resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(0,14,30) },
  { id:"ev-f3-04", userId:"firm-3", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-1", metadata:meta({title:"Ventilated Facade Rain Screen"}),     createdAt:d(0,15,0) },
  { id:"ev-f3-05", userId:"firm-3", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(2,11,0) },
  { id:"ev-f3-06", userId:"firm-3", eventType:"upload",         resourceType:"upload", resourceId:"upload-7", metadata:meta({projectName:"Tech Campus",fileType:"dxf"}),  createdAt:d(2,11,10) },
  { id:"ev-f3-07", userId:"firm-3", eventType:"search",         resourceType:null,     resourceId:null,       metadata:meta({query:"curtain wall detail",resultCount:3}), createdAt:d(2,11,30) },
  { id:"ev-f3-08", userId:"firm-3", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(3,13,0) },
  { id:"ev-f3-09", userId:"firm-3", eventType:"upload",         resourceType:"upload", resourceId:"upload-10",metadata:meta({projectName:"Airport Terminal",fileType:"dxf"}), createdAt:d(3,13,45) },
  { id:"ev-f3-10", userId:"firm-3", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-5", metadata:meta({title:"Structural Expansion Joint"}),        createdAt:d(3,15,0) },
  { id:"ev-f3-11", userId:"firm-3", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(4,14,0) },
  { id:"ev-f3-12", userId:"firm-3", eventType:"upload",         resourceType:"upload", resourceId:"upload-13",metadata:meta({projectName:"Highrise Tower",fileType:"dxf"}), createdAt:d(4,14,20) },
  { id:"ev-f3-13", userId:"firm-3", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(5,9,30) },
  { id:"ev-f3-14", userId:"firm-3", eventType:"upload",         resourceType:"upload", resourceId:"upload-16",metadata:meta({projectName:"Corporate HQ",fileType:"dxf"}), createdAt:d(5,9,45) },
  { id:"ev-f3-15", userId:"firm-3", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-7", metadata:meta({title:"Steel Moment Frame"}),                createdAt:d(5,10,30) },
  { id:"ev-f3-16", userId:"firm-3", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(11,10,0) },
  { id:"ev-f3-17", userId:"firm-3", eventType:"search",         resourceType:null,     resourceId:null,       metadata:meta({query:"pile cap foundation",resultCount:2}), createdAt:d(11,10,5) },
  { id:"ev-f3-18", userId:"firm-3", eventType:"view_library",   resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(11,10,15) },
  { id:"ev-f3-19", userId:"firm-3", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(11,10,0) },
  { id:"ev-f3-20", userId:"firm-3", eventType:"upload",         resourceType:"upload", resourceId:"upload-19",metadata:meta({projectName:"Convention Center",fileType:"dxf"}), createdAt:d(11,10,30) },
  { id:"ev-f3-21", userId:"firm-3", eventType:"login",          resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(18,9,0) },
  { id:"ev-f3-22", userId:"firm-3", eventType:"view_dashboard", resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(18,9,5) },
  { id:"ev-f3-23", userId:"firm-3", eventType:"view_detail",    resourceType:"detail", resourceId:"detail-10",metadata:meta({title:"Standing Seam Metal Roof"}),          createdAt:d(18,9,30) },

  // ── buyer-1: James Morrison (heavy browser, 2 purchases) ─────────────────
  { id:"ev-b1-01", userId:"buyer-1", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(0,10,0) },
  { id:"ev-b1-02", userId:"buyer-1", eventType:"view_library",  resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(0,10,5) },
  { id:"ev-b1-03", userId:"buyer-1", eventType:"search",        resourceType:null,     resourceId:null,       metadata:meta({query:"facade commercial",resultCount:5}),   createdAt:d(0,10,8) },
  { id:"ev-b1-04", userId:"buyer-1", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-1", metadata:meta({title:"Ventilated Facade Rain Screen"}),     createdAt:d(0,10,15) },
  { id:"ev-b1-05", userId:"buyer-1", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-9", metadata:meta({title:"Curtain Wall Spandrel"}),             createdAt:d(0,10,25) },
  { id:"ev-b1-06", userId:"buyer-1", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-7", metadata:meta({title:"Steel Moment Frame"}),                createdAt:d(0,10,40) },
  { id:"ev-b1-07", userId:"buyer-1", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(2,9,0) },
  { id:"ev-b1-08", userId:"buyer-1", eventType:"view_library",  resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(2,9,5) },
  { id:"ev-b1-09", userId:"buyer-1", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-3", metadata:meta({title:"Deep Foundation Pile Cap"}),          createdAt:d(2,9,20) },
  { id:"ev-b1-10", userId:"buyer-1", eventType:"purchase",      resourceType:"detail", resourceId:"detail-1", metadata:meta({amount:4500,title:"Ventilated Facade Rain Screen"}), createdAt:d(2,9,45) },
  { id:"ev-b1-11", userId:"buyer-1", eventType:"download",      resourceType:"detail", resourceId:"detail-1", metadata:meta({fileType:"dwg"}),                            createdAt:d(2,9,50) },
  { id:"ev-b1-12", userId:"buyer-1", eventType:"download",      resourceType:"detail", resourceId:"detail-1", metadata:meta({fileType:"pdf"}),                            createdAt:d(2,9,52) },
  { id:"ev-b1-13", userId:"buyer-1", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(5,14,0) },
  { id:"ev-b1-14", userId:"buyer-1", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-3", metadata:meta({title:"Deep Foundation Pile Cap"}),          createdAt:d(5,14,10) },
  { id:"ev-b1-15", userId:"buyer-1", eventType:"purchase",      resourceType:"detail", resourceId:"detail-3", metadata:meta({amount:5000,title:"Deep Foundation Pile Cap"}), createdAt:d(5,14,30) },
  { id:"ev-b1-16", userId:"buyer-1", eventType:"download",      resourceType:"detail", resourceId:"detail-3", metadata:meta({fileType:"dwg"}),                            createdAt:d(5,14,35) },
  { id:"ev-b1-17", userId:"buyer-1", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(8,11,0) },
  { id:"ev-b1-18", userId:"buyer-1", eventType:"view_library",  resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(8,11,5) },
  { id:"ev-b1-19", userId:"buyer-1", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-5", metadata:meta({title:"Structural Expansion Joint"}),        createdAt:d(8,11,20) },
  { id:"ev-b1-20", userId:"buyer-1", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-4", metadata:meta({title:"Exterior Wall Insulation"}),          createdAt:d(8,11,35) },
  { id:"ev-b1-21", userId:"buyer-1", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(12,10,0) },
  { id:"ev-b1-22", userId:"buyer-1", eventType:"search",        resourceType:null,     resourceId:null,       metadata:meta({query:"structural commercial",resultCount:3}), createdAt:d(12,10,5) },
  { id:"ev-b1-23", userId:"buyer-1", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-7", metadata:meta({title:"Steel Moment Frame"}),                createdAt:d(12,10,20) },
  { id:"ev-b1-24", userId:"buyer-1", eventType:"view_dashboard",resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(12,10,30) },
  { id:"ev-b1-25", userId:"buyer-1", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(19,9,30) },
  { id:"ev-b1-26", userId:"buyer-1", eventType:"view_library",  resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(19,9,35) },

  // ── buyer-2: Lisa Nakamura (moderate browser, 1 purchase) ─────────────────
  { id:"ev-b2-01", userId:"buyer-2", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(1,13,0) },
  { id:"ev-b2-02", userId:"buyer-2", eventType:"view_library",  resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(1,13,5) },
  { id:"ev-b2-03", userId:"buyer-2", eventType:"search",        resourceType:null,     resourceId:null,       metadata:meta({query:"green roof residential",resultCount:2}), createdAt:d(1,13,8) },
  { id:"ev-b2-04", userId:"buyer-2", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-2", metadata:meta({title:"Green Roof Assembly"}),               createdAt:d(1,13,20) },
  { id:"ev-b2-05", userId:"buyer-2", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-6", metadata:meta({title:"Below-Grade Waterproofing"}),         createdAt:d(1,13,35) },
  { id:"ev-b2-06", userId:"buyer-2", eventType:"purchase",      resourceType:"detail", resourceId:"detail-2", metadata:meta({amount:3500,title:"Green Roof Assembly"}),   createdAt:d(1,13,50) },
  { id:"ev-b2-07", userId:"buyer-2", eventType:"download",      resourceType:"detail", resourceId:"detail-2", metadata:meta({fileType:"dwg"}),                            createdAt:d(1,13,55) },
  { id:"ev-b2-08", userId:"buyer-2", eventType:"download",      resourceType:"detail", resourceId:"detail-2", metadata:meta({fileType:"pdf"}),                            createdAt:d(1,13,57) },
  { id:"ev-b2-09", userId:"buyer-2", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(6,10,0) },
  { id:"ev-b2-10", userId:"buyer-2", eventType:"view_library",  resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(6,10,5) },
  { id:"ev-b2-11", userId:"buyer-2", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-10",metadata:meta({title:"Standing Seam Metal Roof"}),          createdAt:d(6,10,20) },
  { id:"ev-b2-12", userId:"buyer-2", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-12",metadata:meta({title:"High-Performance Window"}),           createdAt:d(6,10,35) },
  { id:"ev-b2-13", userId:"buyer-2", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(10,14,0) },
  { id:"ev-b2-14", userId:"buyer-2", eventType:"search",        resourceType:null,     resourceId:null,       metadata:meta({query:"insulation passive house",resultCount:2}), createdAt:d(10,14,5) },
  { id:"ev-b2-15", userId:"buyer-2", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-4", metadata:meta({title:"Exterior Wall Insulation"}),          createdAt:d(10,14,20) },
  { id:"ev-b2-16", userId:"buyer-2", eventType:"view_dashboard",resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(10,14,30) },
  { id:"ev-b2-17", userId:"buyer-2", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(17,11,0) },
  { id:"ev-b2-18", userId:"buyer-2", eventType:"view_library",  resourceType:"page",   resourceId:null,       metadata:null,                                              createdAt:d(17,11,5) },
  { id:"ev-b2-19", userId:"buyer-2", eventType:"view_detail",   resourceType:"detail", resourceId:"detail-11",metadata:meta({title:"Slab-on-Grade"}),                     createdAt:d(17,11,20) },
  { id:"ev-b2-20", userId:"buyer-2", eventType:"login",         resourceType:null,     resourceId:null,       metadata:null,                                              createdAt:d(24,10,0) },
];

const mockPurchases = [
  {
    id: "purchase-1",
    userId: "buyer-1",
    detailId: "detail-1",
    amount: 4500,
    status: "completed",
  },
  {
    id: "purchase-2",
    userId: "buyer-1",
    detailId: "detail-3",
    amount: 5000,
    status: "completed",
  },
  {
    id: "purchase-3",
    userId: "buyer-2",
    detailId: "detail-2",
    amount: 3500,
    status: "completed",
  },
];

async function seed() {
  console.log("Seeding database...");

  // Clear existing data (uploads first — references users)
  await db.delete(uploads);
  await db.delete(purchases);
  await db.delete(details);
  await db.delete(users);

  // Insert users
  for (const user of [...firmUsers, ...buyerUsers, ...adminUsers]) {
    await db.insert(users).values(user);
  }
  console.log(`Inserted ${firmUsers.length + buyerUsers.length + adminUsers.length} users`);

  // Insert details
  for (const detail of mockDetails) {
    await db.insert(details).values(detail);
  }
  console.log(`Inserted ${mockDetails.length} details`);

  // Insert purchases
  for (const purchase of mockPurchases) {
    await db.insert(purchases).values(purchase);
  }
  console.log(`Inserted ${mockPurchases.length} purchases`);

  // Insert uploads
  for (const upload of mockUploads) {
    await db.insert(uploads).values(upload);
  }
  console.log(`Inserted ${mockUploads.length} uploads`);

  // Insert user events
  await db.delete(userEvents);
  for (const ev of mockEvents) {
    await db.insert(userEvents).values(ev);
  }
  console.log(`Inserted ${mockEvents.length} user events`);

  console.log("Seeding complete!");
}

seed().catch(console.error);
