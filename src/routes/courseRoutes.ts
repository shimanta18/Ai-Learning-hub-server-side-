import { Router, Response } from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course';
import { verifyFirebaseToken, isAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// @desc    Get all courses (PUBLIC)
// @route   GET /api/v1/courses
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        let course = null;


        if (mongoose.Types.ObjectId.isValid(id as string) && String(id).length === 24) {
            course = await Course.findById(id).lean();
        } else {
            // 2. It is a custom string like "course_021". 
            // We use Course.collection.findOne() to bypass Mongoose's strict schema 
            // casting, which would otherwise throw a CastError.
            course = await Course.collection.findOne({ _id: id as any });
        }

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                ...course,
                id: course._id.toString(),
                _id: course._id.toString()
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error fetching course details', error: error.message });
    }
});

// @desc    Get a single course by ID (PUBLIC)
// @route   GET /api/v1/courses/:id
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;



        const course = await Course.findById(id).lean();

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                ...course,
                id: course._id.toString(),
                _id: course._id.toString()
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error fetching course details', error: error.message });
    }
});

// @desc    Create a new course (ADMIN ONLY)
// @route   POST /api/v1/courses
router.post('/', verifyFirebaseToken, isAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Extract ONLY the fields that exist in your new database structure
        const { title, description, category, thumbnailUrl, lessons } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ success: false, message: 'Please provide title, description, and category' });
        }

        const newCourse = new Course({
            title,
            description,
            category,
            thumbnailUrl,
            lessons: lessons || []

        });

        const savedCourse = await newCourse.save();

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: {
                ...savedCourse.toObject(),
                id: savedCourse._id.toString(),
                _id: savedCourse._id.toString()
            }
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: 'Failed to create course', error: error.message });
    }
});

// @desc    Delete a course (ADMIN ONLY)
// @route   DELETE /api/v1/courses/:id
router.delete('/:id', verifyFirebaseToken, isAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;



        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error deleting course', error: error.message });
    }
});

export default router;