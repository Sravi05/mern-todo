import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsCircleFill, BsFillTrashFill, BsFillCheckCircleFill, BsPencil } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editTask, setEditTask] = useState('');

    useEffect(() => {
        axios.get('http://localhost:1000/get')
            .then(result => setTodos(result.data))
            .catch(err => console.error(err));
    }, []);

    // Toggle task completion status
    const handleCompleteToggle = (id, done) => {
        axios.put(`http://localhost:1000/update/${id}`, { done: !done })
            .then(() => {
                toast.success("Task completed successfully!", { autoClose: 5000 });
                setTodos(todos.map(todo => todo._id === id ? { ...todo, done: !todo.done } : todo));
            })
            .catch(err => console.error(err));
    };

    // Enter edit mode for a task
    const handleEditClick = (id, task) => {
        setEditId(id);
        setEditTask(task);
    };

    // Save edited task
    const handleEditSave = (id) => {
        axios.put(`http://localhost:1000/update/${id}`, { task: editTask })
            .then(() => {
                toast.success("Task updated successfully!", { autoClose: 5000 });
                setTodos(todos.map(todo => todo._id === id ? { ...todo, task: editTask } : todo));
                setEditId(null);
                setEditTask('');
            })
            .catch(err => console.error(err));
    };

    // Handle task deletion
    const handleDelete = (id) => {
        axios.delete(`http://localhost:1000/delete/${id}`)
            .then(() => {
                toast.error("Task deleted successfully!", { autoClose: 5000 });
                setTodos(todos.filter(todo => todo._id !== id));
            })
            .catch(err => console.error(err));
    };

    return (
        <div className='home'>
            <h2>Todo List</h2>
            <Create setTodos={setTodos} />
            <br />
            {todos.length === 0 ? (
                <div><h2>No Record</h2></div>
            ) : (
                todos.map(todo => (
                    <div key={todo._id} className='task'>
                        <div className='checkbox'>
                            {/* Checkbox to toggle completion */}
                            {todo.done ? (
                                <BsFillCheckCircleFill className='icon' onClick={() => handleCompleteToggle(todo._id, todo.done)} />
                            ) : (
                                <BsCircleFill className='icon' onClick={() => handleCompleteToggle(todo._id, todo.done)} />
                            )}
                            
                            {/* Display input if editing, otherwise display text */}
                            {editId === todo._id ? (
                                <input
                                    className="edit_input"
                                    autoFocus={true} // Focus on input field on opening edit mode
                                    type="text"
                                    value={editTask}
                                    onChange={(e) => setEditTask(e.target.value)}
                                    onBlur={() => handleEditSave(todo._id)} // Save on losing focus
                                    onKeyPress={(e) => e.key === 'Enter' && handleEditSave(todo._id)} // Save on Enter key press
                                />
                            ) : (
                                // Task text remains editable even if completed
                                <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
                            )}
                        </div>
                        <div>
                            {/* Pencil icon to enter edit mode */}
                            <BsPencil className='icon' onClick={() => handleEditClick(todo._id, todo.task)} />
                            {/* Trash icon to delete the task */}
                            <BsFillTrashFill className='icon' onClick={() => handleDelete(todo._id)} />
                        </div>
                    </div>
                ))
            )}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default Home;
