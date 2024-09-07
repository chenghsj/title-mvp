import { getSelectorsByUserAgent } from 'react-device-detect';
import { headers } from 'next/headers';

export function deviceDetect() {
  const isMobile = getSelectorsByUserAgent(
    headers().get('user-agent') ?? ''
  ).isMobile;

  return { isMobile };
}
