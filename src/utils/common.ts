import type { AccountData } from '@inplayer-org/inplayer.js';

import { overrideIPCookieKey } from '#test/constants';
import type { AuthData, InPlayerAuthData, Customer } from '#types/account';

export function debounce<T extends (...args: any[]) => void>(callback: T, wait = 200) {
  let timeout: NodeJS.Timeout | null;
  return (...args: unknown[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
}

/**
 * Parse hex color and return the RGB colors
 * @param color
 * @return {{r: number, b: number, g: number}|undefined}
 */
export function hexToRgb(color: string) {
  if (color.indexOf('#') === 0) {
    color = color.slice(1);
  }

  // convert 3-digit hex to 6-digits.
  if (color.length === 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }

  if (color.length !== 6) {
    return undefined;
  }

  return {
    r: parseInt(color.slice(0, 2), 16),
    g: parseInt(color.slice(2, 4), 16),
    b: parseInt(color.slice(4, 6), 16),
  };
}

/**
 * Get the contrast color based on the given color
 * @param {string} color Hex or RGBA color string
 * @link {https://stackoverflow.com/a/35970186/1790728}
 * @return {string}
 */
export function calculateContrastColor(color: string) {
  const rgb = hexToRgb(color);

  if (!rgb) {
    return '';
  }

  // http://stackoverflow.com/a/3943023/112731
  return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186 ? '#000000' : '#FFFFFF';
}

// Build is either Development or Production
// Mode can be dev, jwdev, demo, test, prod, etc.
export const IS_DEVELOPMENT_BUILD = import.meta.env.DEV;
export const IS_DEMO_MODE = import.meta.env.MODE === 'demo';
export const IS_TEST_MODE = import.meta.env.MODE === 'test';

export function logDev(message: unknown, ...optionalParams: unknown[]) {
  if (IS_DEVELOPMENT_BUILD && !IS_TEST_MODE) {
    if (optionalParams.length > 0) {
      console.info(message, optionalParams);
    } else {
      console.info(message);
    }
  }
}

export function getOverrideIP() {
  if (!IS_TEST_MODE && !IS_DEVELOPMENT_BUILD) {
    return undefined;
  }

  return document.cookie
    .split(';')
    .find((s) => s.trim().startsWith(`${overrideIPCookieKey}=`))
    ?.split('=')[1]
    .trim();
}

export function testId(value: string | undefined) {
  return IS_DEVELOPMENT_BUILD || IS_TEST_MODE ? value : undefined;
}

// responsible to convert the InPlayer object to be compatible to the store
export function processInplayerAccount(account: AccountData): Customer {
  const { id, email, full_name: fullName, metadata, created_at: createdAt } = account;
  const regDate = new Date(createdAt * 1000).toLocaleString();

  return {
    id: id.toString(),
    email,
    fullName,
    firstName: metadata?.first_name as string,
    lastName: metadata?.last_name as string,
    regDate,
    country: '',
    lastUserIp: '',
  };
}

export function processInPlayerAuth(auth: InPlayerAuthData): AuthData {
  const { access_token: jwt } = auth;
  return {
    jwt,
    customerToken: '',
    refreshToken: '',
  };
}
