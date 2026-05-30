import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
    const { currentUser } = useSelector(
        (state) => state.user
    );
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);

    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        parking: false,
        furnished: false,
        offer: false,
    });

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageUploadError, setImageUploadError] =
        useState('');
    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (
            e.target.type === 'text' ||
            e.target.tagName === 'TEXTAREA'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }

        if (e.target.type === 'number') {
            setFormData({
                ...formData,
                [e.target.id]: Number(e.target.value),
            });
        }
    };
    const handleImageSubmit = async () => {
        console.log('Upload button clicked');
        console.log(files);
        try {
            if (files.length === 0) {
                setImageUploadError('Please select at least one image');
                return;
            }

            if (files.length + formData.imageUrls.length > 6) {
                setImageUploadError(
                    'You can upload a maximum of 6 images'
                );
                return;
            }

            setUploading(true);
            setImageUploadError('');

            const uploadPromises = [];

            for (let i = 0; i < files.length; i++) {
                const data = new FormData();
                data.append('image', files[i]);

                uploadPromises.push(
                    axios.post('/api/upload', data, {
                        headers: {
                            'Content-Type':
                                'multipart/form-data',
                        },
                        withCredentials: true,
                    })
                );
            }

            console.log(uploadPromises);

            const results = await Promise.all(
                uploadPromises
            );

            console.log(results);
            const urls = results.map(
                (res) => res.data.url
            );

            console.log(urls);
            setFormData({
                ...formData,
                imageUrls: [
                    ...formData.imageUrls,
                    ...urls,
                ],
            });

            setUploading(false);
        } catch (error) {
            setUploading(false);
            setImageUploadError(
                'Image upload failed'
            );
            console.log(error);
        }
    };
    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter(
                (_, i) => i !== index
            ),
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');

            if (formData.imageUrls.length < 1) {
                setError(
                    'You must upload at least one image'
                );
                setLoading(false);
                return;
            }

            if (
                Number(formData.discountPrice) >
                Number(formData.regularPrice)
            ) {
                setError(
                    'Discount price must be lower than regular price'
                );
                setLoading(false);
                return;
            }

            const res = await axios.post(
                '/api/listing/create',
                {
                    ...formData,
                    userRef: currentUser._id,
                },
                {
                    withCredentials: true,
                }
            );

            setLoading(false);
            navigate(`/listing/${res.data._id}`);


        } catch (error) {
            setLoading(false);

            setError(
                error.response?.data?.message ||
                'Something went wrong'
            );
        }
    };
    return (
        <main className='max-w-6xl mx-auto p-6'>
            <div className=' rounded-2xl p-6 sm:p-8'>
                <h1 className='text-4xl font-bold text-center text-slate-800 mb-8'>
                    Create Listing
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className='flex flex-col sm:flex-row gap-8'
                >
                    {/* Left Side */}
                    <div className='flex flex-col gap-5 flex-1'>
                        <input
                            type='text'
                            placeholder='Property Name'
                            className='w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500'
                            id='name'
                            maxLength='62'
                            minLength='10'
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <textarea
                            placeholder='Description'
                            className='w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500'
                            id='description'
                            rows='5'
                            required
                            value={formData.description}
                            onChange={handleChange}
                        />

                        <input
                            type='text'
                            placeholder='Address'
                            className='w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500'
                            id='address'
                            required
                            value={formData.address}
                            onChange={handleChange}
                        />

                        {/* Property Features */}
                        <div className='border border-gray-300 p-4 rounded-xl'>
                            <h2 className='font-semibold text-slate-700 mb-3'>
                                Property Features
                            </h2>

                            <div className='flex flex-wrap gap-6'>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        id='sale'
                                        className='w-5 h-5'
                                        onChange={handleChange}
                                        checked={formData.type === 'sale'}
                                    />
                                    <span>Sell</span>
                                </label>

                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        id='rent'
                                        className='w-5 h-5'
                                        onChange={handleChange}
                                        checked={formData.type === 'rent'}
                                    />
                                    <span>Rent</span>
                                </label>

                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        id='parking'
                                        className='w-5 h-5'
                                        onChange={handleChange}
                                        checked={formData.parking}
                                    />

                                    <span>Parking</span>
                                </label>

                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        id='furnished'
                                        className='w-5 h-5'
                                        onChange={handleChange}
                                        checked={formData.furnished}
                                    />
                                    <span>Furnished</span>
                                </label>

                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        id='offer'
                                        className='w-5 h-5'
                                        onChange={handleChange}
                                        checked={formData.offer}
                                    />
                                    <span>Offer</span>
                                </label>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className='border border-gray-300 p-4 rounded-xl'>
                            <h2 className='font-semibold text-slate-700 mb-3'>
                                Property Details
                            </h2>

                            <div className='flex flex-wrap gap-5'>
                                <div className='flex items-center gap-2'>
                                    <input
                                        type='number'
                                        id='bedrooms'
                                        min='1'
                                        max='10'
                                        required
                                        className='w-24 p-3 border border-gray-300 rounded-xl text-center'
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                    />
                                    <span>Beds</span>
                                </div>

                                <div className='flex items-center gap-2'>
                                    <input
                                        type='number'
                                        id='bathrooms'
                                        min='1'
                                        max='10'
                                        required
                                        className='w-24 p-3 border border-gray-300 rounded-xl text-center'
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                    />
                                    <span>Baths</span>
                                </div>

                                <div className='flex items-center gap-2'>
                                    <input
                                        type='number'
                                        id='regularPrice'
                                        min='50'
                                        max='10000000'
                                        required
                                        className='w-32 p-3 border border-gray-300 rounded-xl text-center'
                                        value={formData.regularPrice}
                                        onChange={handleChange}
                                    />
                                    <div className='flex flex-col'>
                                        <span>Regular Price</span>
                                        <span className='text-xs text-gray-500'>
                                            ($ / month)
                                        </span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-2'>
                                    <input
                                        type='number'
                                        id='discountPrice'
                                        min='0'
                                        max='10000000'
                                        required
                                        className='w-32 p-3 border border-gray-300 rounded-xl text-center'
                                        value={formData.discountPrice}
                                        onChange={handleChange}
                                    />
                                    <div className='flex flex-col'>
                                        <span>Discount Price</span>
                                        <span className='text-xs text-gray-500'>
                                            ($ / month)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className='flex flex-col flex-1 gap-5'>
                        <div className='border border-gray-300 rounded-2xl p-5'>
                            <p className='font-semibold text-slate-700 mb-4'>
                                Images
                                <span className='font-normal text-gray-500 ml-2'>
                                    (First image will be the cover, max 6)
                                </span>
                            </p>

                            <div className='flex gap-3'>
                                <input
                                    className='p-3 border border-gray-300 rounded-xl w-full'
                                    type='file'
                                    id='images'
                                    accept='image/*'
                                    multiple
                                    onChange={(e) => setFiles(e.target.files)}
                                />

                                <button
                                    type='button'
                                    onClick={handleImageSubmit}
                                    disabled={uploading}
                                    className='px-5 py-3 text-green-700 border border-green-700 rounded-xl uppercase font-medium hover:bg-green-700 hover:text-white transition'
                                >
                                    {uploading ? 'Uploading...' : 'Upload'}


                                </button>
                            </div>
                        </div>

                        {imageUploadError && (
                            <p className='text-red-700 text-sm'>
                                {imageUploadError}
                            </p>
                        )}

                        {formData.imageUrls.map((url, index) => (
                            <div
                                key={url}
                                className='flex justify-between items-center p-3 border rounded-lg'
                            >
                                <img
                                    src={url}
                                    alt='listing'
                                    className='w-20 h-20 object-cover rounded-lg'
                                />

                                <button
                                    type='button'
                                    className='text-red-700 uppercase'
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}

                        {error && (
                            <p className='text-red-700 text-center'>
                                {error}
                            </p>
                        )}
                        <button
                            type='submit'
                            disabled={loading || uploading}
                            className='w-full p-4 bg-slate-800 text-white rounded-xl uppercase font-semibold tracking-wide hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {
                                uploading
                                    ? 'Wait For Image Upload...'
                                    : loading
                                        ? 'Creating...'
                                        : 'Create Listing'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default CreateListing;