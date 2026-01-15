import { useState, useEffect } from 'react';
import { useTasks } from '../context/TasksContext';

const TaskForm = ({ onSuccess, initialTask }) => {
    const { addTask, updateTask } = useTasks();
    const [title, setTitle] = useState('');
    const [level, setLevel] = useState('low');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');

    useEffect(() => {
        if (initialTask) {
            setTitle(initialTask.title);
            setLevel(initialTask.level);
            // Format dates for input type="datetime-local": YYYY-MM-DDTHH:MM
            if (initialTask.date_start) setDateStart(new Date(initialTask.date_start).toISOString().slice(0, 16));
            if (initialTask.date_end) setDateEnd(new Date(initialTask.date_end).toISOString().slice(0, 16));
        }
    }, [initialTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const taskData = { title, level, date_start: dateStart, date_end: dateEnd };
            if (initialTask && initialTask.$id) {
                await updateTask(initialTask.$id, taskData);
            } else {
                await addTask(taskData);
            }

            setTitle('');
            setLevel('low');
            setDateStart('');
            setDateEnd('');
            if (onSuccess) onSuccess();
        } catch (error) {
            alert("Failed to save task");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <h3 style={{ marginTop: 0 }}>{initialTask && initialTask.$id ? 'Edit Task' : 'Add New Task'}</h3>
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="sketch-input"
                />
            </div>
            <div className="form-group">
                <label>Level</label>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="sketch-input"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div className="form-group">
                <label>Start Date</label>
                <input
                    type="datetime-local"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    required
                    className="sketch-input"
                />
            </div>
            <div className="form-group">
                <label>End Date</label>
                <input
                    type="datetime-local"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    required
                    className="sketch-input"
                />
            </div>
            <button type="submit" className="sketch-button" style={{ width: '100%', marginTop: '20px' }}>
                {initialTask && initialTask.$id ? 'Update Task' : 'Add Task'}
            </button>
        </form>
    );
};

export default TaskForm;
