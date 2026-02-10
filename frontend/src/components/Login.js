import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const nav = useNavigate();

  const submit = async e=>{
    e.preventDefault();
    const res = await API.post('/auth/login',{ email, password });
    localStorage.setItem('token', res.data.token);
    nav('/');
  };

  return (
    <form onSubmit={submit} className="card">
      <h3>Login</h3>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}
