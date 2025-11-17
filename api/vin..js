// api/vin.js
export default async function handler(req, res) {
  const vin = req.query.v || req.query.vin || "";

  if (!vin) {
    return res.status(400).json({ error: "VIN is required" });
  }

  try {
    const apiURL = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;
    const response = await fetch(apiURL);
    const data = await response.json();

    return res.status(200).json({
      source: "NHTSA",
      vin: vin,
      result: data.Results
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch from NHTSA" });
  }
}
