export default function handler(req, res) {
  res.status(200).json({
    message: "Backend is working!",
    steps: 8421,
    sleep: 7,
    hrAvg: 110,
  });
}
