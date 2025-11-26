import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { Request } from '../types';
import { CheckCircle, XCircle, Archive, User, Calendar } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [requests, setRequests] = useState<{ created: Request[], assigned: Request[], toApprove: Request[] }>({
        created: [],
        assigned: [],
        toApprove: [],
    });
    const [activeTab, setActiveTab] = useState<'created' | 'assigned' | 'toApprove'>('created');
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/requests');
            if (res.data && typeof res.data === 'object') {
                setRequests({
                    created: res.data.created || [],
                    assigned: res.data.assigned || [],
                    toApprove: res.data.toApprove || [],
                });
            }
        } catch (error) {
            console.error('Failed to fetch requests:', error);
            setRequests({ created: [], assigned: [], toApprove: [] });
        } finally {
            setIsLoading(false);
        }
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
            PENDING_APPROVAL: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md',
            APPROVED: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md',
            REJECTED: 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-md',
            COMPLETED: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-md',
            CLOSED: 'bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-md',
        };
        return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || 'bg-gray-100'}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Navbar with gradient */}
            <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="text-3xl">📋</span> Request Manager
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <span className="text-white font-medium">👋 {user?.name}</span>
                                <span className="text-blue-100 ml-2">({user?.role})</span>
                            </div>
                            <a
                                href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}/api-docs`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-md"
                            >
                                📚 API Docs
                            </a>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold transition-all shadow-md"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setActiveTab('created')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${activeTab === 'created'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white transform scale-105'
                                    : 'bg-white text-gray-700 hover:shadow-lg'
                                    }`}
                            >
                                📝 Created by Me
                            </button>
                            <button
                                onClick={() => setActiveTab('assigned')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${activeTab === 'assigned'
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform scale-105'
                                    : 'bg-white text-gray-700 hover:shadow-lg'
                                    }`}
                            >
                                📬 Assigned to Me
                            </button>
                            {user?.role === 'MANAGER' && (
                                <button
                                    onClick={() => setActiveTab('toApprove')}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md relative ${activeTab === 'toApprove'
                                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white transform scale-105'
                                        : 'bg-white text-gray-700 hover:shadow-lg'
                                        }`}
                                >
                                    ⏳ Pending Approvals
                                    {requests.toApprove.length > 0 && (
                                        <span className="ml-2 bg-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse">
                                            {requests.toApprove.length}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                        <Link
                            to="/create-request"
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg transform hover:scale-105"
                        >
                            ✨ New Request
                        </Link>
                    </div>

                    {/* Requests Grid */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : requests[activeTab].length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-gray-500 text-lg">No requests found in this category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {requests[activeTab].map((req) => (
                                    <div
                                        key={req.id}
                                        className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 ${activeTab === 'toApprove' && req.status === 'PENDING_APPROVAL'
                                            ? 'ring-4 ring-orange-400 ring-opacity-50'
                                            : ''
                                            }`}
                                    >
                                        {/* Card Header */}
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{req.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{req.description}</p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="mb-4">
                                            {getStatusBadge(req.status)}
                                        </div>

                                        {/* Request Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <User className="w-4 h-4 mr-2 text-blue-500" />
                                                <span className="font-medium">Assigned:</span>
                                                <span className="ml-1">{req.assignedTo?.name || 'Unknown'}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                                <span className="font-medium">Created by:</span>
                                                <span className="ml-1">{req.createdBy?.name || 'Unknown'}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                            {activeTab === 'toApprove' && req.status === 'PENDING_APPROVAL' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(req.id)}
                                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle size={18} />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req.id)}
                                                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all shadow-md flex items-center justify-center gap-2"
                                                    >
                                                        <XCircle size={18} />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {activeTab === 'assigned' && (req.status === 'APPROVED' || req.status === 'COMPLETED') && (
                                                <button
                                                    onClick={() => handleClose(req.id)}
                                                    className="w-full bg-gradient-to-r from-gray-500 to-slate-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-slate-700 transition-all shadow-md flex items-center justify-center gap-2"
                                                >
                                                    <Archive size={18} />
                                                    Close Request
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
