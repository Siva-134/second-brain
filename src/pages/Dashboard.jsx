import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Plus, Brain, Search, Menu, Sparkles, Sun, Moon, Globe, Youtube, Github, Folder, Trash2, User, Lock } from 'lucide-react';
import dashboardBg from '../assets/premium-bg.png';
import headerBg from '../assets/header-bg.png';

import { useTheme } from '../contexts/ThemeContext';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { CreateContentModal } from '../components/CreateContentModal';
import { BrainChat } from '../components/BrainChat';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ShareModal } from '../components/ShareModal';
import { WebSearch } from '../components/WebSearch';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { ContentPreviewModal } from '../components/ContentPreviewModal';
import { API_URL } from '../config';

// Dashboard component
function Dashboard() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const isProjectView = !!projectId;
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareData, setShareData] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [searchSource, setSearchSource] = useState('brain'); // 'brain', 'youtube', 'google', 'github'
    const [modalInitialLink, setModalInitialLink] = useState('');
    const [editingContent, setEditingContent] = useState(null);
    const [projects, setProjects] = useState([]);
    const [userData, setUserData] = useState({ name: '', email: '' });
    const [showProfile, setShowProfile] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState({ open: false, link: '', title: '', type: '' });
    const { theme, toggleTheme } = useTheme();

    const fetchUserProjects = async () => {
        try {
            const response = await api.get('/my-projects');
            if (response.data && response.data.data) {
                setProjects(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'projects') {
            fetchUserProjects();
        }
    }, [activeTab]);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get('/me');
                if (res.data) setUserData(res.data);
            } catch (e) {
                console.error("Error fetching user data:", e);
            }
        };
        fetchUserData();
    }, []);

    const handleDeleteProject = async (projectId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await api.delete(`/delete-project/${projectId}`);
                fetchUserProjects();
            } catch (error) {
                console.error("Error deleting project:", error);
                alert("Failed to delete project");
            }
        }
    };

    const fetchContents = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const params = projectId ? { projectId } : {};
            const response = await api.get('/my-contents', { params });
            console.log("fetchContents response:", response.data);
            if (response.data && response.data.data) {
                console.log("Setting contents to:", response.data.data);
                setContents(response.data.data);
                if (response.data.currentUserId) {
                    setCurrentUserId(response.data.currentUserId);
                }
            }
        } catch (error) {
            console.error("Error fetching contents:", error);
            if (error.response && error.response.status === 401) {
                navigate('/');
            }
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            setActiveTab("all");
        }
        fetchContents();
    }, [projectId]);

    const filteredContents = contents.filter(content => {
        // Filter by Tab
        let tabMatch = true;
        if (activeTab !== 'all') {
            if (['video', 'audio', 'article', 'image'].includes(activeTab)) {
                tabMatch = content.type === activeTab;
            } else if (activeTab === 'youtube') {
                tabMatch = (content.link && (content.link.includes('youtube.com') || content.link.includes('youtu.be'))) || (content.platform && content.platform.toLowerCase() === 'youtube');
            } else if (activeTab === 'twitter') {
                tabMatch = content.link && (content.link.includes('twitter.com') || content.link.includes('x.com'));
            } else if (activeTab === 'facebook') {
                tabMatch = content.link && content.link.includes('facebook.com');
            } else if (activeTab === 'github') {
                tabMatch = content.type === 'git_repo' || (content.link && content.link.includes('github.com'));
            } else if (activeTab === 'shared') {
                // Show content shared WITH me OR content I shared with OTHERS
                const isSharedWithMe = (content.userId?._id || content.userId) !== currentUserId;
                const isSharedByMe = (content.userId?._id || content.userId) === currentUserId && content.sharedWith && content.sharedWith.length > 0;
                tabMatch = isSharedWithMe || isSharedByMe;
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
                    opacity: 1 // Force opacity
                }}
            ></div>

            {/* Top Header */}
            <div
                className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 z-[60] transition-all duration-300 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${headerBg})` }}
            >
                {/* Overlay for better text readability if needed, though image is dark enough */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[-1]"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="bg-white/10 p-2 rounded-xl text-white backdrop-blur-md hover:bg-white/20 transition-colors mr-2"
                        >
                            <User className="w-8 h-8" />
                        </button>

                        {showProfile && (
                            <div className="absolute top-14 left-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 animate-in fade-in zoom-in-95 duration-200 z-[99999]">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-full text-indigo-600 dark:text-indigo-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{userData.name || 'User'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData.email || 'No email'}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => {
                                            setIsChangePasswordModalOpen(true);
                                            setShowProfile(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Lock className="w-4 h-4" />
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white/10 p-2 rounded-xl text-white backdrop-blur-md">
                        <Brain className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md hidden md:block">SecondBrain</h1>
                </div>

                <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto px-4 relative z-10">
                    {/* Search Bar */}
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder={searchSource === 'brain' ? "Search your brain..." : `Search ${searchSource.charAt(0).toUpperCase() + searchSource.slice(1)}...`}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none ring-1 ring-white/20 bg-black/20 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-white/40 focus:bg-black/30 focus:outline-none transition-all backdrop-blur-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Search Source Tabs */}
                    <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg backdrop-blur-md">
                        <button
                            onClick={() => setSearchSource('brain')}
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all
                                ${searchSource === 'brain'
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                        >
                            <Brain className="w-3 h-3" />
                            Brain
                        </button>
                        <button
                            onClick={() => setSearchSource('youtube')}
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all
                                ${searchSource === 'youtube'
                                    ? 'bg-red-500/80 text-white shadow-sm'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                        >
                            <Youtube className="w-3 h-3" />
                            YouTube
                        </button>
                        <button
                            onClick={() => setSearchSource('google')}
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all
                                ${searchSource === 'google'
                                    ? 'bg-blue-500/80 text-white shadow-sm'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                        >
                            <Globe className="w-3 h-3" />
                            Google
                        </button>
                        <button
                            onClick={() => setSearchSource('github')}
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all
                                ${searchSource === 'github'
                                    ? 'bg-gray-700/80 text-white shadow-sm'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                        >
                            <Github className="w-3 h-3" />
                            Github
                        </button>
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
                        onClick={() => setIsChatOpen(!isChatOpen)}
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
                {/* Sidebar - Only show when in Brain mode */}
                {searchSource === 'brain' && (
                    <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isProjectView={isProjectView} />
                )}

                <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent z-10">

                    {searchSource === 'brain' ? (

                        <div className="p-8 relative z-10 max-w-7xl mx-auto">
                            {activeTab === 'projects' ? (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                                        <Folder className="w-6 h-6 text-indigo-500" />
                                        My Projects
                                    </h2>
                                    {projects.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                            {projects.map((project) => (
                                                <div
                                                    key={project._id}
                                                    onClick={() => navigate(`/project/${project._id}`)}
                                                    className="bg-white dark:bg-[#1a1b2e] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1 relative"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                            <Folder className="w-6 h-6" />
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            {new Date(project.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 truncate">{project.name}</h3>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Project</p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteProject(project._id);
                                                            }}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Delete Project"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                                            <div className="bg-gray-100 dark:bg-gray-900/50 p-6 rounded-full mb-6 text-gray-400 dark:text-gray-700 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                                                <Folder className="w-16 h-16 opacity-50" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">No projects yet</h3>
                                            <p className="text-gray-500 mt-2">Create a project from the sidebar to get started.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {loading ? (
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                        </div>
                                    ) : filteredContents.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                            {filteredContents.map((content) =>
                                                <Card
                                                    key={content._id}
                                                    title={content.title}
                                                    type={content.type}
                                                    link={content.link}
                                                    tags={content.tags}
                                                    thumbnail={content.thumbnail}
                                                    contentId={content._id}
                                                    onShare={(data) => {
                                                        setShareData(data);
                                                        setShareModalOpen(true);
                                                    }}
                                                    onDelete={() => {
                                                        const ownerId = content.userId?._id || content.userId;
                                                        if (String(ownerId) === String(currentUserId)) {
                                                            // Optimistic Delete
                                                            setContents(prev => prev.filter(c => String(c._id) !== String(content._id)));

                                                            (async () => {
                                                                try {
                                                                    await api.delete(`/remove-content/${content._id}`);
                                                                    // Silent re-fetch to ensure sync
                                                                    fetchContents(true);
                                                                } catch (e) {
                                                                    console.error(e);
                                                                    alert("Failed to delete content");
                                                                    fetchContents(true); // Revert on failure
                                                                }
                                                            })();
                                                        }
                                                    }}
                                                    onEdit={() => {
                                                        const ownerId = content.userId?._id || content.userId;
                                                        if (String(ownerId) === String(currentUserId)) {
                                                            setEditingContent(content);
                                                            setIsModalOpen(true);
                                                        }
                                                    }}
                                                    onPreview={() => setPreviewData({
                                                        open: true,
                                                        link: content.link,
                                                        title: content.title,
                                                        type: content.type
                                                    })}
                                                    platform={content.platform}
                                                />
                                            )}
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
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-full p-4">
                            <WebSearch
                                query={searchQuery}
                                type={searchSource}
                                onAddContent={(link) => {
                                    setModalInitialLink(link);
                                    setIsModalOpen(true);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <CreateContentModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalInitialLink(''); // Reset after close
                    setEditingContent(null);
                }}
                onContentAdded={(newContent) => {
                    console.log("onContentAdded called with:", newContent);
                    if (newContent) {
                        // Optimistic Update
                        setContents(prev => {
                            const prevArray = Array.isArray(prev) ? prev : [];
                            console.log("Previous contents state:", prevArray);

                            // Avoid duplicates
                            if (prevArray.some(c => String(c._id) === String(newContent._id))) {
                                console.log("Updating existing content in state");
                                const updated = prevArray.map(c => String(c._id) === String(newContent._id) ? newContent : c);
                                console.log("New contents state (update):", updated);
                                return updated;
                            }
                            const newState = [newContent, ...prevArray];
                            console.log("New contents state (add):", newState);
                            return newState;
                        });

                        // Silent Re-fetch - DISABLED to prevent overwriting optimistic state
                        // fetchContents(true);
                        console.log("Optimistic update applied. Skipping silent fetch.");
                    } else {
                        fetchContents();
                    }
                }}
                initialLink={modalInitialLink}
                isEditing={!!editingContent}
                initialData={editingContent}
                projectId={projectId}
            />

            <ContentPreviewModal
                isOpen={previewData.open}
                onClose={() => setPreviewData({ ...previewData, open: false })}
                link={previewData.link}
                title={previewData.title}
                type={previewData.type}
            />

            <ShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                title={shareData?.title}
                link={shareData?.link}
                contentId={shareData?.contentId}
            />

            <BrainChat
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />

            <ChangePasswordModal
                open={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
            />
        </div>
    );
}

export default Dashboard;
