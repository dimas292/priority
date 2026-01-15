import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import MainLayout from '../components/MainLayout';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import Modal from '../components/Modal';

const Home = () => {
    const { logout } = useAuth();
    const { tasks, loading, updateTask } = useTasks();
    const [activeTab, setActiveTab] = useState('task');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>
                    <p>Schedule view is under construction.</p>
                </div>
            )}

            <Modal isOpen={showCreateModal} onClose={handleCloseModal}>
                <TaskForm onSuccess={handleCloseModal} initialTask={editingTask} />
            </Modal>
        </MainLayout>
    );
};

export default Home;
