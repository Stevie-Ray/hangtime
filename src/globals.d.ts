// Plugins
declare module '@/plugins/firebase' {
  const value: any
  export default value
}

declare module '@/plugins/firebase/authentication' {
  const value: any
  export default value
}

declare module '@/plugins/firebase/generic-db' {
  const value: any
  export default value
}

declare module '@/plugins/firebase/user-activities-db' {
  const value: any
  export default value
}

declare module '@/plugins/firebase/user-workouts-db' {
  const value: any
  export default value
}

declare module '@/plugins/firebase/users-db' {
  const value: any
  export default value
}

declare module '@/plugins/firebase/users-workouts-db' {
  const value: any
  export default value
}

declare module '@/plugins/head' {
  const value: any
  export default value
}

declare module '@/plugins/i18n' {
  export function loadLanguageAsync(locale: string): Promise<void>
  const value: any
  export default value
}

declare module '@/plugins/pinia' {
  const value: any
  export default value
}

declare module '@/plugins/register-service-worker' {
  const value: any
  export default value
}

declare module '@/plugins/vuetify' {
  const value: any
  export default value
}

// Helpers
declare module '@/helpers/countries' {
  const value: {
    /** ISO 3166-1 alpha-2 code */
    alpha2: string
    /** ISO 3166-1 alpha-3 code */
    alpha3: string
    /** International dialing codes */
    countryCallingCodes: string[]
    /** Currency codes */
    currencies: string[]
    /** Emoji flag */
    emoji: string
    /** International Olympic Committee code */
    ioc: string
    /** Language codes */
    languages: string[]
    /** Country name */
    name: string
    /** Status of the country */
    status: string
  }[]
  export default value
}

// declare module '@/helpers/hangboards' {
//   const value: Company[]
//   export default value
// }

declare module '@/helpers/online' {
  const value: any
  export default value
}
