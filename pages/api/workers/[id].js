import { connect } from '../../../lib/mongoose';
import Worker from '../../../models/Worker';

export default async (req, res) => {
  await connect();
  const w = await Worker.findOne({ workerId:req.query.id });
  if (!w) return res.status(404).json({ error:'Not found' });
  return res.json(w);
};
