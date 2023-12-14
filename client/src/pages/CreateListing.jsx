import React from 'react'
export default function CreateListing() {
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
                <input className='border p-3 rounded w-full border-black' type="file" id="images" accept='image/*' multiple />
                <button className='uppercase text-green-300 bg-slate-700 border border-black rounded p-3 hover:shadow-lg disabled:opacity-90'>upload</button>
              </div>
              <button className='p-3 rounded-lg bg-purple-700 text-white uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>
           
        </form>
    </main>
  )
}
