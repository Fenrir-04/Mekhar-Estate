import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState('');

  const onChangeHandler = (e) => {
    setMessage(e.target.value);
  } 


  useEffect(() => { // fetch the landlord details
    const fetchLandlord = async () => {
      try{
        const res = await fetch(`/api/user/${listing.userRef}`);   
        const data = await res.json();
        setLandLord(data);
      }
      catch(err) {
        console.log(err);
      }
    }
    fetchLandlord(); // call the function
  }, [listing.userRef])

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>Contact <span className='font-semibold'>{landlord.username} </span>
          for <span className='font-semibold'>{listing.name.toLowerCase()}</span> </p>
          <textarea 
           placeholder = 'send you message here...'
           onChange={onChangeHandler}
           name='message' 
           rows='2'
           id='message' 
           value={message}
           className='w-full p-3 border border-slate-600 rounded-lg mt-2 ' 
          >
          </textarea>

          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
           className='w-full bg-purple-600 text-white p-3 rounded-lg text-center hover:opacity-95 uppercase'
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  )
}
