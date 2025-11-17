async function checkVIN() {
  const vin = document.getElementById("vinInput").value.trim();
  const resultBox = document.getElementById("result");

  if (!vin) {
    resultBox.style.display = "block";
    resultBox.innerHTML = "Please enter a VIN";
    return;
  }

  resultBox.style.display = "block";
  resultBox.innerHTML = "Checking (NHTSA)...";

  try {
    // Direct call to free NHTSA API (no backend needed for dev)
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${encodeURIComponent(vin)}?format=json`
    );
    const json = await res.json();

    // Pick a few useful fields to display
    const data = {};
    json.Results.forEach(item => {
      if (item.Variable && item.Value && item.Value !== 'Not Applicable') {
        data[item.Variable] = item.Value;
      }
    });

    resultBox.innerHTML = `<pre>${JSON.stringify({ vin, data }, null, 2)}</pre>`;
  } catch (err) {
    resultBox.innerHTML = "Error contacting NHTSA: " + err.message;
  }
}
