import { Schema, model, models } from 'mongoose';
const WorkerSchema = new Schema({
  name:    { type: String, required: true },
  workerId:{ type: String, required: true, unique: true },
  balance: { type: Number, default: 0 }
});
export default models.Worker || model('Worker', WorkerSchema);
