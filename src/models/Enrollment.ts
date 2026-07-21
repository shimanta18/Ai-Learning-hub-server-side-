// models/Enrollment.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedLessons: string[];
  enrolledAt: Date;
}

const EnrollmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: String }],
  enrolledAt: { type: Date, default: Date.now }
});

// Enforce one enrollment object per student per course
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
export default Enrollment;