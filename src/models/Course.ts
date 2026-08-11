import mongoose, { Schema, Document } from 'mongoose';

//  Define the Lesson Interface & Schema based on the image array
export interface ILesson {
    title: string;
    description: string;
    youtubeVideoId: string;
    duration: string;
}

const LessonSchema = new Schema<ILesson>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    youtubeVideoId: { type: String, required: true },
    duration: { type: String, required: true }
});

//  Define the Main Course Interface & Schema
export interface ICourse extends Document {
    title: string;
    description: string;
    category: string;
    thumbnailUrl: string;
    lessons: ILesson[];
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    thumbnailUrl: { type: String, required: false }, // Optional field based on standard practices
    lessons: [LessonSchema]
}, {
    timestamps: true // Automatically generates the createdAt field shown in your image
});

export default mongoose.model<ICourse>('Course', CourseSchema);