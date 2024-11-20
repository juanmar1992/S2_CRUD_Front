import React, { useState, useEffect } from 'react';
import Globals from '../config/globals';
import Swal from 'sweetalert2';
import './TaskForm.css';

const TaskForm = ({ task, onSave, onCancel }) => {
    const [asunto, setAsunto] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [prioridad, setPrioridad] = useState('Media');
    const [dbConnected, setDbConnected] = useState(false); // Estado de conexión con la BD


    useEffect(() => {
        if (task) { // Si hay una tarea en edición, inicializar con sus datos
            setAsunto(task.asunto || '');
            setObservaciones(task.observaciones || '');
            setPrioridad(task.prioridad || 'Media');

        } else { // Limpiar el formulario si no hay tarea en edición
            setAsunto('');
            setObservaciones('');
            setPrioridad('Media');

        }
    }, [task]);

    // Verificar la conexión con la base de datos
    useEffect(() => {
        const checkDatabaseConnection = async () => {
            try {
                const response = await fetch(`${Globals.API_URL}/health`, {
                    headers: {'ngrok-skip-browser-warning': 'true'},
                }); // Endpoint de salud del backend
                
                if (response.ok) {
                    setDbConnected(true);
                } else {
                    setDbConnected(false);
                }

            } catch (error) {
                console.error('Error al verificar la conexión con la BD:', error);
                setDbConnected(false);
            }
        };

        // Configurar un intervalo para ejecutar la función periódicamente
        const interval = setInterval(() => {
            checkDatabaseConnection();
        }, Globals.INTERVAL); // Intervalo de 1 segundo

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: task ? '¿Actualizar tarea?' : '¿Crear tarea?',
            text: '¿Estás seguro de que deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            onSave({ asunto, observaciones, prioridad });
            handleClear();
            Swal.fire('Guardado', 'La tarea ha sido guardada con éxito', 'success');
        }
    };

    const handleClear = () => {
        // Limpiar los campos del formulario
        setAsunto('');
        setObservaciones('');
        setPrioridad('Media');
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            
            <div className="db-status">
                {dbConnected ? (
                    <span className="db-connected">*** Base de datos conectada ***</span>
                ) : (
                    <span className="db-disconnected">*** Base de datos desconectada ***</span>
                )}
            </div>

            <h1>{task ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h1>

            <input
                type="text"
                placeholder="Asunto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                required
            />

            <textarea
                placeholder="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                required
            />

            <div className="form-group">
                <label htmlFor="task-priority">Prioridad:</label>
                <select
                    id="task-priority"
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value)}
                >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
            </div>

            <button type="submit">{task ? 'Actualizar' : 'Crear'}</button>

            <button type="button" onClick={task ? onCancel : handleClear}>
                {task ? 'Cancelar' : 'Limpiar Formulario'}
            </button>

        </form>
    );
};

export default TaskForm;