import { db } from "./index";
import { users, details, purchases, uploads } from "./schema";
import { hashSync } from "bcryptjs";
import { sql } from "drizzle-orm";

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

const mockUploads = [
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

  console.log("Seeding complete!");
}

seed().catch(console.error);
