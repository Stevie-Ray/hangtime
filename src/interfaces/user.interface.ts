/**
 * Represents a hangboard used for climbing training.
 */
export interface Hangboard {
    /** The name of the hangboard. */
    name: string;
    /** The unique identifier of the hangboard. */
    id: number;
    /** The image URL of the hangboard. */
    image: string;
    /** The dimensions of the hangboard (x, y, z). */
    size: {
      x: number | null;
      y: number | null;
      z: number | null;
    };
    /** The material type of the hangboard. */
    type: string;
    /** The URL of the hangboard for more information (if available). */
    url: string | null;
    /** The number of holds on the hangboard. */
    holds: number;
    /** Optional: Sides information for hangboard with multiple sides. */
    sides?: Array<{ name: string; image: string; holds: number }>;
  }
  
  /**
   * Represents a company that produces hangboards.
   */
  export interface Company {
    /** The name of the company. */
    name: string;
    /** The description of the company. */
    description: string;
    /** The country where the company is located. */
    country: string;
    /** The geographical location of the company. */
    location: {
      lat: string;
      lon: string;
    };
    /** The unique identifier of the company. */
    id: number;
    /** The website URL of the company. */
    url: string;
    /** The social media links of the company (Facebook, Instagram). */
    socials: {
      facebook: string;
      instagram: string;
    };
    /** The list of hangboards offered by the company. */
    hangboards: Hangboard[];
  }
  