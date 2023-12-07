import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined); // for the pics, at start it's empty
  const [filePerc, setFilePerc] = useState(0); // to display the pefcentage of image uploaded on screen, inigtially it's 0
  const [fileUploadError, setFileUploadError] = useState(false); // to get the error while file uploading
  const [formData, setFormData] = useState({}); // to upload the data in profile section
  const [updateSuccess, setUpdateSuccess] = useState(false);
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
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },

    (error) => {
      setFileUploadError(true);
    },

    () => {
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
  }

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
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-white bg-red-600 rounded-xl p-1 cursor-pointer hover:opacity-95 disabled:opacity-80'>Delete Account</span>
        <span className='text-white bg-red-600 rounded-xl p-1 cursor-pointer hover:opacity-95 disabled:opacity-80'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{ error ? error : ''}</p>
      <p className='text-green-600'>{updateSuccess ? 'Update was successfull!!' : ''}</p>
    </div>
  )
}
