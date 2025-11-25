import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

import type { AuthResponse } from '../types';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
    role: z.enum(['EMPLOYEE', 'MANAGER']),
    managerId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            role: 'EMPLOYEE',
        },
    });
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);

    const role = watch('role');

    useEffect(() => {
        if (role === 'EMPLOYEE') {
            api.get('/users/managers')
                .then(res => setManagers(res.data))
                .catch(console.error);
        }
    }, [role]);

    const onSubmit = async (data: FormData) => {
        try {
            const res = await api.post<AuthResponse>('/auth/register', data);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            {...register('name')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register('email')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            {...register('role')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="MANAGER">Manager</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                    </div>
                    {role === 'EMPLOYEE' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Manager</label>
                            <select
                                {...register('managerId')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            >
                                <option value="">Select a manager</option>
                                {managers.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            {errors.managerId && <p className="text-red-500 text-sm mt-1">{errors.managerId.message}</p>}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
