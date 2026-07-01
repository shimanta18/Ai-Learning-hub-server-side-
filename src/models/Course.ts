const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    category: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    initials: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    duration: { type: String, required: true },
    students: { type: Number, default: 0 },
    price: { type: String, required: true },
    numericPrice: { type: Number, required: true }
}, { timestamps: true });

const Course = mongoose.model('Course', CourseSchema);
export default Course;