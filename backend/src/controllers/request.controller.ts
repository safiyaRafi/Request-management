import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const createRequestSchema = z.object({
    title: z.string(),
    description: z.string(),
    assignedToId: z.string(),
});

export const createRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, assignedToId } = createRequestSchema.parse(req.body);
        const userId = req.user!.userId;

        const request = await prisma.request.create({
            data: {
                title,
                description,
                createdById: userId,
                assignedToId,
                status: 'PENDING_APPROVAL',
            },
        });

        res.status(201).json(request);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRequests = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const role = req.user!.role;

        // Requests created by me
        const created = await prisma.request.findMany({
            where: { createdById: userId },
            include: { assignedTo: { select: { name: true } } },
        });

        // Requests assigned to me
        const assigned = await prisma.request.findMany({
            where: { assignedToId: userId },
            include: { createdBy: { select: { name: true } } },
        });

        // Requests assigned to my subordinates (for Manager approval)
        let toApprove: any[] = [];
        if (role === 'MANAGER') {
            const subordinates = await prisma.user.findMany({
                where: { managerId: userId },
                select: { id: true },
            });
            const subordinateIds = subordinates.map(s => s.id);

            toApprove = await prisma.request.findMany({
                where: {
                    assignedToId: { in: subordinateIds },
                    status: 'PENDING_APPROVAL',
                },
                include: {
                    createdBy: { select: { name: true } },
                    assignedTo: { select: { name: true } },
                },
            });
        }

        res.json({ created, assigned, toApprove });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const approveRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const request = await prisma.request.findUnique({
            where: { id },
            include: { assignedTo: true },
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Check if manager is the manager of the assigned employee
        if (request.assignedTo.managerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to approve this request' });
        }

        const updated = await prisma.request.update({
            where: { id },
            data: { status: 'APPROVED' },
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const rejectRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const request = await prisma.request.findUnique({
            where: { id },
            include: { assignedTo: true },
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.assignedTo.managerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to reject this request' });
        }

        const updated = await prisma.request.update({
            where: { id },
            data: { status: 'REJECTED' },
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const closeRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const request = await prisma.request.findUnique({ where: { id } });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.assignedToId !== userId) {
            return res.status(403).json({ message: 'Not authorized to close this request' });
        }

        if (request.status !== 'APPROVED' && request.status !== 'COMPLETED') {
            return res.status(400).json({ message: 'Request must be approved before closing' });
        }

        const updated = await prisma.request.update({
            where: { id },
            data: { status: 'CLOSED' },
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
