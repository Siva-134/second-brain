import { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/login' : '/register';
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : formData;

            const response = await axios.post(`http://localhost:3000/api/v1${endpoint}`, payload, {
                withCredentials: true
            });

            setMessage(response.data.message);

            if (response.status === 200 || response.status === 201) {
                // Success - you can redirect or update UI here
                console.log('Success:', response.data);
                navigate('/dashboard');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', password: '' });
        setMessage('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
            <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
                    {isLogin ? 'Login' : 'Register'}
                </h1>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-5">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-600">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                                placeholder="Enter your name"
                                className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm transition-colors"
                            />
                        </div>
                    )}

                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm transition-colors"
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm transition-colors"
                        />
                    </div>

                    {message && (
                        <div className={`px-3 py-3 rounded mb-5 text-sm text-center ${message.includes('Success')
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-3 py-3 bg-blue-500 text-white rounded text-base font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>

                <p className="text-center mt-5 text-gray-600 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={toggleForm}
                        className="text-blue-500 cursor-pointer font-medium hover:underline"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Home;
