import React, { useState, useEffect } from 'react';

export default function useWatchScroll(scrollComponentSelector:string):{positionY: number, prevPosY: number, reComputeHeight: ()=>number}{
  const [prevVal, setPrevVal] = useState<number>(0);
  const [val, setVal] = useState<number>(0);

  useEffect(() => {
    if(!scrollComponentSelector){
      return;
    }
    const scrollBar = document.querySelector(scrollComponentSelector);

    const scrollWatchCallback = function(e: Event): void {
      if (scrollBar?.scrollHeight && scrollBar?.scrollTop) {
        const nextVal = +(scrollBar.scrollTop / (scrollBar.scrollHeight - (scrollBar as any).offsetHeight)).toFixed(2);
        setVal(nextVal);
      }
    };
    scrollBar?.addEventListener('scroll', scrollWatchCallback)
  
    return () => {
      scrollBar?.removeEventListener('scroll', scrollWatchCallback)
    }
  }, [scrollComponentSelector]);

  function reComputeHeight(): number {
    if(!scrollComponentSelector){
      return -1;
    }
    const scrollBar = document.querySelector(scrollComponentSelector);
    if (scrollBar?.scrollHeight && scrollBar?.scrollTop) {
      const nextVal = +(scrollBar.scrollTop / (scrollBar.scrollHeight - (scrollBar as any).offsetHeight)).toFixed(2);
      setPrevVal(val);
      setVal(nextVal);
      return nextVal;
    }
    return -1;
  };

  useEffect(() => {
    if(val !== prevVal){
      //We want this delayed by one so the variables have time to propogate before indicating a move
      setPrevVal(val);
    }
  }, [val, prevVal]);

  return {positionY: val, prevPosY: prevVal, reComputeHeight};
};  