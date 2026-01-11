import { PenSquareIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../lib/utils'

const NoteCard = ({ note, onDelete }) => {
    return (
        <Link to={`/notes/${note._id}`}
            className="card bg-base-300 hover:shadow-lg transition-shadow duration-200
        border-t-4 border-solid border-[#00FF9D]">
            <div className="card-body">
                <h3 className="card-title">{note.title}</h3>
                <p>{note.content}</p>
                <div className="card-actions justify-between items-center mt-4">
                    <span className='text-sm text-base-content/60'>{formatDate(new Date(note.createdAt))}</span>
                    <div className='flex items-center gap-1'>
                        <PenSquareIcon className='size-4' />
                        <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent navigating to the note details page
                                onDelete(note._id);
                            }}
                        >
                            <Trash2Icon className='size-4' />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default NoteCard