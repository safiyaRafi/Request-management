import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Request } from '../types';
import { CheckCircle, XCircle, Clock, Play, Archive } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [requests, setRequests] = useState<{ created: Request[], assigned: Request[], toApprove: Request[] }>({
        created: [],
        assigned: [],
        toApprove: [],
    });
    const [activeTab, setActiveTab] = useState<'created' | 'assigned' | 'toApprove'>('created');

    const fetchRequests = () => {
        api.get('/requests')
            .then(res => setRequests(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await api.put(`/requests/${id}/approve`);
            fetchRequests();
        } catch (error) {
            console.error('Failed to approve', error);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await api.put(`/requests/${id}/reject`);
            fetchRequests();
        } catch (error) {
            console.error('Failed to reject', error);
        }
    };

    const handleClose = async (id: string) => {
        try {
            await api.put(`/requests/${id}/close`);
            fetchRequests();
        } catch (error) {
            console.error('Failed to close', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
            COMPLETED: 'bg-blue-100 text-blue-800',
            CLOSED: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100'}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Request Manager</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, {user?.name} ({user?.role})</span>
                            <button onClick={logout} className="text-gray-500 hover:text-gray-700">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab('created')}
                                className={`px-4 py-2 rounded-md ${activeTab === 'created' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                            >
                                Created by Me
                            </button>
                            <button
                                onClick={() => setActiveTab('assigned')}
                                className={`px-4 py-2 rounded-md ${activeTab === 'assigned' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                            >
                                Assigned to Me
                            </button>
                            {user?.role === 'MANAGER' && (
                                <button
                                    onClick={() => setActiveTab('toApprove')}
                                    className={`px-4 py-2 rounded-md ${activeTab === 'toApprove' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                                >
                                    To Approve ({requests.toApprove.length})
                                </button>
                            )}
                        </div>
                        <Link to="/create-request" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                            New Request
                        </Link>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {requests[activeTab].length === 0 && (
                                <li className="px-4 py-4 text-center text-gray-500">No requests found.</li>
                            )}
                            {requests[activeTab].map((req) => (
                                <li key={req.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-indigo-600 truncate">{req.title}</p>
                                            <p className="text-sm text-gray-500">{req.description}</p>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <span className="mr-4">Assigned to: {req.assignedTo?.name || 'Unknown'}</span>
                                                <span className="mr-4">Created by: {req.createdBy?.name || 'Unknown'}</span>
                                                {getStatusBadge(req.status)}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            {activeTab === 'toApprove' && req.status === 'PENDING_APPROVAL' && (
                                                <>
                                                    <button onClick={() => handleApprove(req.id)} className="text-green-600 hover:text-green-900" title="Approve">
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button onClick={() => handleReject(req.id)} className="text-red-600 hover:text-red-900" title="Reject">
                                                        <XCircle size={20} />
                                                    </button>
                                                </>
                                            )}
                                            {activeTab === 'assigned' && (req.status === 'APPROVED' || req.status === 'COMPLETED') && (
                                                <button onClick={() => handleClose(req.id)} className="text-gray-600 hover:text-gray-900" title="Close">
                                                    <Archive size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
