import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ListingItem from '../components/ListingItem';
import axios from 'axios';

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);


  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await axios.get('/api/listing/get?offer=true&limit=4');
        setOfferListings(res.data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await axios.get('/api/listing/get?type=rent&limit=4');
        setRentListings(res.data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await axios.get('/api/listing/get?type=sale&limit=4');
        setSaleListings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Saha Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper
        modules={[Navigation]}
        navigation
      >
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[375px] md:h-[430px]'

              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}

      <div className='max-w-7xl mx-auto px-20 py-10 flex flex-col gap-12'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-3xl font-bold text-slate-800'>Recent offers</h2>
              <Link className='text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-3xl font-bold text-slate-800'>Recent places for rent</h2>
              <Link className='text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline' to={'/search?type=rent'}>
                Show more places for rent
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-3xl font-bold text-slate-800'>Recent places for sale</h2>
              <Link className='text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline' to={'/search?type=sale'}>
                Show more places for sale
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;