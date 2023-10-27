import {FaSearch} from 'react-icons/fa';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-slate-300 shadow-md'>
        <div className='flex justify-between items-center mx-auto max-w-6xl p-3'>
            <Link to='/'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-slate-500'>Monolith</span>
                    <span className='text-slate-800'>Estate</span>
                </h1>
            </Link>
            <form className='bg-slate-100 p-2 rounded-xl flex items-center'>
                <input type="text" placeholder='search..' className='bg-transparent
                focus:outline-none w-24 sm:w-64' />
                <FaSearch className='text-slate-600' />
            </form>
            <ul className='flex gap-4 '>
                <Link to='/'>
                    <li className='hidden sm:inline text-slate-800 hover:underline'>Home</li>
                </Link>
                <Link to='/About'>
                    <li className='hidden sm:inline text-slate-800 hover:underline'>About</li>
                </Link>
                <Link to='/sign-in'>
                    <li className='text-slate-800 hover:underline'>Sign in</li>
                </Link>
            </ul>
        </div>
    </header>
  )
}
