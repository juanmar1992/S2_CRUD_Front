import React from 'react';
import './TaskList.css';

const TaskList = ({ taskList, onEdit, onDelete, onToggleComplete }) => {
    return (
        <table className="task-table">
            <thead>
                <tr>
                    <th className='col-asunto'>Asunto</th>
                    <th className='col-observaciones'>Observaciones</th>
                    <th className='col-prioridad'>Prioridad</th>
                    <th className='col-fecha'>Última Modificación</th>
                    <th className='col-estado'>Estado</th>
                    <th className='col-acciones'>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {taskList.map((task) => (
                    <tr key={task._id} className={task.completed ? 'completed-row' : ''}>
                        <td className='col-asunto'>{task.asunto}</td>
                        <td className='col-observaciones'>{task.observaciones}</td>
                        <td className='col-prioridad'>{task.prioridad}</td>
                        <td className='col-fecha'>{new Date(task.fechaCarga).toLocaleString()}</td>
                        <td className='col-estado'>
                            <input
                                type="checkbox"
                                className="custom-checkbox"
                                checked={task.completed}
                                onChange={() => onToggleComplete(task._id)}
                            />
                        </td>
                        <td className='col-acciones'>
                            <button
                                onClick={() => onEdit(task)}
                                disabled={task.completed} // Deshabilita si está completada
                                className={task.completed ? 'disabled-button' : ''}
                            >
                                Editar
                            </button>
                            <button onClick={() => onDelete(task._id)}>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TaskList;