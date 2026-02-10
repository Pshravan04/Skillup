import React, { useEffect, useState } from 'react';
import API from '../api';

export default function ExamPage(){
  const [exams,setExams]=useState([]);
  useEffect(()=>{API.get('/exams').then(r=>setExams(r.data)).catch(()=>{});},[]);
  return (
    <div className="card">
      <h3>Exams</h3>
      <ul>{exams.map(e=> <li key={e._id}>{e.title} — {e.course?.title}</li>)}</ul>
    </div>
  );
}
