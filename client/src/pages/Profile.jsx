import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { 
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess } from '../redux/user/userSlice';

import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined); // for the pics, at start it's empty
  const [filePerc, setFilePerc] = useState(0); // to display the pefcentage of image uploaded on screen, inigtially it's 0
  const [fileUploadError, setFileUploadError] = useState(false); // to get the error while file uploading
  const [formData, setFormData] = useState({}); // to upload the data in profile section
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();

  // console.log(formData); 
  // console.log(filePerc);
  // console.log(file);
  // console.log(fileUploadError);

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app); // the same app to start the firebase server in the firebase.js
    const fileName = new Date().getTime() + file.name; // date is added to get the unique name and avoid same name for two files
    const storageRef = ref(storage, fileName); // reference to the storage in firebase
    const uploadTask = uploadBytesResumable(storageRef, file); // to upload the file in the storage

    uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // to get the percentage of file uploaded
      setFilePerc(Math.round(progress)); // set the percentage of file uploaded
    },

    (error) => {
      setFileUploadError(true);
    },

    () => { // when the file is uploaded successfully
      getDownloadURL(uploadTask.snapshot.ref)
      .then((downloadURL) => {
        setFormData({...formData, avatar: downloadURL});
      });
    }
    );
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value}); // update the changed data in form, and retain the rest data as it is    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart()); // start the updation process using redux dispatch
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // convert the form data in string format and send it in body of request
      });

      const data = await res.json(); // josnify the data recieved 

      if (data.success === false) {
        dispatch(updateUserFailure(data.message)); // if request failed, send the error
        return; // ans return without furthur process
      }

      dispatch(updateUserSuccess(data)); // if request is successfull, then update the data using redux disptch
                                         // which will take it to the verifyUser and updateUser function for furthur process
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message)); // sedn the error thru redux dispatch
    }
  };

  const handleDeleteUser = async () => {
    try{
      dispatch(deleteUserStart()); // start the deletion process using redux dispatch
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { // get the data after doing delete command
        method: 'DELETE',
      });

      const data = await res.json(); // jsonify the data recieved
      
      if(data.success === false){ // if data recieved is negative, send the errror message recieved
        dispatch(deleteUserFailure(data.message)); // send error msg thru redux
        return; // and return
      }

      dispatch(deleteUserSuccess(data)); // if deletion is successful, then pass the data to redux
    }
    catch(err){
      dispatch(deleteUserFailure(err.message)); // if error encountered, then send it to screen using redux
    }
  };

  const handleSignOutUser  = async () => {
    try{
      dispatch(signOutUserStart()); // start the signout process using redux
      const res = await fetch('api/auth/signout');
      const data = res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message)); // send the error in response thru redux
        return;
      }

      dispatch(signOutUserSuccess(data)); // if no error, then report the success of signout process thru redux
    }
    catch(err){
      dispatch(signOutUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try{
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    }
    catch(error){
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try{
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });

      const data = res.json();

      if(data.success === false){
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    }
    catch(error){
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} // set the recieved image as the new image in setFile
         type='file' 
         ref={fileRef} // helps to keep the image same and avoid re-render of site
         hidden // hide it in screeen
         accept='image/*' // accepts only image type file
        />

        <img onClick={() => fileRef.current.click()}
         src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        <p className='text-sm self-center'>
          {
            fileUploadError ? 
            (<span className='text-red-600'>Error Image Upload</span>) :
              (filePerc > 0 && filePerc < 100) ?
              (<span className='text-slate-700'>{`uploading ${filePerc}%`}</span>) :
              (filePerc === 100) ?
                (<span className='text-green-600'>Image uploaded successfully!</span>)
                : ""
            

          }
        </p>

        <input type='text' placeholder='username'
        defaultValue={currentUser.username}
        className='border p-3 rounded-lg' id='username' onChange={handleChange} />

        <input type='email' placeholder='Email'
        defaultValue={currentUser.email}
        className='border p-3 rounded-lg' id='email' onChange={handleChange} />

        <input type='password' placeholder='Password'
        className='border p-3 rounded-lg' id='password' onChange={handleChange} />

        <button disabled={loading} className='rounded-lg p-3 bg-blue-700 text-white uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'loading...' : 'update'}
        </button>
        <Link className='bg-green-700 text-white p-3 uppercase rounded-lg text-center hover:opacity-95'
        to={'/create-listing'}>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-white bg-red-600 rounded-xl p-1 cursor-pointer hover:opacity-95 disabled:opacity-80'>Delete Account</span>
        <span onClick={handleSignOutUser} className='text-white bg-red-600 rounded-xl p-1 cursor-pointer hover:opacity-95 disabled:opacity-80'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{ error ? error : ''}</p>
      <p className='text-green-700'>{updateSuccess ? 'Update was successfull!!' : ''}</p>

      <button onClick={handleShowListings} className='text-blue-700 w-full'>Show Listings</button>
      <p className='text-red-600 mt-5'>{showListingsError ? 'Error showing the listings...' : ''}</p>

      {/* {userListings && userListings.length > 0 && 
      userListings.map((listing) => (
        <div key={listing._id}>
          <link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt='image listing' />
          </link>
        </div>
      ))
      } */}

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
