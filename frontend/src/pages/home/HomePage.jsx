import { useState, useEffect } from 'react'
import { useAuth } from '../../store/useAuthStore';
import { useNoteStore } from '../../store/useNotesStore';
import { useCategories } from '../../store/useCategoriesStore';
import { Bell, Plus, Edit, Trash2, Search, X, Check, User, Menu, LogOut, Settings, Save, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import asset from '../../assets/asset';
import Modal from '../../components/Modal';

export default function HomePage() {
    const { userAuth, updateUser, logout } = useAuth()
    const { ListNotes, getAllNotes, addNotes, updateNoteExisting, deleteNote } = useNoteStore()
    const { ListCategories, checkCategories, addCategories } = useCategories()

    const [profile, setProfile] = useState({
        name: '',
        avatar: asset.userIcon,
        email: ''
    });

    const [editedProfile, setEditedProfile] = useState({ ...profile, password: '', confirmPassword: '' });


    useEffect(() => {
        if (userAuth) {
            setProfile({
                name: userAuth.username,
                email: userAuth.email
            })
        }

        setEditedProfile({
            name: userAuth.username,
            email: userAuth.email,
            avatar: asset.userIcon,
            password: '',
            confirmPassword: ''
        });
    }, [])

    // State for notes
    const [notes, setNotes] = useState([
        {
            id: null,
            title: '',
            content: '',
            category: '',
            createdAt: new Date().toISOString(),
            isPinned: false
        }
    ]);

    useEffect(() => {
        const renderNotes = async () => {
            await getAllNotes()
        }
        renderNotes()
    }, [getAllNotes, userAuth])

    useEffect(() => {
        if (ListNotes) {
            const formattedNotes = ListNotes.map(note => ({
                id: note.notes_id,
                title: note.title,
                content: note.content_container,
                category: note.category_name || 'Personal',
                cat_id: null,
                createdAt: note.createdat || new Date().toISOString(),
                isPinned: note.ispin || false
            }));
            setNotes(formattedNotes);
        }
    }, [ListNotes]);

    // State for categories
    const [categories, setCategories] = useState([
        { name: 'All', id: null }
    ])

    useEffect(() => {
        const renderNotes = async () => {
            await checkCategories()
        }
        renderNotes()
    }, [checkCategories, userAuth])

    useEffect(() => {
        if (ListCategories) {
            const storedCategories = ListCategories.map(cat => ({
                name: cat.category_name,
                id: cat.cat_id
            }));

            setCategories(prev => [
                ...prev.filter(cat => ['All'].includes(cat.name)),
                ...storedCategories.filter(
                    sc => !prev.some(p => p.name === sc.name)
                )
            ]);
        }
    }, [ListCategories]);

    // Application state
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingProfile, setEditingProfile] = useState(false);
    const [isAddNote, setIsAddNote] = useState(false)
    const [isLogoutShow, setIsLogoutShow] = useState(false)

    // Filter notes based on category and search query
    const filteredNotes = notes.filter(note => {
        const title = note.title || '';
        const content = note.content || '';
        const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Sort notes - pinned first, then by date
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const selectedCat = categories.find(cat => cat.name === selectedCategory);
    const catId = selectedCategory !== 'All' ? selectedCat?.id : null;

    // Add Form State
    const [noteForm, setNote] = useState({
        cat_id: catId,
        title: '',
        content: '',
        category: selectedCategory !== 'All' ? selectedCategory : '',
        createdAt: new Date().toISOString(),
        isPinned: false
    })

    // Handle note creation
    const handleAddNote = async () => {
        const AddedNote = await addNotes(noteForm)
        if (AddedNote) {
            setNotes([...notes, noteForm]);
            setEditingNote(null);
            setIsAddNote(false)
        }
    };

    // Handle note update
    const handleUpdateNote = async (updatedNote) => {

        if (!updatedNote.cat_id) {
            const categoryObj = categories.find(cat =>
                cat.name === updatedNote.category
            );
            updatedNote.cat_id = categoryObj?.id || null;
        }

        // If we still don't have a cat_id, show error
        if (!updatedNote.cat_id) {
            console.error("Could not determine category ID");
            // Optionally show error to user
            return;
        }
        const success = await updateNoteExisting({
            cat_id: updatedNote.cat_id,
            note_id: updatedNote.id,
            title: updatedNote.title,
            content: updatedNote.content
        });

        if (success) {
            setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
            console.log(updatedNote)
            setEditingNote(null);
        }


    };

    // Handle note deletion
    const handleDeleteNote = async (id) => {

        setNotes(notes.filter(note => note.id !== id));
        if (editingNote && editingNote.id === id) {
            setEditingNote(null);
        }
        const deleteSuccess = await deleteNote({
            note_id: id
        })
        if (!deleteSuccess) return
    };

    // Handle toggle pin
    const handleTogglePin = (id) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
        ));
    };

    // Handle add category
    const handleAddCategory = async () => {
        if (newCategoryName && !categories.some(cat => cat.name === newCategoryName)) {
            const addedCategory = await addCategories(newCategoryName);
            if (addedCategory) {

                setCategories([...categories, {
                    name: addedCategory.category_name,
                    id: addedCategory.cat_id
                }]);
                setNewCategoryName('');
                setShowAddCategory(false);
            }
        }
    };

    // Handle profile update
    const handleUpdateProfile = async () => {
        const isSuccess = await updateUser(editedProfile)
        if (isSuccess) {
            setEditingProfile(false)
            setProfile(editedProfile);
        }

    };

    const navigate = useNavigate()

    const handleLogout = async () => {
        const isSuccess = await logout()
        if (!isSuccess) return
        navigate('/login')
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${showSidebar ? 'w-64' : 'w-0'} bg-blue-600 text-white transition-all duration-300 overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-blue-500 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Secret Notes</h1>
                    <button
                        onClick={() => setShowSidebar(false)}
                        className="text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* User Profile */}
                <div className="p-4 flex items-center space-x-3 border-b border-blue-500">
                    <div className="relative">
                        <img
                            src={asset.userIcon}
                            alt="Profile"
                            className="rounded-full w-10 h-10 object-cover border-2 border-white"
                        />
                        <div
                            className="absolute bottom-0 right-0 bg-green-400 rounded-full w-3 h-3 border border-white"
                            title="Online"
                        ></div>
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold">{profile.name}</div>
                        <div className="text-xs text-blue-200">{profile.email}</div>
                    </div>
                    <button
                        onClick={() => setShowProfileEdit(!showProfileEdit)}
                        className="text-blue-200 hover:text-white"
                    >
                        <Settings size={16} />
                    </button>
                </div>

                {/* Categories */}
                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold">Categories</h2>
                        <button
                            onClick={() => setShowAddCategory(true)}
                            className="text-blue-200 hover:text-white"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {showAddCategory && (
                        <div className="mb-2 flex">
                            <Modal Open={true}>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="flex-1 px-4 py-3 text-black text-sm rounded-l border"
                                    placeholder="New category..."
                                />
                                <button
                                    onClick={handleAddCategory}
                                    className="bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded-r"
                                >
                                    <Check size={16} />
                                </button>
                                <button
                                    onClick={() => setShowAddCategory(false)}
                                    className="bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded-r"
                                >
                                    <X size={16} />
                                </button>
                            </Modal>
                        </div>
                    )}

                    <ul className="space-y-1">
                        {categories.map(category => (
                            <li key={category.name}>
                                <button
                                    onClick={() => setSelectedCategory(category.name)}
                                    className={`w-full text-left px-3 py-2 rounded ${selectedCategory === category.name ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
                                >
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-blue-500">
                    <button onClick={() => setIsLogoutShow(true)}
                        className="flex items-center space-x-2 text-blue-200 hover:text-white">
                        <LogOut size={16} />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="flex items-center px-4 h-16">
                        {!showSidebar && (
                            <button
                                onClick={() => setShowSidebar(true)}
                                className="mr-4 text-gray-600"
                            >
                                <Menu size={24} />
                            </button>
                        )}

                        <div className="flex-1 max-w-lg">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <div className="absolute left-3 top-2.5 text-gray-500">
                                    <Search size={16} />
                                </div>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-2.5 text-gray-500"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center ml-4 space-x-4">
                            <button className="text-gray-600 relative">
                                <Bell size={20} />
                                {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"></span> */}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 overflow-auto">
                    {/* Create Note Button */}
                    <div className="mb-4">
                        <button
                            onClick={() => setIsAddNote(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            <Plus size={20} className="mr-2" />
                            Create New Note
                        </button>
                    </div>

                    {/* Notes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedNotes.map(note => (
                            <div
                                key={note.id}
                                className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${note.isPinned ? 'border-yellow-500' : 'border-blue-500'
                                    } hover:shadow-lg transition-all duration-200`}
                            >
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{note.title}</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleTogglePin(note.id)}
                                                className={`${note.isPinned ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
                                                title={note.isPinned ? "Unpin" : "Pin"}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M5 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                                                    <path fillRule="evenodd" d="M10 0a1 1 0 00-1 1v12.586l-2.293-2.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 13.586V1a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setEditingNote(note)}
                                                className="text-gray-400 hover:text-blue-500"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="text-gray-400 hover:text-red-500"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="whitespace-pre-wrap text-gray-700 mb-4 max-h-32 overflow-hidden">
                                        {note.content}
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                                            {note.category}
                                        </span>
                                        <span>{formatDate(note.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {sortedNotes.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-gray-500 mt-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg">No notes found</p>
                            <p className="text-sm mb-4">Create a new note or change your search criteria</p>
                            <button
                                onClick={() => setIsAddNote(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center"
                            >
                                <Plus size={16} className="mr-2" />
                                Create Note
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Edit Note Modal */}
            {editingNote && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Edit Note</h2>
                            <button
                                onClick={() => setEditingNote(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editingNote.title}
                                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Content</label>
                                <textarea
                                    value={editingNote.content}
                                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-64"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Category</label>
                                <select
                                    value={editingNote.category}
                                    onChange={(e) => {
                                        const selectedCat = categories.find(cat => cat.name === e.target.value);
                                        setEditingNote({
                                            ...editingNote,
                                            category: e.target.value,
                                            cat_id: selectedCat ? selectedCat.id : null
                                        });
                                    }}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.slice(1).map(category => (
                                        <option key={category.name || category} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setEditingNote(null)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleUpdateNote(editingNote)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                                >
                                    <Save size={16} className="mr-2" />
                                    Save Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {isAddNote && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Add Note</h2>
                            <button
                                onClick={() => setIsAddNote(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={noteForm.title}
                                    onChange={(e) => setNote({ ...noteForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Content</label>
                                <textarea
                                    value={noteForm.content}
                                    onChange={(e) => setNote({ ...noteForm, content: e.target.value })}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-64"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Category</label>
                                <select
                                    value={noteForm.category}
                                    onChange={(e) => {
                                        const selectedCat = categories.find(cat => cat.name === e.target.value);
                                        setNote({
                                            ...noteForm,
                                            category: e.target.value,
                                            cat_id: selectedCat ? selectedCat.id : null
                                        });
                                    }}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.slice(1).map(category => (
                                        <option key={category.name} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsAddNote(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAddNote()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                                >
                                    <Save size={16} className="mr-2" />
                                    Save Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Edit Modal */}
            {showProfileEdit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Profile Settings</h2>
                            <button
                                onClick={() => setShowProfileEdit(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {!editingProfile ? (
                            <div className="p-4">
                                <div className="flex flex-col items-center mb-4">
                                    <div className="relative mb-4">
                                        <img
                                            src={asset.userIcon}
                                            alt="Profile"
                                            className="rounded-full w-20 h-20 object-cover border-4 border-blue-200"
                                        />
                                        <button
                                            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border-2 border-white"
                                            onClick={() => setEditingProfile(true)}
                                        >
                                            <Edit size={12} />
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold">{profile.name}</h3>
                                    <p className="text-gray-500">{profile.email}</p>
                                </div>

                                <div className="space-y-2">
                                    <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 rounded flex items-center justify-center">
                                        <User size={16} className="mr-2" />
                                        Account Settings
                                    </button>
                                    <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 rounded flex items-center justify-center">
                                        <Bell size={16} className="mr-2" />
                                        Notification Settings
                                    </button>
                                    <button
                                        onClick={() => setEditingProfile(true)}
                                        className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 rounded flex items-center justify-center"
                                    >
                                        <Edit size={16} className="mr-2" />
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="mt-4 pt-4 border-t z-100">
                                    <button onClick={() => setIsLogoutShow(true)}
                                        className="w-full bg-red-100 hover:bg-red-200 text-red-800 py-2 rounded flex items-center justify-center cursor-pointer">
                                        <LogOut size={16} className="mr-2" />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4">
                                <div className="flex flex-col items-center mb-4">
                                    <div className="relative mb-4">
                                        <img
                                            src={editedProfile.avatar}
                                            alt="Profile"
                                            className="rounded-full w-20 h-20 object-cover border-4 border-blue-200"
                                        />
                                        <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border-2 border-white">
                                            <Edit size={12} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={editedProfile.name}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">Email</label>
                                        <input
                                            disabled={true}
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-300 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">New Password</label>
                                        <input
                                            type="email"
                                            value={editedProfile.password}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, password: e.target.value })}
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="email"
                                            value={editedProfile.confirmPassword}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, confirmPassword: e.target.value })}
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-2">
                                    <button
                                        onClick={() => setEditingProfile(false)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateProfile}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                                    >
                                        <Save size={16} className="mr-2" />
                                        Save Profile
                                    </button>
                                </div>

                            </div>
                        )}

                    </div>
                </div>
            )}

            {
                isLogoutShow && (
                    <dialog className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Confirm Logout</h3>
                            <p className="py-4">Are you sure you want to logout?</p>
                            <div className="modal-action">
                                <button
                                    className="btn bg-gray-300 hover:bg-gray-400"
                                    onClick={() => setIsLogoutShow(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn bg-red-500 text-white hover:bg-red-600"
                                    onClick={handleLogout}
                                >
                                    Yes, Logout
                                </button>
                            </div>
                        </div>
                    </dialog>
                )
            }
        </div>
    );
}