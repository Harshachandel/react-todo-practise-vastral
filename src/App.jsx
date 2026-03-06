import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser, deleteUser, updateUser, setEditingUser, clearEditingUser } from "./features/usersSlice";
import { useForm } from "react-hook-form";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { users, loading, editingUser } = useSelector(state => state.users);

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(5); // default 5
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    reset(editingUser || { name: '', email: '', phone: '', image: '' });
  }, [editingUser, reset]);

  const onSubmit = (data) => {
    if(editingUser) dispatch(updateUser({ ...data, id: editingUser.id }));
    else dispatch(addUser(data));
    reset();
  };

  const handleEdit = (user) => dispatch(setEditingUser(user));
  const handleDelete = (id) => dispatch(deleteUser(id));
  const handleCancel = () => dispatch(clearEditingUser());

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  return (
    <div className="container">
      <h1>CRUD App with React & JSON Server</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Name" {...register("name", { required: true })} />
        <input placeholder="Email" {...register("email", { required: true })} />
        <input placeholder="Phone" {...register("phone", { required: true })} />
        <input placeholder="Image URL" {...register("image", { required: true })} />
        <button type="submit">{editingUser ? "Update" : "Add"}</button>
        {editingUser && <button type="button" onClick={handleCancel}>Cancel</button>}
      </form>

      <div className="controls">
        <input placeholder="Search by name/email/phone" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.slice(0, perPage).map(user => (
              <tr key={user.id}>
                <td><img src={user.image} alt={user.name} /></td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;