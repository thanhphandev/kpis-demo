import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  type: 'KPI_OVERDUE' | 'KPI_THRESHOLD' | 'KPI_COMPLETED' | 'SYSTEM' | 'ASSIGNMENT';
  title: string;
  message: string;
  userId: mongoose.Types.ObjectId;
  relatedKPI?: mongoose.Types.ObjectId;
  isRead: boolean;
  priority: 'Low' | 'Medium' | 'High';
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  type: {
    type: String,
    enum: ['KPI_OVERDUE', 'KPI_THRESHOLD', 'KPI_COMPLETED', 'SYSTEM', 'ASSIGNMENT'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  relatedKPI: {
    type: Schema.Types.ObjectId,
    ref: 'KPI',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  actionUrl: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);