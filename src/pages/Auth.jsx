import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeDBackground from '../components/ThreeDBackground';
import { Brain, ArrowRight } from 'lucide-react';
import authBg from '../assets/auth-bg.png';
import api from '../api';

function Auth() {
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

            const response = await api.post(endpoint, payload);

            setMessage(response.data.message);

            if (response.status === 200 || response.status === 201) {
                console.log('Success:', response.data);
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }
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
        <div className="min-h-screen flex items-center justify-center relative font-sans">
            {/* 3D Background with Static Image Overlay */}
            <ThreeDBackground backgroundImage={authBg} />

            {/* Auth Card */}
            <div className="relative z-10 w-full max-w-md p-8 mx-4">
                <div className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 space-y-8 animate-in fade-in zoom-in-95 ring-1 ring-white/5 group">
                    <div className="text-center space-y-2">
                        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-500">
                            <Brain className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-gray-400">
                            {isLogin ? 'Enter your details to access your brain.' : 'Start organizing your digital life today.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-black/40 focus:ring-1 focus:ring-indigo-500/50 transition-all backdrop-blur-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-black/40 focus:ring-1 focus:ring-indigo-500/50 transition-all backdrop-blur-sm"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-black/40 focus:ring-1 focus:ring-indigo-500/50 transition-all backdrop-blur-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm text-center ${message.includes('Success') || message.includes('Log')
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-gray-400 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={toggleForm}
                                className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
