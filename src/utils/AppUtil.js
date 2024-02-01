// utils/createEmotionCache.ts
import createCache from '@emotion/cache';
import React from 'react';

const isBrowser = typeof document !== 'undefined';

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export default function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint =
      document.querySelector < HTMLMetaElement > 'meta[name="emotion-insertion-point"]';
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: 'mui-style', insertionPoint });
}

export const usePrevious = (value) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const usePreviousPersistent = (value) => {
  const [state, setState] = React.useState({
    value: value,
    prev: null,
  });

  const current = state.value;

  if (value !== current) {
    setState({
      value: value,
      prev: current,
    });
  }

  return state.prev;
};
