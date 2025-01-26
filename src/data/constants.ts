import { COUNTRY_DATA } from "./data";

export const TITLES = ["Mr", "Mrs", "Ms", "Dr"] as const;

export const GENDERS = ["Male", "Female"] as const;

export const COUNTRIES = COUNTRY_DATA.map((country) => country.name) as unknown as readonly [string, ...string[]];

export const DAILING_CODES = Array.from(
  new Set(COUNTRY_DATA.map((country) => `${country.name} (${country.dialingCode})`))
) as unknown as readonly [string, ...string[]];

export const STORE_KEY = "durar-academy";