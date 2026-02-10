import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('student');
  const nav = useNavigate();

  const submit = async e=>{
    e.preventDefault();
    await API.post('/auth/register',{ name,email,password,role });
    nav('/login');
  };

  return (
    <form onSubmit={submit} className="card">
      <h3>Register</h3>
      <input placeholder="name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <select value={role} onChange={e=>setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
      </select>
      <button>Register</button>
    </form>
  );
}
