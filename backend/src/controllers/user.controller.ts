import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getManagers = async (req: Request, res: Response) => {
    try {
        const managers = await prisma.user.findMany({
            where: { role: 'MANAGER' },
            select: { id: true, name: true, email: true },
        });
        res.json(managers);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await prisma.user.findMany({
            where: { role: 'EMPLOYEE' },
            select: { id: true, name: true, email: true },
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
