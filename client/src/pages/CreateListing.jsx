import React from 'react';

const CreateListing = () => {
  return (
    <main className='max-w-6xl mx-auto p-6'>
      <div className=' rounded-2xl p-6 sm:p-8'>
        <h1 className='text-4xl font-bold text-center text-slate-800 mb-8'>
          Create Listing
        </h1>

        <form className='flex flex-col sm:flex-row gap-8'>
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
            />

            <textarea
              placeholder='Description'
              className='w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500'
              id='description'
              rows='5'
              required
            />

            <input
              type='text'
              placeholder='Address'
              className='w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500'
              id='address'
              required
            />

            {/* Property Features */}
            <div className='border border-gray-300 p-4 rounded-xl'>
              <h2 className='font-semibold text-slate-700 mb-3'>
                Property Features
              </h2>

              <div className='flex flex-wrap gap-6'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type='checkbox' id='sale' className='w-5 h-5' />
                  <span>Sell</span>
                </label>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type='checkbox' id='rent' className='w-5 h-5' />
                  <span>Rent</span>
                </label>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type='checkbox' id='parking' className='w-5 h-5' />
                  <span>Parking</span>
                </label>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type='checkbox' id='furnished' className='w-5 h-5' />
                  <span>Furnished</span>
                </label>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type='checkbox' id='offer' className='w-5 h-5' />
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
            <div className='border-2 border-dashed border-gray-300 rounded-2xl p-5'>
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
                />

                <button
                  type='button'
                  className='px-5 py-3 text-green-700 border border-green-700 rounded-xl uppercase font-medium hover:bg-green-700 hover:text-white transition'
                >
                  Upload
                </button>
              </div>
            </div>

            <button
              className='w-full p-4 bg-slate-800 text-white rounded-xl uppercase font-semibold tracking-wide hover:bg-slate-900 transition'
            >
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateListing;