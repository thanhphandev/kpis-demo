import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  description?: string;
  managerId: mongoose.Types.ObjectId;
  isActive: boolean;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: '#3B82F6',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);