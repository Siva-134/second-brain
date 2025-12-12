import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Brain, Search, Menu, Sparkles, Sun, Moon } from 'lucide-react';
import dashboardBg from '../assets/premium-bg.png';
import headerBg from '../assets/header-bg.png';

import { useTheme } from '../contexts/ThemeContext';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { CreateContentModal } from '../components/CreateContentModal';
import { BrainChat } from '../components/BrainChat';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

function Dashboard() {
    const navigate = useNavigate();
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme, toggleTheme } = useTheme();

    const fetchContents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/v1/my-contents', {
                withCredentials: true
            });
            if (response.data && response.data.data) {
                setContents(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching contents:", error);
            if (error.response && error.response.status === 401) {
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContents();
    }, []);

    const filteredContents = contents.filter(content => {
        // Filter by Tab
        let tabMatch = true;
        if (activeTab !== 'all') {
            if (['video', 'audio', 'article', 'image'].includes(activeTab)) {
                tabMatch = content.type === activeTab;
            } else if (activeTab === 'youtube') {
                tabMatch = content.link && content.link.includes('youtube.com');
            } else if (activeTab === 'twitter') {
                tabMatch = content.link && (content.link.includes('twitter.com') || content.link.includes('x.com'));
            } else if (activeTab === 'facebook') {
                tabMatch = content.link && content.link.includes('facebook.com');
            }
        }

        // Filter by Search
        let searchMatch = true;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            searchMatch =
                content.title.toLowerCase().includes(query) ||
                (content.tags && content.tags.some(tag => tag.title && tag.title.toLowerCase().includes(query)));
        }

        return tabMatch && searchMatch;
    });

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-transparent font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
            {/* Background Image Overlay - Moved to root to avoid z-index/stacking issues with scrollable content */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat w-full h-full pointer-events-none transition-all duration-300"
                style={{
                    backgroundImage: `url(${dashboardBg})`,
                    opacity: 1, // Force opacity
                    filter: 'brightness(1.5) contrast(1.25) saturate(1.1)' // Force filters via CSS
                }}
            ></div>

            {/* Top Header */}
            <div
                className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 z-50 transition-all duration-300 bg-cover bg-center"
                style={{ backgroundImage: `url(${headerBg})` }}
            >
                {/* Overlay for better text readability if needed, though image is dark enough */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[-1]"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-white/10 p-2 rounded-xl text-white backdrop-blur-md">
                        <Brain className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">SecondBrain</h1>
                </div>

                <div className="flex items-center gap-4 w-full max-w-xl mx-auto px-10 relative z-10">
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your brain..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none ring-1 ring-white/20 bg-black/20 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-white/40 focus:bg-black/30 focus:outline-none transition-all backdrop-blur-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors backdrop-blur-md"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <Button
                        onClick={() => setIsChatOpen(true)}
                        startIcon={<Sparkles className="w-5 h-5" />}
                        size="md"
                        variant="secondary"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-md shadow-lg"
                    >
                        Ask AI
                    </Button>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        startIcon={<Plus className="w-5 h-5" />}
                        size="md"
                        variant="primary"
                        className="shadow-xl shadow-indigo-900/20"
                    >
                        Add Content
                    </Button>
                </div>
            </div>

            {/* Main Layout Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="flex-1 overflow-y-auto relative p-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent z-10">

                    {/* Content */}
                    <div className="relative z-10 max-w-7xl mx-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : filteredContents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                {filteredContents.map((content) => (
                                    <Card
                                        key={content._id}
                                        title={content.title}
                                        type={content.type}
                                        link={content.link}
                                        tags={content.tags}
                                        thumbnail={content.thumbnail}
                                        onDelete={async () => {
                                            try {
                                                await axios.delete(`http://localhost:3000/api/v1/remove-content/${content._id}`, { withCredentials: true });
                                                fetchContents();
                                            } catch (e) { console.error(e) }
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                                <div className="bg-gray-100 dark:bg-gray-900/50 p-6 rounded-full mb-6 text-gray-400 dark:text-gray-700 backdrop-blur-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                                    <Brain className="w-16 h-16 opacity-50" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">No content found</h3>
                                <p className="text-gray-500 mt-2 max-w-xs">{searchQuery ? 'Try a different search term.' : 'Start adding your digital brain memories.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CreateContentModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onContentAdded={fetchContents}
            />

            <BrainChat
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
        </div>
    );
}

export default Dashboard;
