export default async function handler(req, res) {
  const { vin } = req.query;

  if (!vin) {
    return res.status(400).json({ error: "VIN is required" });
  }

  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
    );

    const data = await response.json();

    res.status(200).json({
      source: "NHTSA Free API",
      vin,
      result: data.Results
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch VIN data", details: err });
  }
}

