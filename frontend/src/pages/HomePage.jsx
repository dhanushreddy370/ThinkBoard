import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/notes");
        console.log(response.data)
        setNotes(response.data)
        setIsRateLimited(false)
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response && error.response.status === 429) {
          setIsRateLimited(true)
        } else {
          toast.error("Something went wrong")
        }
      } finally {
        setLoading(false)
      }
    };
    fetchNotes();
  }, []);

  const deleteNote = async (id) => {
    try {
      await axios.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id || note.id} note={note} onDelete={deleteNote} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage