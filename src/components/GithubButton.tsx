'use client';
import { useEffect, useState } from 'react';
import githubIcon from '../public/githubIcon.svg';

const GitHubButton = () => {
  const [stars, setStarCount] = useState<number | null>(null);
  const repoUrl = `https://github.com/justinbenito/notime.lol`;

  useEffect(() => {
    fetchStars();
  }, []);

  const fetchStars = async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/justinbenito/notime.lol`);
      if (!response.ok) {
        throw new Error('Failed to fetch repository data');
      }
      const data = await response.json();
      setStarCount(data.stargazers_count);
    } catch (error) {
      console.error('Error fetching star count:', error);
    }
  };

  return (
    <a
      href={repoUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex border hover:bg-white/10 border-white items-center rounded-md px-4 py-2 text-white shadow transition duration-400 ease-in-out'
      aria-label={`Star the notime.lol project on GitHub (${stars !== null ? `${stars} stars` : 'loading star count'})`}
    >
      <img src={githubIcon} alt='Github star icon' className='mr-2 h-6 w-6 fill-white text-white' />
      <span className='hidden text-sm font-medium sm:inline'>
        {stars !== null ? `Contribute ${stars} ⭐` : 'Loading...'}
      </span>
      <span className='text-sm font-medium sm:hidden'>
        {stars !== null ? `${stars} ⭐` : 'Loading...'}
      </span>
    </a>
  );
};

export default GitHubButton;