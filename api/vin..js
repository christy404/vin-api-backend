// api/vin.js — NHTSA proxy with CORS & simple response
export default async function handler(req, res) {
  // CORS so Shopify/frontends can call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const vin = (req.query.v || req.query.vin || '').trim();
  if (!vin) return res.status(400).json({ error: 'VIN is required' });

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${encodeURIComponent(vin)}?format=json`;
    const apiRes = await fetch(url);
    if (!apiRes.ok) throw new Error('NHTSA returned ' + apiRes.status);
    const apiJson = await apiRes.json();

    // Simplify the response: build a key:value map of useful fields
    const data = {};
    apiJson.Results.forEach(item => {
      if (item.Variable && item.Value && item.Value !== 'Not Applicable') {
        data[item.Variable] = item.Value;
      }
    });

    return res.status(200).json({ source: 'NHTSA', vin, data });
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Failed to fetch NHTSA', details: String(err) });
  }
}
