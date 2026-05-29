import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Profile = () => {
  const fileRef = useRef(null);

  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});

  const [uploadStatus, setUploadStatus] = useState('');

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

    console.log(formData);

    // Update User API will be added later
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
          onClick={() => fileRef.current.click()}
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
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95'
        >
          Update
        </button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>
          Delete Account
        </span>

        <span className='text-red-700 cursor-pointer'>
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default Profile;