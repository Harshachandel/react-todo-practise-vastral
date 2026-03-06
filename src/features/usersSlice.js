import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

// Async Thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

export const addUser = createAsyncThunk('users/addUser', async (user) => {
  const res = await axios.post(API_URL, user);
  return res.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

export const updateUser = createAsyncThunk('users/updateUser', async (user) => {
  const res = await axios.put(`${API_URL}/${user.id}`, user);
  return res.data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    editingUser: null
  },
  reducers: {
    setEditingUser: (state, action) => { state.editingUser = action.payload; },
    clearEditingUser: (state) => { state.editingUser = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.error.message })

      .addCase(addUser.fulfilled, (state, action) => { state.users.push(action.payload) })
      .addCase(deleteUser.fulfilled, (state, action) => { state.users = state.users.filter(u => u.id !== action.payload); })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        state.users[index] = action.payload;
        state.editingUser = null;
      });
  }
});

export const { setEditingUser, clearEditingUser } = usersSlice.actions;
export default usersSlice.reducer;