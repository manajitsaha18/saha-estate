import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);

        urlParams.set('searchTerm', searchTerm);

        navigate(`/search?${urlParams.toString()}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, []);

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500'>Saha</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </Link>

                <form
                    onSubmit={handleSubmit}
                    className='bg-slate-100 p-3 rounded-lg flex items-center'
                >
                    <input
                        type='text'
                        placeholder='Search...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button type='submit'>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>

                <nav>
                    <ul className='flex gap-4'>
                        <li>
                            <Link to='/' className='hidden sm:inline text-slate-700 hover:underline'> Home </Link>
                        </li>

                        <li>
                            <Link to='/about' className='hidden sm:inline text-slate-700 hover:underline'> About </Link>
                        </li>

                        <li>
                            {currentUser ? (
                                <Link to='/profile' className='text-slate-700 hover:underline'>
                                    <img src={currentUser.avatar} alt='Profile' className='w-8 h-8 rounded-full object-cover' />
                                </Link>
                            ) : (
                                <Link to='/signin' className='text-slate-700 hover:underline'>
                                    Sign In
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>

            </div>
        </header>
    );
}

export default Header;