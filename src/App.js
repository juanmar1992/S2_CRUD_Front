import React, { useState, useEffect, useCallback } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Globals from './config/globals';
import Swal from 'sweetalert2';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]); // Lista de tareas
    const [editingTask, setEditingTask] = useState(null); // Tarea en edición
    const BACK_URL = Globals.API_URL;

    // Función para cargar todas las tareas
    const fetchTasks = useCallback(async () => {
        try {
            const response = await fetch(BACK_URL, {
                headers: {'ngrok-skip-browser-warning': 'true'},
            });

            if (!response.ok) throw new Error('Error al obtener las tareas');

            const data = await response.json();

            setTasks(data); // Guarda las tareas en el estado

        } catch (error) {
            console.error('Error:', error);
        }
    }, [BACK_URL]);

    // Efecto para cargar las tareas al inicio
    useEffect(() => {
        fetchTasks(); // Llama a fetchTasks al montar el componente

        const interval = setInterval(() => { // Establece un intervalo para actualizar las tareas
            fetchTasks();
        }, Globals.INTERVAL); // 1000 ms = 1 segundo

        return () => clearInterval(interval); // Limpia el intervalo
    }, [fetchTasks]);

    // Función para manejar la creación o actualización de una tarea
    const handleSaveTask = async (taskData) => {
        try {
            const method = editingTask ? 'PUT' : 'POST';

            const url = editingTask
                ? `${BACK_URL}/${editingTask._id}`
                : BACK_URL;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) throw new Error('Error al guardar la tarea');

            fetchTasks();
            
            setEditingTask(null); // Limpia la tarea en edición

        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para manejar la eliminación de una tarea
    const handleDeleteTask = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${BACK_URL}/${id}`, {
                    method: 'DELETE',
                });
    
                if (!response.ok) throw new Error('Error al eliminar la tarea');

                fetchTasks(); // Actualiza la lista de tareas

                Swal.fire('Eliminado', 'La tarea ha sido eliminada con éxito', 'success');

            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    // Encuentra la tarea y cambia su estado de completado
    const toggleTaskComplete = async (id) => {
        try {
            const task = tasks.find((t) => t._id === id);

            if (!task) return;

            const updatedTask = { ...task, completed: !task.completed };

            const response = await fetch(`${BACK_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) throw new Error('Error al actualizar la tarea');

            fetchTasks(); // Actualiza las tareas

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            {/* Título */}
            <header className="app-header">
                <h1>Aplicación Web para Gestión de Tareas</h1>
                <h2>UTN - INSPT - Sistemas II - 3.603</h2>
                <h2>Profesor: Miguel Silva</h2>
                <h2>Alumno: Juan Manuel Martínez Marqués</h2>
            </header>

            <div className="app-content">
                {/* Formulario para crear o editar tareas */}
                <TaskForm
                    task={editingTask} // Tarea en edición
                    onSave={handleSaveTask} // Función para guardar
                    onCancel={() => setEditingTask(null)} // Cancela la edición
                />

                {/* Lista de tareas */}
                <TaskList
                    taskList={tasks} // Lista de tareas
                    onEdit={setEditingTask} // Función para editar
                    onDelete={handleDeleteTask} // Función para eliminar
                    onToggleComplete={toggleTaskComplete} // Función para cambiar completado
                />
            </div>
        </div>
    );
};

export default App;