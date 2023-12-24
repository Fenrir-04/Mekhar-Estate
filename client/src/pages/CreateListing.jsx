import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {app} from '../firebase';

export default function CreateListing() {

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log(formData);
  
  const handleImageSubmit = (e) => {
    if(files.length > 0 && files.length + formData.imageUrls.length < 7){
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for(let i=0;i<files.length;i++){
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises).then((Urls) => {
        setFormData({
          ...formData,  // save the previous data
          imageUrls: formData.imageUrls.concat(Urls) // get the image data as they come and add it to previous images
        });
        setImageUploadError(false);
        setUploading(false);
      }).catch((err) => {
        setImageUploadError('Image failed miserably bitch! ( file should be < 2 MB)');
        setUploading(false);
      })
    }
    else{
      setImageUploadError('Hey bitch! You can only upload upto 6 images');
      setUploading(false);
    }
  };

  const storeImage = async (file) =>{
    return new Promise((resolve, reject) => { // create a new promise to store the images being uploaded
      const storage = getStorage(app); // get the storage form the firebase
      const fileName = new Date().getTime() + file.name; // give the image file a new unique name
      const storageRef = ref(storage, fileName); // give storage a ref thru firebase
      const uploadTask = uploadBytesResumable(storageRef, file); // now begin to upload
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`progress is ${progress}% done`);
        },
        (error) => reject(error), // if there is an error, then rejectg the process
        () => { // if successful, then resolve the process
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
        }
      );
    })
  };

  const handleDeleteImages = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_,i) => i !== index)
    });
  };  

  return (
    <main className='max-w-4xl max-auto p-3 mx-auto'>
        <h1 className='font-semibold text-2xl text-center my-8'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-6'>
          
          {/* for the left part of the listing page */}
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder='Name' id='name' className='border p-3 rounded-lg' maxLength='62' minLength='10' required />
                <textarea type="text" placeholder='Description' id='description' className='border p-3 rounded-lg' required />
                <input type="text" placeholder='Address' id='address' className='border p-3 rounded-lg' required />
                <div className='flex gap-6 flex-wrap'>
                  <div className='flex gap-2'>
                    <input type="checkbox" id='sale' className='w-5' />
                    <span>Sell</span>
                  </div>
                  <div className='flex gap-2'>
                    <input type="checkbox" id='Rent' className='w-5' />
                    <span>Rent</span>
                  </div>
                  <div className='flex gap-2'>
                    <input type="checkbox" id='parking' className='w-5' />
                    <span>Parking spot</span>
                  </div>
                  <div className='flex gap-2'>
                    <input type="checkbox" id='furnished' className='w-5' />
                    <span>Furnished</span>
                  </div>
                  <div className='flex gap-2'>
                    <input type="checkbox" id='offer' className='w-5' />
                    <span>Offer</span>
                  </div>
                </div>
                
                <div className='flex flex-wrap gap-6'>
                  <div className='flex gap-2 items-center'>
                    <input className='p-3 rounded-lg border border-gray-400' type="number" id='bedrooms' min='1' max='10' required />
                    <p>Beds</p>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <input className='p-3 rounded-lg border border-gray-400' type="number" id='bathrooms' min='1' max='10' required />
                    <p>Baths</p>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <input className='p-3 rounded-lg border border-gray-400' type="number" id='regularPrice' min='1' max='10' required />
                    <div className='flex flex-col items-center'>
                      <p>Regular price</p>
                      <span className='text-xs'>($ / month)</span>
                    </div>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <input className='p-3 rounded-lg border border-gray-400' type="number" id='discountPrice' min='1' max='10' required />
                    <div className='flex flex-col items-center'>
                      <p>Discounted price</p>
                      <span className='text-xs'>($ / month)</span>
                    </div>
                  </div>
                </div>
            </div>

          {/* for the right part of the listing page */}
            <div className='flex flex-col flex-1 gap-4'>
              <p className='font-semibold'>Images: 
                <span className='font-normal text-gray-600'>The first image will be the cover (max 6 allowed)</span>
              </p>
              <div className='flex gap-4'>
                <input onChange={(e) => setFiles(e.target.files)} className='border p-3 rounded w-full border-black' type="file" id="images" accept='image/*' multiple />
                <button disabled={uploading} type='button' onClick={handleImageSubmit} className='uppercase text-green-300 bg-slate-700 border border-black rounded p-3 hover:shadow-lg disabled:opacity-90 hover:text-white hover:bg-purple-700'>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              <p className='text-red-700 text-sm'>{ imageUploadError && imageUploadError }</p>
              {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                  <div key={url} className='flex justify-between border rounded-lg p-3 items-center'>
                    <img src={url} alt='image-listing' className='w-20 h-20 object-contain rounded-lg' />
                    <button type='button' onClick={() => handleDeleteImages(index)} className='text-red-600 p-3 rounded-lg uppercase hover:opacity-75 hover:text-black'>Delete</button>
                  </div>
                ))
              }
              <button className='p-3 rounded-lg bg-purple-700 text-white uppercase hover:opacity-95 disabled:opacity-80 hover:text-green-500 hover:bg-slate-800'>Create Listing</button>
            </div>
           
        </form>
    </main>
  )
}
