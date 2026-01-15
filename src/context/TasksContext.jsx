import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID_TASKS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { useAuth } from './AuthContext';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const getTasks = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_TASKS,
                [Query.equal('user_id', user.$id)]
            );
            setTasks(response.documents);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        getTasks();
    }, [getTasks]);

    const addTask = async (taskData) => {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_TASKS,
                ID.unique(),
                { ...taskData, user_id: user.$id }
            );
            setTasks(prev => [response, ...prev]);
            return response;
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID_TASKS,
                taskId
            );
            setTasks(prev => prev.filter(task => task.$id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    };

    const updateTask = async (taskId, updatedData) => {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_TASKS,
                taskId,
                updatedData
            );
            setTasks(prev => prev.map(task => task.$id === taskId ? response : task));
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    }

    const contextData = {
        tasks,
        loading,
        addTask,
        deleteTask,
        updateTask,
        getTasks
    };

    return (
        <TasksContext.Provider value={contextData}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => { return useContext(TasksContext); };
