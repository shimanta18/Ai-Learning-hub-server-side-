import { Router, Response } from 'express';
import Course from '../models/Course';
import { verifyFirebaseToken, isAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// @desc    Get all courses from MongoDB (PUBLIC)
// @route   GET /api/v1/courses
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        // TypeScript now automatically knows Course returns ICourse[]
        const courses = await Course.find({}).sort({ createdAt: -1 });

        const formattedCourses = courses.map((course) => ({
            id: course._id.toString(),
            _id: course._id.toString(),
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
        // Inferred as ICourse | null without needing ': any'
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const formattedCourse = {
            id: course._id.toString(),
            _id: course._id.toString(),
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
            numericPrice: course.numericPrice,
            lessons: course.lessons || []
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
        const { title, category, level, description, duration, price, numericPrice, lessons } = req.body;

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
            lessons: lessons || [],
            rating: 0,
            reviews: 0,
            students: 0
        });

        const savedCourse = await newCourse.save();

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: {
                id: savedCourse._id.toString(),
                _id: savedCourse._id.toString(),
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