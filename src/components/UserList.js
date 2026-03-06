import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, setEditingUser } from '../features/usersSlice';
import UserForm from './UserForm.jsx';

const UserList = () => {
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.users);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const displayed = filtered.slice((currentPage-1)*perPage, currentPage*perPage);

  return (
    <div>
      <UserForm />

      <div style={{ display:'flex', gap:'10px', marginBottom:'10px' }}>
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      {displayed.map(u => (
        <div key={u.id} style={{ display:'flex', alignItems:'center', marginBottom:'10px' }}>
          <img src={u.image} alt={u.name} width={50} style={{ marginRight:'10px' }} />
          <span>{u.name} | {u.email} | {u.phone}</span>
          <button onClick={() => dispatch(setEditingUser(u))}>Edit</button>
          <button onClick={() => dispatch(deleteUser(u.id))}>Delete</button>
        </div>
      ))}

      <div style={{ marginTop:'10px' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i+1} onClick={() => setCurrentPage(i+1)}>{i+1}</button>
        ))}
      </div>
    </div>
  );
};

export default UserList;