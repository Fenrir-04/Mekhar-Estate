import { set } from 'mongoose';
import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [error,setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({
      ...formData, // to retain the previous written, such that it doesn;t get lost after moving to next column
      [e.target.id]: e.target.value, // put the value directly using the id, given at the time of form creation
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await fetch('/api/auth/signup', { // fetch the data from the signupm form and post it directly from browser
        method: 'POST', 
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // convert the above string data to json format
      console.log(data);

      if(data.success === false){ // Error handling
        setLoading(false);
        setError(data.message); 
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    }
    catch(err){
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-3'>
        <input type='text' placeholder='username' className='p-3 rounded-lg border' id='username'onChange={changeHandler} />
        <input type='text' placeholder='email' className='p-3 rounded-lg border' id='email'onChange={changeHandler} />
        <input type='text' placeholder='password' className='p-3 rounded-lg border' id='password' onChange={changeHandler}/>
        <button disabled={loading} className='bg-black text-white rounded-lg p-3 hover:opacity-90 font-medium uppercase disabled:opacity-80'>
        {loading ? 'loading...' : 'Sign Up'} </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Already have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-700 underline'>sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-600 mt-5'>{error}</p>}
    </div>
  )
}
