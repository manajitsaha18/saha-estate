import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

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
            className={`text-sm text-center ${
              uploadStatus.includes('successfully')
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
    </div>
  );
};

export default Profile;