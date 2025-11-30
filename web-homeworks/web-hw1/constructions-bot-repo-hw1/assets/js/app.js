// assets/js/app.js

let currentSiteId = fakeSites[0]?.id || null;

document.addEventListener("DOMContentLoaded", () => {
  const siteFilter = document.getElementById("siteFilter");
  const currentDateLabel = document.getElementById("currentDateLabel");

  // Current date label
  currentDateLabel.textContent =
    "Today: " + new Date().toLocaleDateString("en-GB");

  // Fill site dropdown
  renderSiteFilter(siteFilter, fakeSites);

  // Site change handler
  siteFilter.addEventListener("change", (e) => {
    currentSiteId = e.target.value;
    refreshAllForSite();
  });

  // Navigation
  setupNav();

  // Scan compare logic
  setupCompareScans();

  // Areas form logic
  setupAreasForm();

  // Upload fake logic
  setupUploadForm();

  // Reports logic
  setupReports();

  // Initial render
  refreshAllForSite();
});

function refreshAllForSite() {
  if (!currentSiteId) return;

  // Dashboard
  renderKpi(currentSiteId);
  renderAreasTable(currentSiteId);
  renderProgressOverTimeChart(currentSiteId);
  renderAreaProgressBarChart(currentSiteId);
  renderAreaStatusPieChart(currentSiteId);

  // Scans
  renderScansTable(currentSiteId);
  updateCompareButtonState();

  // Areas screen
  renderAreasList(currentSiteId);
  renderAreasProgressDistributionChart(currentSiteId);

  // Reports – keep chart in sync with default (first report if exists)
  if (fakeReports.length > 0) {
    renderReportPreview(fakeReports[0].id);
    renderReportPreviewChart(fakeReports[0].id, currentSiteId);
  }
}

function setupNav() {
  const buttons = document.querySelectorAll(".nav-btn");
  const screens = document.querySelectorAll(".screen");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const screenId = btn.dataset.screen;

      buttons.forEach((b) =>
        b.classList.remove("bg-gray-800", "text-white")
      );
      btn.classList.add("bg-gray-800", "text-white");

      screens.forEach((s) => {
        if (s.id === "screen-" + screenId) {
          s.classList.remove("hidden");
        } else {
          s.classList.add("hidden");
        }
      });
    });
  });

  // Default: dashboard
  const defaultBtn = document.querySelector(
    '.nav-btn[data-screen="dashboard"]'
  );
  defaultBtn?.click();
}

function setupCompareScans() {
  const table = document.getElementById("scansTableBody");
  const btn = document.getElementById("compareBtn");

  table.addEventListener("change", (e) => {
    if (e.target.classList.contains("scan-compare-checkbox")) {
      updateCompareButtonState();
    }
  });

  btn.addEventListener("click", () => {
    const selected = getSelectedScansForCompare();
    const resultEl = document.getElementById("compareResult");
    if (selected.length !== 2) {
      resultEl.textContent =
        "Please select exactly two scans from the same site.";
      return;
    }

    const [s1, s2] = selected.sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Fake numbers for volume changes
    const volume1 = Math.floor(Math.random() * 1500) + 500;
    const volume2 = volume1 + Math.floor(Math.random() * 800);
    const fakePercentChange = (
      ((volume2 - volume1) / volume1) *
      100
    ).toFixed(1);

    resultEl.innerHTML = `
      <p>
        Comparing scans <strong>${s1.id}</strong> (${s1.date})
        vs <strong>${s2.id}</strong> (${s2.date}) at site
        <strong>${getSiteName(s1.siteId)}</strong>.
      </p>
      <ul class="list-disc pl-5 mt-2">
        <li>Estimated volume at t1: ${volume1} m³</li>
        <li>Estimated volume at t2: ${volume2} m³</li>
        <li>Estimated percentage change: ${fakePercentChange}%</li>
        <li>Dominant work type: Finishing works on upper floors</li>
      </ul>
    `;

    renderScanComparisonCharts(s1, s2, volume1, volume2, s1.siteId);
  });
}

function getSelectedScansForCompare() {
  const checkboxes = document.querySelectorAll(".scan-compare-checkbox");
  const selectedIds = Array.from(checkboxes)
    .filter((c) => c.checked)
    .map((c) => c.dataset.scanId);

  const selectedScans = fakeScans.filter((s) =>
    selectedIds.includes(s.id)
  );

  // Ensure same site
  const siteIds = [...new Set(selectedScans.map((s) => s.siteId))];
  if (siteIds.length > 1) return [];
  return selectedScans;
}

function updateCompareButtonState() {
  const btn = document.getElementById("compareBtn");
  const selected = getSelectedScansForCompare();
  btn.disabled = selected.length !== 2;
}

function setupAreasForm() {
  const form = document.getElementById("addAreaForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("areaNameInput").value.trim();
    const floor = document
      .getElementById("areaFloorInput")
      .value.trim();
    const progress = parseInt(
      document.getElementById("areaProgressInput").value,
      10
    );

    if (!name || !floor || isNaN(progress)) return;

    const newArea = {
      id: Date.now(),
      siteId: currentSiteId,
      name,
      floor,
      progress,
      changePercent: 0
    };
    fakeAreas.push(newArea);

    form.reset();
    renderAreasList(currentSiteId);
    renderAreasTable(currentSiteId);
    renderAreaProgressBarChart(currentSiteId);
    renderAreaStatusPieChart(currentSiteId);
    renderAreasProgressDistributionChart(currentSiteId);
  });
}

function setupUploadForm() {
  const addBtn = document.getElementById("addFilesBtn");
  const input = document.getElementById("scanFileInput");
  const list = document.getElementById("selectedFilesList");

  addBtn.addEventListener("click", () => {
    list.innerHTML = "";
    const files = Array.from(input.files || []);
    if (files.length === 0) {
      list.innerHTML =
        '<li class="text-gray-400">No files selected.</li>';
      return;
    }

    files.forEach((file) => {
      const li = document.createElement("li");
      li.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(
        1
      )} MB)`;
      list.appendChild(li);
    });
  });
}

function setupReports() {
  renderReportsList();

  const list = document.getElementById("reportsList");
  list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const id = parseInt(li.dataset.reportId, 10);
    renderReportPreview(id);
    renderReportPreviewChart(id, currentSiteId);
  });
}
