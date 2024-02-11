import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle'; // import Swiper bundle style

export default function Listing() {

  SwiperCore.use([Navigation]); // use the navigation module
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try{
        const res = await fetch(`/api/listing/get/${params.listingId}`); // get the data from the listing id
        const data = await res.json(); // convert the data to json format

        if(data.success === false) { // if the data is not fetched
          setError(true); 
          setLoading(false); 
          return;
        }

        // if the data is successfully fetched
        setListing(data); // set the data to the listing
        setLoading(false); // set the loading to false
        setError(false); // set the error to false
      }
      catch(err){
        setError(true);
        setLoading(false);
      }
    }
    fetchListings(); // call the function
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )
      }
    </main>
  )
}
