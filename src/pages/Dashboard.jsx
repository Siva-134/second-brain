import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Brain, Search, Menu, Sparkles } from 'lucide-react';

import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { CreateContentModal } from '../components/CreateContentModal';
import { BrainChat } from '../components/BrainChat';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

function Dashboard() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
        <div className="min-h-screen bg-gray-950 font-sans text-gray-100">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main Content Area */}
            <div className="ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400">
                            <Brain className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">SecondBrain</h1>
                    </div>

                    <div className="flex items-center gap-4 w-full max-w-xl mx-auto px-10">
                        {/* Search bar could go here */}
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search your brain..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-gray-800 bg-gray-900/50 text-gray-200 placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setIsChatOpen(true)}
                            startIcon={<Sparkles className="w-5 h-5" />}
                            size="md"
                            variant="secondary"
                        >
                            Ask AI
                        </Button>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            startIcon={<Plus className="w-5 h-5" />}
                            size="md"
                            variant="primary"
                        >
                            Add Content
                        </Button>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                ) : filteredContents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredContents.map((content) => (
                            <Card
                                key={content._id}
                                title={content.title}
                                type={content.type}
                                link={content.link}
                                tags={content.tags}
                                thumbnail={content.thumbnail}
                                onDelete={async () => {
                                    // Simple delete flow, ideally should be in parent or have confirmation
                                    try {
                                        await axios.delete(`http://localhost:3000/api/v1/remove-content/${content._id}`, { withCredentials: true });
                                        fetchContents();
                                    } catch (e) { console.error(e) }
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="bg-gray-900 p-4 rounded-full mb-4 text-gray-700">
                            <Brain className="w-12 h-12 opacity-50" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-300">No content found</h3>
                        <p className="text-gray-500 mt-2 max-w-xs">{searchQuery ? 'Try a different search term.' : 'Start adding your digital brain memories.'}</p>
                    </div>
                )}
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
