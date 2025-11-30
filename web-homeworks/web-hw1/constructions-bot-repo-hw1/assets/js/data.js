// assets/js/data.js

// Construction sites (Projects)
const fakeSites = [
  {
    id: "SITE-001",
    name: "Rothschild Towers",
    manager: "Avi Cohen",
    plannedEnd: "2026-03-30"
  },
  {
    id: "SITE-002",
    name: "North Hi-Tech Campus",
    manager: "Mira Levi",
    plannedEnd: "2025-12-31"
  }
];

// KPIs per site (Fake)
const fakeKpiBySite = {
  "SITE-001": {
    progressPercent: 42,
    volumeChanged: '1,250 m³',
    changePercent: 28,
    completionDate: "2026-02-15",
    productivityIndex: 1.12
  },
  "SITE-002": {
    progressPercent: 63,
    volumeChanged: '2,010 m³',
    changePercent: 47,
    completionDate: "2025-11-20",
    productivityIndex: 1.34
  }
};

// Areas & floors
let fakeAreas = [
  {
    id: 1,
    siteId: "SITE-001",
    name: "Floor 1 - West Wing",
    floor: "1",
    progress: 55,
    changePercent: 30
  },
  {
    id: 2,
    siteId: "SITE-001",
    name: "Floor 2 - Lobby",
    floor: "2",
    progress: 35,
    changePercent: 18
  },
  {
    id: 3,
    siteId: "SITE-002",
    name: "Block B - Floor 3",
    floor: "3",
    progress: 70,
    changePercent: 52
  }
];

// 3D scans (Fake)
const fakeScans = [
  {
    id: "SCAN-001",
    siteId: "SITE-001",
    date: "2025-01-15",
    format: "LAS",
    sizeGb: 0.8
  },
  {
    id: "SCAN-002",
    siteId: "SITE-001",
    date: "2025-03-01",
    format: "LAS",
    sizeGb: 0.95
  },
  {
    id: "SCAN-003",
    siteId: "SITE-002",
    date: "2025-02-10",
    format: "PLY",
    sizeGb: 1.2
  },
  {
    id: "SCAN-004",
    siteId: "SITE-002",
    date: "2025-04-05",
    format: "E57",
    sizeGb: 1.4
  }
];

// Fake reports
const fakeReports = [
  {
    id: 1,
    title: "Monthly Progress Report - Jan 2025",
    type: "PDF",
    summary:
      "Detailed progress report with completion percentages per area, volume changes, and key KPIs."
  },
  {
    id: 2,
    title: "Scan Comparison Report t1 vs t2 - Rothschild Towers",
    type: "Excel",
    summary:
      "Volume and surface changes per area between two scans, including percentage progress."
  }
];
