import React, { useState } from 'react';
import API from '../api/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const res = await API.post('/users/login', { username, password });
    if (res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } else {
      alert(res.data.error || 'Login failed');
    }
  };
  return (
    <form onSubmit={submit}>
      <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} required />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}
