import { connect } from '../../lib/mongoose';
import Worker from '../../models/Worker';

export default async (req, res) => {
  await connect();
  const { workerId, amount } = req.body;
  if (!workerId||typeof amount!=='number') return res.status(400).end();
  const w = await Worker.findOne({ workerId });
  if (!w) return res.status(404).end();
  w.balance += amount - 1; // bank fee
  await w.save();
  return res.json({ newBalance:w.balance });
};
