# Task Master UI & Logic Documentation

This document explains the "Frontend" of our Task Management Application. It details how the Visual Elements (UI) capture User Actions and communicate with the Logic (Backend).

## 1. The Core Architecture: "State-Driven UI"
In React, we don't manually change the screen (e.g., "delete this line"). Instead, we change the **DATA** (State), and the UI automatically repaints itself to match the data.

```javascript
// The "Truth" of the application
const [tasks, setTasks] = useState([]); 
const [newTask, setNewTask] = useState('');
```
*   **`tasks`**: An array holding all our to-do items. If this array changes, the list on screen updates instantly.
*   **`newTask`**: Holds the text currently valid in the input box.

---

## 2. The Input Mechanism (The Form)
### The Visual Element
```jsx
<form onSubmit={addTask} className="task-form">
  <input
    value={newTask}
    onChange={(e) => setNewTask(e.target.value)}
  />
  <button type="submit">Add</button>
</form>
```

### How it Works (The Chain of Events)
1.  **User Types**: Every keystroke triggers the `onChange` event.
2.  **State Update**: `setNewTask(e.target.value)` updates the memory variable `newTask` in real-time. This is called "Two-Way Data Binding".
3.  **User Clicks Add**: This triggers the `onSubmit` event on the form.
4.  **The Handler (`addTask`)**:
    *   **`e.preventDefault()`**: Stops the browser from reloading the page (default HTML behavior).
    *   **Validation**: Checks if the input is empty (`!newTask.trim()`).
    *   **Communication**: Sends a `POST` request to the Backend.
    *   **Optimistic Update**: On success, it adds the new task to the `tasks` array, causing the new item to "poof" into existence on the screen.

---

## 3. The Display Logic (The List)
### The Visual Element
```jsx
<div className="task-list">
  {tasks.map((task) => (
    <div key={task._id} className="task-item">
      ...
    </div>
  ))}
</div>
```

### How it Works
*   **`map()`**: This is a loop. It takes the array of data objects and transforms them into an array of HTML Elements (`<div>`).
*   **`key={task._id}`**: A crucial performance tag. It tells React exactly which item is which, so if one is deleted, it doesn't need to rebuild the whole list, just remove that one block.

---

## 4. Interactive Elements (Action Buttons)

### A. The "Check / Complete" Action
**The UI:**
```jsx
<span 
  className={`task-text ${task.isCompleted ? 'completed' : ''}`}
  onClick={() => toggleTask(task._id, task.isCompleted)}
>
  {task.text}
</span>
```
*   **Visual Feedback**: We use Conditional CSS (`${task.isCompleted ? 'completed' : ''}`). If the data says the task is done, the CSS class `.completed` is added, which applies the `text-decoration: line-through` style.
*   **Trigger**: Clicking the text itself triggers `toggleTask`.
*   **Communication**: Sends a `PUT` request to `/tasks/:id`. The backend updates the database, sends back the new object, and we swap the old one in our `tasks` state for the new one.

### B. The "Delete" Action
**The UI:**
```jsx
<button className="delete-btn" onClick={() => deleteTask(task._id)}>
  🗑️
</button>
```
*   **Trigger**: Clicking the trash icon.
*   **Communication**: Sends a `DELETE` request to `/tasks/:id`.
*   **State Update**: We use `.filter()` to create a new list that includes *everything except* the deleted ID. React sees the list is smaller and removes the item from the screen.

---

## Summary of Data Flow
1.  **User Input** -> **State Change** (`onChange`)
2.  **User Action** (Click/Submit) -> **Event Handler** (`onSubmit`, `onClick`)
3.  **Event Handler** -> **API Call** (Axios POST/PUT/DELETE)
4.  **API Response** -> **State Update** (`setTasks`)
5.  **State Update** -> **UI Re-render** (Screen updates automatically)
