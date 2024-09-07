'use client';

import { useEffect, useState } from 'react';
import { useDeviceSelectors, useMobileOrientation } from 'react-device-detect';

export function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState(false);
  let isLandscape = false;
  let selectors: Partial<typeof ReactDeviceDetect> = {};

  if (typeof window === 'undefined') {
    return { isMobile, isLandscape, selectors };
  }

  /* eslint-disable */
  useEffect(() => {
    setIsMobile(selectors.isMobile ?? false);
  }, [selectors.isMobile]);

  isLandscape = useMobileOrientation().isLandscape;
  selectors = useDeviceSelectors(window?.navigator.userAgent)[0];
  /* eslint-disable */

  return { isMobile, isLandscape, selectors };
}
