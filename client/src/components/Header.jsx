import {FaSearch} from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';

export default function Header() {

  const {currentUser} = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page from refreshing by default
    const urlParams = new URLSearchParams(window.location.search); // get the current url query params
    urlParams.set('searchTerm', searchTerm); // set the searchTerm query param to the value of the input
    const searchQuery = urlParams.toString(); // convert the urlParams object to a query string
    navigate(`/search?${searchQuery}`); // navigate to the search page with the query string
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // get the current url query params
    const searchTermFromUrl = urlParams.get('searchTerm'); // get the value of the searchTerm query param

    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); // set the searchTerm state to the value of the query param
    }
  }, [location.search]); // run this effect whenever the location.search changes

  return (
    <header className='bg-slate-300 shadow-md'>
        <div className='flex justify-between items-center mx-auto max-w-6xl p-3'>
            <Link to='/'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-slate-500'>Real</span>
                    <span className='text-slate-600'>Estate</span>
                    <span className='text-slate-800'>Hub</span>
                </h1>
            </Link>
            <form onSubmit={handleSubmit} className='bg-slate-100 p-2 rounded-xl flex items-center'>
                <input type="text" placeholder='search..' className='bg-transparent
                focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button>
                    <FaSearch className='text-slate-600' />
                </button>
            </form>
            <ul className='flex gap-4 '>
                <Link to='/'>
                    <li className='hidden sm:inline text-slate-800 hover:underline'>Home</li>
                </Link>
                <Link to='/About'>
                    <li className='hidden sm:inline text-slate-800 hover:underline'>About</li>
                </Link>
                <Link to='/profile'>
                {currentUser ? (
                <img
                    className='rounded-full h-7 w-7 object-cover'
                    src={currentUser.avatar}
                    alt='profile'
                ></img>
                ) : (
                <li className=' text-slate-700 hover:underline'> Sign in</li>
                )}
            </Link>
            </ul>
        </div>
    </header>
  )
}
