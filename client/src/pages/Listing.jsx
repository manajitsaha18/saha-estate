import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import { useSelector } from 'react-redux';

import {
    FaBed,
    FaBath,
    FaChair,
    FaParking,
    FaMapMarkerAlt,
    FaHome,
} from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

const Listing = () => {
    const { listingId } = useParams();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [landlord, setLandlord] = useState(null);
    const [contact, setContact] = useState(false);
    const [message, setMessage] = useState('');

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);

                const res = await axios.get(
                    `/api/listing/get/${listingId}`
                );

                setListing(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(true);
                setLoading(false);
            }
        };

        fetchListing();
    }, [listingId]);

    useEffect(() => {
        const fetchLandlord = async () => {
            if (!listing) return;

            try {
                const res = await axios.get(
                    `/api/user/${listing.userRef}`
                );
                setLandlord(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        if (contact) {
            fetchLandlord();
        }
    }, [contact, listing]);
    if (loading) {
        return (
            <p className='text-center text-2xl my-10'>
                Loading...
            </p>
        );
    }

    if (error || !listing) {
        return (
            <p className='text-center text-red-700 text-2xl my-10'>
                Something went wrong!
            </p>
        );
    }



    return (
        <main>
            {/* Image Slider */}
            <Swiper
                navigation
                modules={[Navigation]}
            >
                {listing.imageUrls.map((url) => (
                    <SwiperSlide key={url}>
                        <img
                            src={url}
                            alt='listing'
                            className='w-full h-[550px] object-cover'
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Listing Details */}
            <div className='max-w-6xl mx-auto p-4 flex flex-col gap-5 my-7'>
                <h1 className='text-4xl font-bold text-slate-800'>
                    {listing.name}
                </h1>

                <div className='flex flex-wrap gap-3'>
                    <span className='bg-red-700 text-white px-4 py-1 rounded-full text-sm'>
                        {listing.type === 'rent'
                            ? 'For Rent'
                            : 'For Sale'}
                    </span>

                    {listing.offer && (
                        <span className='bg-green-700 text-white px-4 py-1 rounded-full text-sm'>
                            $
                            {listing.regularPrice -
                                listing.discountPrice}{' '}
                            OFF
                        </span>
                    )}
                </div>

                <p className='flex items-center gap-2 text-green-700 text-lg'>
                    <FaMapMarkerAlt />
                    {listing.address}
                </p>

                <p className='text-3xl font-bold text-slate-800'>
                    $
                    {listing.offer
                        ? listing.discountPrice
                        : listing.regularPrice}

                    {listing.type === 'rent' && (
                        <span className='text-lg text-slate-500 font-normal'>
                            {' '}
                            / month
                        </span>
                    )}
                </p>

                <p className='text-slate-700 leading-relaxed'>
                    <span className='font-semibold text-black'>
                        Description:
                    </span>{' '}
                    {listing.description}
                </p>

                <ul className='flex flex-wrap gap-6 text-green-700 font-semibold'>
                    <li className='flex items-center gap-2'>
                        <FaBed />
                        {listing.bedrooms}{' '}
                        {listing.bedrooms > 1
                            ? 'Beds'
                            : 'Bed'}
                    </li>

                    <li className='flex items-center gap-2'>
                        <FaBath />
                        {listing.bathrooms}{' '}
                        {listing.bathrooms > 1
                            ? 'Baths'
                            : 'Bath'}
                    </li>

                    <li className='flex items-center gap-2'>
                        <FaParking />
                        {listing.parking
                            ? 'Parking Available'
                            : 'No Parking'}
                    </li>

                    <li className='flex items-center gap-2'>
                        <FaChair />
                        {listing.furnished
                            ? 'Furnished'
                            : 'Not Furnished'}
                    </li>

                    <li className='flex items-center gap-2'>
                        <FaHome />
                        {listing.type === 'rent'
                            ? 'For Rent'
                            : 'For Sale'}
                    </li>
                </ul>
                {currentUser &&
                    listing.userRef !== currentUser._id &&
                    !contact && (
                        <button
                            onClick={() => setContact(true)}
                            className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                        >
                            Contact Landlord
                        </button>
                    )}
                {contact && landlord && (
                    <div className='flex flex-col gap-4'>
                        <p>
                            Contact{' '}
                            <span className='font-semibold'>
                                {landlord.username}
                            </span>{' '}
                            for{' '}
                            <span className='font-semibold'>
                                {listing.name.toLowerCase()}
                            </span>
                        </p>

                        <textarea
                            className='w-full border p-3 rounded-lg'
                            placeholder='Enter your message here...'
                            rows='4'
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                        />

                        <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${landlord.email}&su=${encodeURIComponent(
                                `Regarding ${listing.name}`
                            )}&body=${encodeURIComponent(message)}`}
                            target="_blank"
                            rel="noreferrer"
                            className='bg-slate-700 text-white text-center p-3 rounded-lg uppercase'
                        >
                            Send Message
                        </a>
                    </div>
                )}
            </div>

        </main>
    );
};

export default Listing;