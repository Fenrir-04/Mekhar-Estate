import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';

export default function SignIn() {

  const [formData, setFormData] = useState({});
  const { error, loading } = useSelector((state) => state.user); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeHandler = (e) => {
    setFormData({
      ...formData, // to retain the previous written, such that it doesn;t get lost after moving to next column
      [e.target.id]: e.target.value, // put the value directly using the id, given at the time of form creation
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try{
      dispatch(signInStart()); // used redux slice function to start the user sign
      const res = await fetch('/api/auth/signin', { // fetch the data from the signupm form and post it directly from browser
        method: 'POST', 
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // convert the above string data to json format
      console.log(data);

      if(data.success === false){ // Error handling
        dispatch(signInFailure(data.message)); // used redux to display user sign in failed
        return;
      }
      dispatch(signInSuccess(data)); // used redux to diaplay if sign in succeded
      navigate('/');
    }
    catch(err){
      dispatch(signInFailure(err.message)); // used redux if there was any error
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-3'>
        <input type='text' placeholder='email' className='p-3 rounded-lg border' id='email'onChange={changeHandler} />
        <input type='text' placeholder='password' className='p-3 rounded-lg border' id='password' onChange={changeHandler}/>
        <button disabled={loading} className='bg-red-600 text-white rounded-lg p-3 hover:opacity-90 font-medium uppercase disabled:opacity-80'>
        {loading ? 'loading...' : 'Sign In'} </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>new user?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700 underline'>create account</span>
        </Link>
      </div>
      {error && <p className='text-red-600 mt-5'>{error}</p>}
    </div>
  )
}
