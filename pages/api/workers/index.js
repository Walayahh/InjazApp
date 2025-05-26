// pages/api/workers/index.js
import { connect } from '../../../lib/mongoose';
import Worker     from '../../../models/Worker';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await connect();
  const list = await Worker.find({}, 'name workerId').lean();
  // Return array of { name, workerId }
  res.json(list);
}
