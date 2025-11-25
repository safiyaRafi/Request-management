import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';


const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    assignedToId: z.string().min(1, 'Assignee is required'),
});

type FormData = z.infer<typeof schema>;

const CreateRequest = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
    const [error, setError] = useState('');
    const [loadingEmployees, setLoadingEmployees] = useState(true);

    useEffect(() => {
        setLoadingEmployees(true);
        api.get('/users/employees')
            .then(res => {
                setEmployees(res.data || []);
            })
            .catch(err => {
                console.error('Failed to load employees:', err);
                setError('Failed to load employees. Please refresh the page.');
            })
            .finally(() => setLoadingEmployees(false));
    }, []);

    const onSubmit = async (data: FormData) => {
        try {
            await api.post('/requests', data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create request');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6">Create Request</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            {...register('title')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register('description')}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign To</label>
                        <select
                            {...register('assignedToId')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            disabled={loadingEmployees}
                        >
                            <option value="">{loadingEmployees ? 'Loading employees...' : 'Select an employee'}</option>
                            {employees.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        {errors.assignedToId && <p className="text-red-500 text-sm mt-1">{errors.assignedToId.message}</p>}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRequest;
