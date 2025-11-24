export interface User {
    id: string;
    name: string;
    email: string;
    role: 'EMPLOYEE' | 'MANAGER';
}

export interface Request {
    id: string;
    title: string;
    description: string;
    status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CLOSED';
    createdById: string;
    assignedToId: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: { name: string };
    assignedTo?: { name: string };
}

export interface AuthResponse {
    token: string;
    user: User;
}
