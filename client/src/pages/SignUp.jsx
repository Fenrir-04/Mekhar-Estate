import React from 'react'
import {Link} from 'react-router-dom';

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-3'>
        <input type='text' placeholder='username' className='p-3 rounded-lg border' id='username' />
        <input type='text' placeholder='email' className='p-3 rounded-lg border' id='email' />
        <input type='text' placeholder='password' className='p-3 rounded-lg border' id='password' />
        <button className='bg-red-700 text-white rounded-lg p-3 hover:opacity-90 font-medium uppercase disabled:opacity-80'>Sign up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Already have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-700'>sign in</span>
        </Link>
      </div>
    </div>
  )
}
