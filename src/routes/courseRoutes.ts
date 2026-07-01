import { Router, Response } from 'express';
import Course from '../models/Course';
// Import your custom middleware and authenticated request interface
import { verifyFirebaseToken, isAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// @desc    Get all courses from MongoDB (PUBLIC)
// @route   GET /api/v1/courses
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const courses = await Course.find({}).sort({ createdAt: -1 });

        const formattedCourses = courses.map((course: any) => ({
            id: course._id.toString(),
            category: course.category,
            level: course.level,
            initials: course.initials,
            title: course.title,
            description: course.description,
            rating: course.rating,
            reviews: course.reviews,
            duration: course.duration,
            students: course.students,
            price: course.price,
            numericPrice: course.numericPrice
        }));

        res.status(200).json(formattedCourses);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error fetching courses', error: error.message });
    }
});

// @desc    Get a single course by ID (PUBLIC)
// @route   GET /api/v1/courses/:id
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const formattedCourse = {
            id: course._id.toString(),
            category: course.category,
            level: course.level,
            initials: course.initials,
            title: course.title,
            description: course.description,
            rating: course.rating,
            reviews: course.reviews,
            duration: course.duration,
            students: course.students,
            price: course.price,
            numericPrice: course.numericPrice
        };

        res.status(200).json(formattedCourse);
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server Error fetching course details', error: error.message });
    }
});

// @desc    Create a new course (ADMIN ONLY)
// @route   POST /api/v1/courses
router.post('/', verifyFirebaseToken, isAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, category, level, description, duration, price, numericPrice } = req.body;

        // Auto-generate initials from the title (e.g., "React Native" -> "RN")
        const initials = title
            ? title.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 3)
            : 'CD';

        const newCourse = new Course({
            category,
            level,
            initials,
            title,
            description,
            duration,
            price,
            numericPrice,
            rating: 0,   // Default new courses to 0 rating
            reviews: 0,  // Default new courses to 0 reviews
            students: 0  // Default new courses to 0 students
        });

        const savedCourse = await newCourse.save();

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: {
                id: savedCourse._id.toString(),
                ...savedCourse.toObject()
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
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        await course.deleteOne();
        res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server Error deleting course', error: error.message });
    }
});

export default router;