import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch(); // get the dispatch from redux 
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider(); // initialize the new google auth
      const auth = getAuth(app); // start the firebase server auth

      const result = await signInWithPopup(auth, provider); // make a sign in pop up for google acc

      const res = await fetch('/api/auth/google', { // make a req to backend with post requrst
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName, // take name, email and photo of user from the user's google account
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json(); // make the data in a json format
      dispatch(signInSuccess(data)); // use redux dispatch to display the data on screen/frontend
      navigate('/'); // after  sigin is successful, got to home page
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };

  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-600 text-white p-3 rounded-lg uppercase
    hover: opacity-95'>Sign in with Google</button> // button type is button cause it is in form, and we don't want it to submit the form 
  )
}
