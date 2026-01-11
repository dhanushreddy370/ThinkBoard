import mongoose from "mongoose";

// Create a schema
const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } // createdAt and updatedAt
)

// Model based off of that schema

const Note = mongoose.model("Note", noteSchema);

export default Note;