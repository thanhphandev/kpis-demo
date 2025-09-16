import mongoose, { Schema, Document } from 'mongoose';

export interface IKPI extends Document {
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  assignedTo: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  category?: string;
  isActive: boolean;
  history: Array<{
    value: number;
    comment?: string;
    updatedBy: mongoose.Types.ObjectId;
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const KPISchema = new Schema<IKPI>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  targetValue: {
    type: Number,
    required: true,
    min: 0,
  },
  currentValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    trim: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true,
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Overdue'],
    default: 'Not Started',
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  history: [{
    value: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Virtual for completion percentage
KPISchema.virtual('completionPercentage').get(function () {
  if (this.targetValue === 0) return 0;
  return Math.min((this.currentValue / this.targetValue) * 100, 100);
});

// Update status based on current value and deadline
KPISchema.pre('save', function (next) {
  const now = new Date();
  
  if (this.currentValue >= this.targetValue) {
    this.status = 'Completed';
  } else if (now > this.deadline && this.status !== 'Completed') {
    this.status = 'Overdue';
  } else if (this.currentValue > 0 && this.status === 'Not Started') {
    this.status = 'In Progress';
  }
  
  next();
});

export default mongoose.models.KPI || mongoose.model<IKPI>('KPI', KPISchema);