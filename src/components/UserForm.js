import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser, clearEditingUser } from '../features/usersSlice';

const UserForm = () => {
  const dispatch = useDispatch();
  const editingUser = useSelector(state => state.users.editingUser);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: editingUser || { name:'', email:'', phone:'', image:'' }
  });

  const onSubmit = (data) => {
    if(editingUser) dispatch(updateUser({ id: editingUser.id, user: data }));
    else dispatch(addUser(data));
    reset();
  };

  useEffect(() => { reset(editingUser || {}); }, [editingUser, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom:'20px' }}>
      <input {...register("name", { required: true })} placeholder="Name" />
      <input {...register("email", { required: true })} placeholder="Email" />
      <input {...register("phone", { required: true })} placeholder="Phone" />
      <input {...register("image", { required: true })} placeholder="Image URL" />
      <button type="submit">{editingUser ? "Update" : "Add"} User</button>
      {editingUser && <button type="button" onClick={() => dispatch(clearEditingUser())}>Cancel</button>}
    </form>
  );
};

export default UserForm;