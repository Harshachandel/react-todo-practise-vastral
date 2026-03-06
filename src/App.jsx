import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import './App.css'
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
} from './features/taskSlices';

const taskTypes = {
  Office: 'task-type-Office',
  Personal: 'task-type-Personal',
  Family: 'task-type-Family',
  Friends: 'task-type-Friends',
  Other: 'task-type-Other',
};

function App() {
  const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasks);

  const [editTaskId, setEditTaskId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      task: '',
      username: '',
      date: '',
      status: false,
      task_type: 'Office',
    },
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Calculate stats
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 1).length;
  const pending = total - done;

  // Handle form submit
  const onSubmit = (data) => {
    const taskPayload = {
      task: data.task.trim(),
      username: data.username.trim(),
      date: data.date.trim(),
      status: data.status ? 1 : 0,
      task_type: data.task_type,
    };

    if (editTaskId) {
      dispatch(updateTask({ id: editTaskId, ...taskPayload }));
      setEditTaskId(null);
    } else {
      dispatch(addTask(taskPayload));
    }
    reset();
  };

  // Edit a task
  const onEdit = (task) => {
    setEditTaskId(task.id);
    setValue('task', task.task);
    setValue('username', task.username);
    setValue('date', task.date);
    setValue('status', task.status === 1);
    setValue('task_type', task.task_type);
  };

  // Delete a task
  const onDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
      if (editTaskId === id) {
        reset();
        setEditTaskId(null);
      }
    }
  };

  return (
    <div className="app-container">
      <h2 className="heading-secondary">TASK MANAGER</h2>
      <h1 className="heading-primary">My Todo List</h1>

      {/* Stats */}
      <div className="stats">
        <StatCard title="Total" count={total} color="#5a4fcf" />
        <StatCard title="Pending" count={pending} color="#f4a261" />
        <StatCard title="Done" count={done} color="#2a9d8f" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <h3>{editTaskId ? 'Edit Task' : 'Add New Task'}</h3>

        <div className="form-group">
          <label>Task (min 3 chars):</label>
          <textarea
            rows={3}
            {...register('task', {
              required: 'Task is required',
              minLength: { value: 3, message: 'Minimum 3 characters required' },
            })}
            className={errors.task ? 'input-error' : ''}
          />
          {errors.task && <small className="error-msg">{errors.task.message}</small>}
        </div>

        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            {...register('username', {
              required: 'Username is required',
              validate: (v) => v.trim() !== '' || 'Username cannot be blank',
            })}
            className={errors.username ? 'input-error' : ''}
          />
          {errors.username && <small className="error-msg">{errors.username.message}</small>}
        </div>

        <div className="form-group">
          <label>Date (numbers only):</label>
          <input
            type="text"
            {...register('date', {
              required: 'Date is required',
              pattern: {
                value: /^[0-9-]+$/,
                message: 'Date can only contain numbers and hyphen',
              },
            })}
            className={errors.date ? 'input-error' : ''}
          />
          {errors.date && <small className="error-msg">{errors.date.message}</small>}
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" {...register('status')} />
            Completed
          </label>
        </div>

        <div className="form-group">
          <label>Task Type:</label>
          <select {...register('task_type', { required: true })}>
            {Object.keys(taskTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-submit">
          {editTaskId ? 'Update Task' : 'Add Task'}
        </button>
      </form>

      {/* Task Table */}
      <table className="task-table">
        <thead>
          <tr>
            <th>#</th>
            <th>TASK</th>
            <th>USERNAME</th>
            <th>DATE</th>
            <th>TYPE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => (
            <tr key={task.id}>
              <td>{idx + 1}</td>
              <td className={task.status === 1 ? 'task-done' : ''}>{task.task}</td>
              <td>
                <span className="username-badge">@{task.username}</span>
              </td>
              <td>{task.date}</td>
              <td>
                <span className={`task-type-badge ${taskTypes[task.task_type] || taskTypes.Other}`}>
                  {task.task_type}
                </span>
              </td>
              <td>
                {task.status === 1 ? (
                  <span className="status-done">✓ Done</span>
                ) : (
                  <span className="status-pending">⧗ Pending</span>
                )}
              </td>
              <td>
                <button className="btn btn-edit" onClick={() => onEdit(task)}>
                  Edit
                </button>
                <button className="btn btn-delete" onClick={() => onDelete(task.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="7" className="no-tasks">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const StatCard = ({ title, count, color }) => (
  <div className="stat-card">
    <div className="count" style={{ color }}>
      {count}
    </div>
    <div className="title">{title}</div>
  </div>
);

export default App;