export default function handler(req, res) {
  if (req.body.password === process.env.ADMIN_PASSWORD) res.status(200).end();
  else res.status(401).end();
}
