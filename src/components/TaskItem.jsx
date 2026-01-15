import { useTasks } from '../context/TasksContext';

const TaskItem = ({ task }) => {
    const { deleteTask } = useTasks();

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTask(task.$id);
        }
    };

    const getBackgroundColor = (level) => {
        switch (level) {
            case 'high': return '#ffcfcf'; // reddish/pink
            case 'medium': return '#fff5cc'; // yellowish
            default: return '#ceffe0'; // greenish
        }
    };

    return (
        <div style={{
            padding: '15px 20px',
            border: '2px solid black',
            borderRadius: '50px', // Pill shape
            marginBottom: '15px',
            backgroundColor: getBackgroundColor(task.level),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.1s'
        }}
        // Adding a hover effect via inline styles is tricky, handled via class in a real app, 
        // but let's stick to simple inline for now or add a class if created.
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{task.title}</h4>
            </div>

            <button
                onClick={handleDelete}
                style={{
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: '#ff5555'
                }}
            >
                &times;
            </button>
        </div>
    );
};

export default TaskItem;

