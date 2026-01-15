import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import MainLayout from '../components/MainLayout';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import Modal from '../components/Modal';

const localizer = momentLocalizer(moment);

const Home = () => {
    const { logout } = useAuth();
    const { tasks, loading, updateTask } = useTasks();
    const [activeTab, setActiveTab] = useState('task');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // ... (rest of filtering/DnD/handlers)

    const handleEditClick = (task) => {
        setEditingTask(task);
        setShowCreateModal(true);
    };

    const handleCreateClick = () => {
        setEditingTask(null);
        setShowCreateModal(true);
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setEditingTask(null);
    };

    const handleSelectSlot = ({ start, end }) => {
        // Create a draft task with selected dates
        // Note: end date from 'select' is exclusive, normally we might want it inclusive or keep as is.
        // For simplicity, we use start and end as provided.
        setEditingTask({
            title: '',
            level: 'low',
            date_start: start.toISOString(),
            date_end: end.toISOString()
        });
        setShowCreateModal(true);
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newLevel = destination.droppableId; // 'high', 'medium', 'low'
        const taskToUpdate = tasks.find(t => t.$id === draggableId);

        if (taskToUpdate && taskToUpdate.level !== newLevel) {
            // Optimistic update locally could be done here, but usually Context update is fast enough or handles it.
            // For smoother DnD, we should update local state instantly. 
            // However, our Context re-fetches or updates state. Let's rely on Context `updateTask`.
            try {
                await updateTask(draggableId, { level: newLevel });
            } catch (e) {
                console.error("Failed to update task level on drop", e);
            }
        }
    };

    const getTasksByLevel = (level) => {
        return tasks.filter(t => t.level === level);
    };

    return (
        <MainLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCreateClick={handleCreateClick}
            onLogout={logout}
        >
            {activeTab === 'task' && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
                        {loading && <p>Loading tasks...</p>}

                        {!loading && (
                            <>
                                {/* Hard / High Section */}
                                <Droppable droppableId="high">
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{ background: '#fff0f0', padding: '10px', borderRadius: '10px', border: '1px dashed #ffcccc', minHeight: '100px' }}
                                        >
                                            <h3 style={{ marginTop: 0, color: '#d9534f' }}>Hard</h3>
                                            {getTasksByLevel('high').map((task, index) => (
                                                <Draggable key={task.$id} draggableId={task.$id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => handleEditClick(task)}
                                                        >
                                                            <TaskItem task={task} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>

                                {/* Medium Section */}
                                <Droppable droppableId="medium">
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{ background: '#fffdef', padding: '10px', borderRadius: '10px', border: '1px dashed #efe7bc', minHeight: '100px' }}
                                        >
                                            <h3 style={{ marginTop: 0, color: '#f0ad4e' }}>Medium</h3>
                                            {getTasksByLevel('medium').map((task, index) => (
                                                <Draggable key={task.$id} draggableId={task.$id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => handleEditClick(task)}
                                                        >
                                                            <TaskItem task={task} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>

                                {/* Easy / Low Section */}
                                <Droppable droppableId="low">
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{ background: '#f0fff4', padding: '10px', borderRadius: '10px', border: '1px dashed #c3e6cb', minHeight: '100px' }}
                                        >
                                            <h3 style={{ marginTop: 0, color: '#5cb85c' }}>Easy</h3>
                                            {getTasksByLevel('low').map((task, index) => (
                                                <Draggable key={task.$id} draggableId={task.$id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => handleEditClick(task)}
                                                        >
                                                            <TaskItem task={task} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </>
                        )}
                    </div>
                </DragDropContext>
            )}

            {activeTab === 'schedule' && (
                <div style={{ height: '100%', padding: '10px' }}>
                    <Calendar
                        localizer={localizer}
                        events={tasks
                            .filter(t => t.date_start) // Only show tasks with a start date
                            .map(t => ({
                                id: t.$id,
                                title: t.title,
                                start: new Date(t.date_start),
                                end: t.date_end ? new Date(t.date_end) : new Date(new Date(t.date_start).getTime() + 60 * 60 * 1000), // Default to 1 hour if no end date
                                resource: t
                            }))}
                        startAccessor="start"
                        endAccessor="end"
                        selectable={true}
                        onSelectSlot={handleSelectSlot}
                        style={{ height: '100%' }}
                        onSelectEvent={handleEditClick}
                        components={{
                            event: ({ event }) => (
                                <div
                                    title={`${event.title} (${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: '#333',
                                        marginBottom: '2px',
                                        lineHeight: 1,
                                        maxWidth: '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {event.title}
                                    </span>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: event.resource.level === 'high' ? '#d9534f'
                                            : event.resource.level === 'medium' ? '#f0ad4e'
                                                : '#5cb85c',
                                    }} />
                                </div>
                            )
                        }}
                        eventPropGetter={() => ({
                            style: {
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                                textAlign: 'center',
                                boxShadow: 'none'
                            }
                        })}
                    />
                </div>
            )}

            <Modal isOpen={showCreateModal} onClose={handleCloseModal}>
                <TaskForm onSuccess={handleCloseModal} initialTask={editingTask} />
            </Modal>
        </MainLayout>
    );
};

export default Home;
