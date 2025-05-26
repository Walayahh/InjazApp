import { connect } from '../../lib/mongoose';
import Worker from '../../models/Worker';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  await connect();
  const { name, id } = req.body;
  if (!name||!id) return res.status(400).end();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/tip/${encodeURIComponent(id)}`;
  const qrDataUrl = await QRCode.toDataURL(url, { width:300 });
  let w = await Worker.findOne({ workerId:id });
  if (!w) w = await Worker.create({ name, workerId:id });
  return res.json({ qrDataUrl, url, worker:w });
}
