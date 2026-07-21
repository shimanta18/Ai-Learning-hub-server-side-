import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILesson {
    title: string;
    description?: string;
    youtubeVideoId: string;
    duration?: string;
    transcript?: string;
}

export interface ICourse extends Document {
    title: string;
    category: string;
    level: string;
    initials: string;
    description: string;
    rating: number;
    reviews: number;
    duration: string;
    students: number;
    price: string;
    numericPrice: number;
    youtubeVideoId?: string;
    lessons?: ILesson[];
}

const LessonSchema = new Schema<ILesson>({
    title: { type: String, required: true },
    description: { type: String },
    youtubeVideoId: { type: String, required: false },
    duration: { type: String },
    transcript: { type: String }
});

const CourseSchema = new Schema<ICourse>({
    category: { type: String, required: true },
    level: { type: String, required: true },
    initials: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    duration: { type: String, required: true },
    students: { type: Number, default: 0 },
    price: { type: String, required: true },
    numericPrice: { type: Number, required: true },
    youtubeVideoId: { type: String, required: false },
    lessons: [LessonSchema]
}, { timestamps: true });

const Course: Model<ICourse> =
    mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;