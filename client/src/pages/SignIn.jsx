import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);
      setError(null);

      await axios.post(
        '/api/auth/signin',
        formData
      );

      setLoading(false);

      navigate('/');

    } catch (error) {

      setLoading(false);

      setError(
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign In
      </h1>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >


        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />

        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>

      </form>

      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>

        <Link to={'/signup'}>
          <span className='text-blue-700'>
            Sign up
          </span>
        </Link>
      </div>

      {error && (
        <p className='text-red-500 mt-5'>
          {error}
        </p>
      )}

    </div>
  );
};

export default SignIn;