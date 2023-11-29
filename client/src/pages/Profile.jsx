import React from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {

  const { currentUser} = useSelector((state) => state.user);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt='profile'
        className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <input type='text' placeholder='Username'
        className='border p-3 rounded-lg' id='username' />
        <input type='email' placeholder='Email'
        className='border p-3 rounded-lg' id='email' />
        <input type='text' placeholder='Password'
        className='border p-3 rounded-lg' id='password' />
        <button className='rounded-lg p-3 bg-blue-700 text-white uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-500 bg-black rounded-xl p-1 cursor-pointer hover:opacity-95 disabled:opacity-80'>Delete Account</span>
        <span className='text-red-500 bg-black rounded-xl p-1 cursor-pointer hover:opacity-95 disabled:opacity-80'>Sign Out</span>
      </div>
    </div>
  )
}
