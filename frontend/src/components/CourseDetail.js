import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function CourseDetail(){
  const { id } = useParams();
  const [course,setCourse]=useState(null);
  useEffect(()=>{API.get(`/courses/${id}`).then(r=>setCourse(r.data)).catch(()=>{});},[id]);
  if(!course) return <div className="card">Loading...</div>;
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p>Instructor: {course.instructor?.name}</p>
      <button onClick={()=>API.post(`/courses/${id}/enroll`).then(()=>alert('Enrolled')).catch(e=>alert('Login first'))}>Enroll</button>
    </div>
  );
}
