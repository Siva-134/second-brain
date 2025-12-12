import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Share2, Shield, Zap, ArrowRight, Github } from 'lucide-react';
import ThreeDBackground from '../components/ThreeDBackground';
import { Button } from '../components/Button';

// Simple Navbar Component
const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
                            <Brain className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-gray-100 tracking-tight">SecondBrain</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => navigate('/auth')}
                            variant="primary"
                            className="text-white font-medium transition-all hover:scale-105 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border-none"
                        >
                            Log in
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => navigate('/auth')}
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 border-none"
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:border-indigo-500/50 hover:bg-gray-900 transition-all duration-300 group">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">
            {description}
        </p>
    </div>
);

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-950 font-sans text-gray-100 selection:bg-indigo-500/30 overflow-x-hidden">
            <ThreeDBackground />
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        New: AI-Powered Brain Chat
                    </div>

                    <div className="perspective-1000">
                        <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 transform hover:rotate-x-12 hover:rotate-y-12 transition-transform duration-500 cursor-default" style={{ transformStyle: 'preserve-3d' }}>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 drop-shadow-2xl">
                                Organize your
                            </span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-2xl">
                                digital life.
                            </span>
                        </h1>
                    </div>

                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                        SecondBrain is your personal knowledge base. Store links, videos, articles, and thoughts in one place. access them anywhere, anytime.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={() => navigate('/auth')}
                            className="w-full sm:w-auto px-10 py-5 text-xl font-bold rounded-2xl shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white hover:scale-105 transition-all duration-300 border-none group"
                        >
                            Start for free
                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                            <Github className="w-5 h-5" />
                            Star on GitHub
                        </a>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-100 mb-4">Everything you need to remember</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Stop bookmarking and forgetting. SecondBrain helps you capture and retrieve information effortlessly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Instant Capture"
                            description="Save content from anywhere with a single click. Links, tweets, videos, and articles."
                        />
                        <FeatureCard
                            icon={<Brain className="w-6 h-6" />}
                            title="Smart Organization"
                            description="Tag and categorize your content automatically. Find anything instantly with powerful search."
                        />
                        <FeatureCard
                            icon={<Share2 className="w-6 h-6" />}
                            title="Share with Friends"
                            description="Curate your collections and share them with the world. Collaborate on knowledge bases."
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-800 relative z-10 bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    <p>© 2024 SecondBrain. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
