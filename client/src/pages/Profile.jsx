import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const {
    currentUser,
    loading,
    error,
  } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploadStatus, setUploadStatus] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] =
    useState(false);

  const handleImageUpload = async (file) => {
    try {
      setUploadStatus('Uploading image...');

      const data = new FormData();
      data.append('image', file);

      const res = await axios.post(
        '/api/upload',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      setFormData((prev) => ({
        ...prev,
        avatar: res.data.url,
      }));

      setUploadStatus('Image uploaded successfully!');
    } catch (error) {
      console.log(error);
      setUploadStatus('Image upload failed!');
    }
  };

  useEffect(() => {
    if (file) {
      handleImageUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdateSuccess(false);

      dispatch(updateUserStart());

      const res = await axios.put(
        `/api/user/update/${currentUser._id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(updateUserSuccess(res.data));

      setUpdateSuccess(true);

    } catch (error) {
      dispatch(
        updateUserFailure(
          error.response?.data?.message ||
          error.message
        )
      );
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      await axios.delete(
        `/api/user/delete/${currentUser._id}`,
        {
          withCredentials: true,
        }
      );

      dispatch(deleteUserSuccess());

    } catch (error) {
      dispatch(
        deleteUserFailure(
          error.response?.data?.message ||
          error.message
        )
      );
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      await axios.get(
        '/api/auth/signout',
        {
          withCredentials: true,
        }
      );

      dispatch(signOutUserSuccess());

    } catch (error) {
      dispatch(
        signOutUserFailure(
          error.response?.data?.message ||
          error.message
        )
      );
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await axios.get(
        `/api/user/listings/${currentUser._id}`,
        {
          withCredentials: true,
        }
      );

      setUserListings(res.data);

    } catch (error) {
      setShowListingsError(true);
      console.log(error);
    }
  };




  const handleListingDelete = async (
    listingId
  ) => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this listing?'
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `/api/listing/delete/${listingId}`,
        {
          withCredentials: true,
        }
      );

      setUserListings((prev) =>
        prev.filter(
          (listing) =>
            listing._id !== listingId
        )
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <input
          type='file'
          hidden
          accept='image/*'
          ref={fileRef}
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <img
          onClick={() =>
            fileRef.current.click()
          }
          src={
            formData.avatar ||
            currentUser.avatar
          }
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        {uploadStatus && (
          <p
            className={`text-sm text-center ${uploadStatus.includes('successfully')
              ? 'text-green-600'
              : uploadStatus.includes('failed')
                ? 'text-red-600'
                : 'text-slate-600'
              }`}
          >
            {uploadStatus}
          </p>
        )}

        <input
          type='text'
          placeholder='Username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='email'
          placeholder='Email'
          defaultValue={currentUser.email}
          id='email'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='password'
          placeholder='Password'
          id='password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link to={"/createlisting"} className='text-center bg-green-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
          Create Listing
        </Link>
      </form>

      {error && (
        <p className='text-red-500 mt-5'>
          {error}
        </p>
      )}

      {updateSuccess && (
        <p className='text-green-500 mt-5'>
          User updated successfully!
        </p>
      )}

      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete Account
        </span>

        <span
          onClick={handleSignOut}
          className='text-red-700 cursor-pointer'
        >
          Sign Out
        </span>
      </div>
      <button
        onClick={handleShowListings}
        className='text-green-700 w-full text-center'
      >
        Show Listings
      </button>
      {showListingsError && (
        <p className='text-red-700 mt-5'>
          Error showing listings
        </p>
      )}

      {userListings &&
        userListings.length > 0 && (
          <div className='flex flex-col gap-4 mt-5'>
            <h1 className='text-center text-2xl font-semibold'>
              Your Listings
            </h1>

            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border rounded-lg p-3 flex justify-between items-center gap-4'
              >
                <Link
                  to={`/listing/${listing._id}`}
                  className='flex items-center gap-4 flex-1'
                >
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing'
                    className='h-16 w-16 object-cover rounded'
                  />

                  <p className='font-semibold truncate hover:underline'>
                    {listing.name}
                  </p>
                </Link>

                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={() =>
                      handleListingDelete(listing._id)
                    }
                    className='text-red-700 uppercase'
                  >
                    Delete
                  </button>

                  <Link
                    to={`/updatelisting/${listing._id}`}
                    className='text-green-700 uppercase'
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default Profile;