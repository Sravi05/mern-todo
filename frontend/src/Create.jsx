import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Create = () => {
    const [task,setTask]=useState();
    //function to add a task
    const handleAdd = () => {
        axios.post('http://localhost:1000/add',{task:task})
        .then(result=>{
            toast.success("New task added successfully!",{ autoClose: 50000 });
            window.location.reload();})
        .catch(err => console.error(err));
    };
  return (
    <div className='create_form'>
      <input type="text" placeholder='Enter Task' onChange={(e)=>setTask(e.target.value)}/>
      <button type='submit' onClick={handleAdd}>Add</button>
    </div>
  )
}

export default Create
