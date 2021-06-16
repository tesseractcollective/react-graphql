import React, { useState, useEffect } from 'react';

export default function useWatchScoll(scrollComponentSelector:string){
  const [val, setVal] = useState();

  useEffect(() => {
    if(!scrollComponentSelector){
      return;
    }
    const scrollBar = document.querySelector(scrollComponentSelector);

    scrollBar?.addEventListener('scroll', (e)=> {
      console.log('🚀 ~ file: useWatchScoll.js ~ line 10 ~ scrollBar.on ~ e', scrollBar.scrollHeight, scrollBar.scrollTop, e);
      //TODO: 1) Update some sort of state and return the scroll bar %
      // Use that % in PaginatedTable to fire the next page query if the % > 95%
    })
  
    return () => {
      scrollBar?.removeEventListener('scroll', (e)=> {
        console.log('🚀 ~ file: useWatchScoll.js ~ line 10 ~ scrollBar.on ~ e', e);
      })
    }
  }, [scrollComponentSelector]);

  return val;
};  