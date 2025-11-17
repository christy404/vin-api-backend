// script.js — calls your Vercel backend at /api/vin?v=...
function prettyKey(k) {
  return k.replace(/_/g, ' ');
}

function createResultHtml(vin, data) {
  if (!data || Object.keys(data).length === 0) {
    return `<div class="card"><strong>No decoded data.</strong></div>`;
  }

  // pick some important fields and then list everything
  const important = ['Make', 'Model', 'Model Year', 'Vehicle Type', 'Body Class', 'Engine Model', 'Displacement (L)'];
  let html = `<div class="card"><h3>VIN: ${vin}</h3><div class="specs">`;

  important.forEach(k => {
    if (data[k]) html += `<div><strong>${k}:</strong> ${data[k]}</div>`;
  });

  html += `<hr><details><summary>All decoded fields</summary><pre>${JSON.stringify(data, null, 2)}</pre></details>`;
  html += '</div></div>';
  return html;
}

async function checkVIN() {
  const vin = document.getElementById("vinInput").value.trim();
  const resultBox = document.getElementById("result");

  resultBox.style.display = "block";
  if (!vin) {
    resultBox.innerHTML = `<div class="card">Please enter a VIN.</div>`;
    return;
  }

  resultBox.innerHTML = `<div class="card">Checking VIN <strong>${vin}</strong>…</div>`;

  try {
    // Call your Vercel function (same origin) — this does not expose any private keys
    const res = await fetch(`/api/vin?v=${encodeURIComponent(vin)}`);
    if (!res.ok) {
      const txt = await res.text();
      resultBox.innerHTML = `<div class="card"><strong>Error:</strong> ${res.status} <pre>${txt}</pre></div>`;
      return;
    }

    const json = await res.json();

    if (json.error) {
      resultBox.innerHTML = `<div class="card"><strong>Error:</strong> ${json.error}</div>`;
      return;
    }

    resultBox.innerHTML = createResultHtml(json.vin, json.data || {});
  } catch (err) {
    resultBox.innerHTML = `<div class="card"><strong>Error contacting server.</strong><div>${err.message}</div></div>`;
  }
}

// Optional: run when pressing Enter
document.getElementById("vinInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkVIN();
});
