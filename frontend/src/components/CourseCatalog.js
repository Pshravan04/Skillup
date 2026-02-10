import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function CourseCatalog(){
  const [courses,setCourses]=useState([]);
  useEffect(()=>{API.get('/courses').then(r=>setCourses(r.data)).catch(()=>{});},[]);
  return (
    <div className="card">
      <h3>Courses</h3>
      <ul>
        {courses.map(c=> <li key={c._id}><Link to={`/courses/${c._id}`}>{c.title}</Link> — {c.instructor?.name}</li>)}
      </ul>
    </div>
  );
}
