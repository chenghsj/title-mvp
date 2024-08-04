import { getSelectorsByUserAgent } from 'react-device-detect';
import { headers } from 'next/headers';

export function checkIsMobile() {
  return getSelectorsByUserAgent(headers().get('user-agent') ?? '').isMobile;
}
