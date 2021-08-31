import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TestSchema = new Schema(
  {
    id: { type: String, required: true },
    userName: { type: String, required: true },
  },
);

export default mongoose.model('Test', TestSchema);
