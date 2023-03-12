import React, { useContext, useState } from 'react';
import Toggler from './components/Toggler';
import Search from './components/Search';
import CurrentWeather from './components/CurrentWeather';
import { ThemeContext } from '@emotion/react';


function App() {

  return (
      <div className="bg-[#adecff]  text-slate-500 h-screen dark:bg-[rgb(16,27,70)] dark:text-white">
        <div className='mx-auto max-w-xl px-4 py-10'>
          <div className='flex justify-between items-center'>
            <h1 className="text-2xl text-slate-500  dark:text-slate-400 font-extrabold">Weather</h1>
            <Toggler />
          </div>
          <Search />
          <CurrentWeather />
        </div>
      </div>
  );
}

export default App;
