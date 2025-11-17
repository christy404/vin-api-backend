export default function handler(req, res) {
  const vin = req.query.v || "No VIN provided";

  // Sample fake response
  res.status(200).json({
    success: true,
    vin: vin,
    message: "VIN lookup successful!",
    details: {
      make: "Test Motors",
      model: "X100",
      year: "2023"
    }
  });
}
