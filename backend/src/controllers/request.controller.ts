import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getRequests = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const userRole = (req as any).user.role;

        // Get requests created by this user
        const created = await prisma.request.findMany({
            where: { createdById: userId },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Get requests assigned to this user
        const assigned = await prisma.request.findMany({
            where: { assignedToId: userId },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        // If user is a manager, get requests to approve
        let toApprove: any[] = [];
        if (userRole === 'MANAGER') {
            toApprove = await prisma.request.findMany({
                where: {
                    status: 'PENDING_APPROVAL',
                    OR: [
                        { assignedTo: { managerId: userId } },
                        { assignedToId: userId }
                    ]
                },
                include: {
                    assignedTo: { select: { id: true, name: true, email: true } },
                    createdBy: { select: { id: true, name: true, email: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        res.json({ created, assigned, toApprove });
    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({ message: 'Failed to fetch requests' });
    }
};

export const createRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { title, description, assignedToId } = req.body;

        const request = await prisma.request.create({
            data: {
                title,
                description,
                assignedToId,
                createdById: userId,
                status: 'PENDING_APPROVAL',
            },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
        });

        res.status(201).json(request);
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({ message: 'Failed to create request' });
    }
};

export const approveRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await prisma.request.update({
            where: { id },
            data: { status: 'APPROVED' },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
        });
        res.json(updated);
    } catch (error) {
        console.error('Approve request error:', error);
        res.status(500).json({ message: 'Failed to approve request' });
    }
};

export const rejectRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await prisma.request.update({
            where: { id },
            data: { status: 'REJECTED' },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
        });
        res.json(updated);
    } catch (error) {
        console.error('Reject request error:', error);
        res.status(500).json({ message: 'Failed to reject request' });
    }
};

export const closeRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await prisma.request.update({
            where: { id },
            data: { status: 'CLOSED' },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
        });
        res.json(updated);
    } catch (error) {
        console.error('Close request error:', error);
        res.status(500).json({ message: 'Failed to close request' });
    }
};
