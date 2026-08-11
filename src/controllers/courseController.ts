import { Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';

export const createCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        const courseData: Partial<ICourse> = req.body;
        const newCourse = await Course.create(courseData);

        return res.status(201).json({
            success: true,
            message: 'Course created successfully!',
            data: newCourse
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create course'
        });
    }
};