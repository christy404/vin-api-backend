async function checkVIN() {
  const vin = document.getElementById("vinInput").value.trim();
  const resultBox = document.getElementById("result");

  if (!vin) {
    resultBox.style.display = "block";
    resultBox.innerHTML = "Please enter a VIN";
    return;
  }

  resultBox.style.display = "block";
  resultBox.innerHTML = "Checking...";

  try {
    const res = await fetch(`/api/vin?v=${vin}`);
    const data = await res.json();

    resultBox.innerHTML = `
      <strong>Status:</strong> ${data.success}<br>
      <strong>VIN:</strong> ${data.vin}<br>
      <strong>Message:</strong> ${data.message}
    `;
  } catch (err) {
    resultBox.innerHTML = "Error contacting server.";
  }
}
