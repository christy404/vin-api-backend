export default async function handler(req, res) {
  const { vin } = req.query;

  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: "VIN must be 17 characters" });
  }

  try {
    const apiUrl = `https://example-us-vin-api.com/lookup?vin=${vin}&apikey=${process.env.US_API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "API fetch failed", details: error.message });
  }
}
