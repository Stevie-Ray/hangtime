export interface Hangboard {
    name: string;
    id: number;
    image: string;
    size: {
      x: number | null;
      y: number | null;
      z: number | null;
    };
    type: string;
    url: string | null;
    holds: number;
  }

  export interface Company {
    name: string;
    description: string;
    country: string;
    location: {
      lat: string;
      lon: string;
    };
    id: number;
    url: string;
    socials: {
      facebook: string;
      instagram: string;
    };
    hangboards: Hangboard[];
  }