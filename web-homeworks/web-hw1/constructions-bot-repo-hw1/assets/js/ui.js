// assets/js/ui.js

// ===== Helper: get site name =====
function getSiteName(siteId) {
  return fakeSites.find((s) => s.id === siteId)?.name || siteId;
}

// ===== Basic renders (tables, lists, KPIs) =====
function renderSiteFilter(selectEl, sites) {
  selectEl.innerHTML = "";
  sites.forEach((site) => {
    const opt = document.createElement("option");
    opt.value = site.id;
    opt.textContent = site.name;
    selectEl.appendChild(opt);
  });
}

function renderKpi(siteId) {
  const container = document.getElementById("kpiContainer");
  container.innerHTML = "";

  const data = fakeKpiBySite[siteId];
  if (!data) return;

  const cards = [
    {
      label: "Overall progress",
      value: data.progressPercent + "%",
      description: "Completion percentage"
    },
    {
      label: "Volume change",
      value: data.volumeChanged,
      description: "Between baseline and latest scan"
    },
    {
      label: "Forecast completion date",
      value: data.completionDate,
      description: "Estimated project finish"
    },
    {
      label: "Productivity Index",
      value: data.productivityIndex,
      description: "Higher is better"
    }
  ];

  cards.forEach((c) => {
    const div = document.createElement("div");
    div.className = "bg-white rounded shadow p-4";
    div.innerHTML = `
      <p class="text-xs text-gray-500 mb-1">${c.label}</p>
      <p class="text-2xl font-bold mb-1">${c.value}</p>
      <p class="text-xs text-gray-400">${c.description}</p>
    `;
    container.appendChild(div);
  });
}

function renderAreasTable(siteId) {
  const tbody = document.getElementById("areasTableBody");
  tbody.innerHTML = "";

  fakeAreas
    .filter((a) => a.siteId === siteId)
    .forEach((area) => {
      const tr = document.createElement("tr");
      tr.className = "border-b hover:bg-gray-50";
      tr.innerHTML = `
        <td class="py-2">${area.name}</td>
        <td class="py-2">${area.floor}</td>
        <td class="py-2">${area.progress}%</td>
        <td class="py-2">${area.changePercent}%</td>
      `;
      tbody.appendChild(tr);
    });
}

function renderAreasList(siteId) {
  const list = document.getElementById("areasList");
  list.innerHTML = "";

  fakeAreas
    .filter((a) => a.siteId === siteId)
    .forEach((area) => {
      const li = document.createElement("li");
      li.className =
        "flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded px-3 py-2 gap-1";
      li.innerHTML = `
        <span class="font-medium">${area.name} (Floor ${area.floor})</span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-600">Progress: ${area.progress}%</span>
          <div class="w-24 bg-gray-200 rounded h-2">
            <div class="h-2 rounded bg-green-500" style="width:${area.progress}%"></div>
          </div>
        </div>
      `;
      list.appendChild(li);
    });
}

function renderScansTable(siteId) {
  const tbody = document.getElementById("scansTableBody");
  tbody.innerHTML = "";

  fakeScans
    .filter((s) => !siteId || s.siteId === siteId)
    .forEach((scan) => {
      const tr = document.createElement("tr");
      tr.className = "border-b hover:bg-gray-50";
      tr.innerHTML = `
        <td class="py-2">${scan.id}</td>
        <td class="py-2">${getSiteName(scan.siteId)}</td>
        <td class="py-2">${scan.date}</td>
        <td class="py-2">${scan.format}</td>
        <td class="py-2">${scan.sizeGb} GB</td>
        <td class="py-2 text-center">
          <input type="checkbox" class="scan-compare-checkbox" data-scan-id="${scan.id}" />
        </td>
      `;
      tbody.appendChild(tr);
    });
}

function renderReportsList() {
  const list = document.getElementById("reportsList");
  list.innerHTML = "";

  fakeReports.forEach((r) => {
    const li = document.createElement("li");
    li.className = "cursor-pointer hover:text-blue-600";
    li.dataset.reportId = r.id;
    li.textContent = `${r.title} (${r.type})`;
    list.appendChild(li);
  });
}

function renderReportPreview(reportId) {
  const report = fakeReports.find((r) => r.id === reportId);
  const previewEl = document.getElementById("reportPreview");
  if (!report) {
    previewEl.textContent =
      "Select a report from the list to see its summary.";
    return;
  }
  previewEl.textContent = report.summary;
}

// CHARTS (using Chart.js)

let progressOverTimeChart;
let areaProgressChart;
let areaStatusPieChart;
let scanVolumeCompareChart;
let scanAreaChangeChart;
let areasProgressDistributionChart;
let reportPreviewChart;

// Helper to destroy existing chart
function destroyIfExists(chart) {
  if (chart) chart.destroy();
}

// 1) Line chart – project progress over time (Dashboard)
function renderProgressOverTimeChart(siteId) {
  const ctx = document.getElementById("progressOverTimeChart").getContext("2d");
  destroyIfExists(progressOverTimeChart);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const base = fakeKpiBySite[siteId]?.progressPercent || 50;

  // Fake growing progress line
  const values = months.map((_, i) =>
    Math.min(100, Math.max(0, base - 25 + i * (base / months.length)))
  );

  progressOverTimeChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Overall progress (%)",
          data: values,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

// 2) Bar chart – area progress (Dashboard)
function renderAreaProgressBarChart(siteId) {
  const ctx = document.getElementById("areaProgressChart").getContext("2d");
  destroyIfExists(areaProgressChart);

  const siteAreas = fakeAreas.filter((a) => a.siteId === siteId);
  const labels = siteAreas.map((a) => a.name);
  const values = siteAreas.map((a) => a.progress);

  areaProgressChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Progress (%)",
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

// 3) Donut chart – area status distribution (Dashboard)
function getAreaStatus(progress) {
  if (progress === 0) return "Not started";
  if (progress > 0 && progress < 50) return "In progress";
  if (progress >= 50 && progress < 90) return "Near done";
  return "Completed";
}

function renderAreaStatusPieChart(siteId) {
  const ctx = document.getElementById("areaStatusPieChart").getContext("2d");
  destroyIfExists(areaStatusPieChart);

  const siteAreas = fakeAreas.filter((a) => a.siteId === siteId);
  const counts = { "Not started": 0, "In progress": 0, "Near done": 0, "Completed": 0 };

  siteAreas.forEach((a) => {
    const status = getAreaStatus(a.progress);
    counts[status]++;
  });

  const labels = Object.keys(counts);
  const values = Object.values(counts);

  areaStatusPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

// 4) Scan comparison charts (Scans screen)
function renderScanComparisonCharts(scan1, scan2, volume1, volume2, siteId) {
  const ctxVolume = document
    .getElementById("scanVolumeCompareChart")
    .getContext("2d");
  const ctxArea = document
    .getElementById("scanAreaChangeChart")
    .getContext("2d");

  destroyIfExists(scanVolumeCompareChart);
  destroyIfExists(scanAreaChangeChart);

  // Volume comparison – simple grouped bar
  scanVolumeCompareChart = new Chart(ctxVolume, {
    type: "bar",
    data: {
      labels: ["Baseline (t1)", "Latest (t2)"],
      datasets: [
        {
          label: "Built volume (m³)",
          data: [volume1, volume2]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Area change chart – fake change per area for this site
  const siteAreas = fakeAreas.filter((a) => a.siteId === siteId);
  const labels = siteAreas.map((a) => a.name);
  const values = siteAreas.map(() =>
    parseFloat((Math.random() * 50 - 10).toFixed(1))
  ); // -10% to +40% fake change

  scanAreaChangeChart = new Chart(ctxArea, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Change between t1 and t2 (%)",
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// 5) Areas progress distribution (Areas screen)
function renderAreasProgressDistributionChart(siteId) {
  const ctx = document
    .getElementById("areasProgressDistributionChart")
    .getContext("2d");
  destroyIfExists(areasProgressDistributionChart);

  const siteAreas = fakeAreas.filter((a) => a.siteId === siteId);

  const buckets = {
    "0–25%": 0,
    "25–50%": 0,
    "50–75%": 0,
    "75–100%": 0
  };

  siteAreas.forEach((a) => {
    if (a.progress <= 25) buckets["0–25%"]++;
    else if (a.progress <= 50) buckets["25–50%"]++;
    else if (a.progress <= 75) buckets["50–75%"]++;
    else buckets["75–100%"]++;
  });

  const labels = Object.keys(buckets);
  const values = Object.values(buckets);

  areasProgressDistributionChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Number of areas",
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  });
}

// 6) Report preview chart (Reports screen)
function renderReportPreviewChart(reportId, siteId) {
  const ctx = document
    .getElementById("reportPreviewChart")
    .getContext("2d");
  destroyIfExists(reportPreviewChart);

  const report = fakeReports.find((r) => r.id === reportId);
  if (!report) {
    // empty placeholder
    reportPreviewChart = new Chart(ctx, {
      type: "line",
      data: { labels: [], datasets: [] },
      options: { plugins: { legend: { display: false } } }
    });
    return;
  }

  const months = ["Jan", "Feb", "Mar", "Apr"];
  const base = fakeKpiBySite[siteId]?.progressPercent || 60;

  if (report.id === 1) {
    // Monthly progress report
    const values = months.map((_, i) =>
      Math.min(100, base - 15 + i * 5)
    );
    reportPreviewChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Monthly progress (%)",
            data: values,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    });
  } else {
    // Scan comparison style report
    const values = [1000, 1350];
    reportPreviewChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["t1 volume", "t2 volume"],
        datasets: [
          {
            label: "Volume (m³)",
            data: values
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
