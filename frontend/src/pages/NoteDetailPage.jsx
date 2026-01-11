import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, SaveIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const NoteDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/notes/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (error) {
                console.error("Error fetching note:", error);
                toast.error("Failed to fetch note details");
                // navigate("/"); // Optional: redirect if not found
            } finally {
                setIsLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            return toast.error("Please fill in all fields");
        }

        setIsSaving(true);
        try {
            await axios.put(`http://localhost:3000/api/notes/${id}`, { title, content });
            toast.success("Note updated successfully");
            navigate("/"); // Optionally stay on page or go back
        } catch (error) {
            console.error("Error updating note:", error);
            toast.error("Failed to update note");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:3000/api/notes/${id}`);
            toast.success("Note deleted successfully");
            navigate("/");
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error("Failed to delete note");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-primary">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header: Back & Delete */}
                    <div className="flex justify-between items-center mb-6">
                        <Link to="/" className="btn btn-ghost">
                            <ArrowLeftIcon className="size-5" />
                            Back to Notes
                        </Link>

                        <button
                            onClick={handleDelete}
                            className="btn btn-outline btn-error"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <Loader2Icon className="size-5 animate-spin" />
                            ) : (
                                <Trash2Icon className="size-5" />
                            )}
                            Delete Note
                        </button>
                    </div>

                    {/* Editor Card */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <form onSubmit={handleSave}>
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text font-semibold">Title</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter note title"
                                        required
                                    />
                                </div>

                                <div className="form-control mb-6">
                                    <label className="label">
                                        <span className="label-text font-semibold">Content</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered h-40 w-full resize-none"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Enter note content"
                                        required
                                    />
                                </div>

                                <div className="card-actions justify-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2Icon className="size-5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <SaveIcon className="size-5" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NoteDetailPage