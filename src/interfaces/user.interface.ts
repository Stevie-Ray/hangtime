/**
 * Represents a hangboard used for climbing training.
 */
export interface Hangboard {
  /**
   * The name of the hangboard.
   * Example: "1000 Series", "Kineboard", "Training Board".
   */
  name: string

  /**
   * The unique identifier of the hangboard.
   * Used to distinguish this hangboard from others in the system.
   */
  id: number

  /**
   * The image URL of the hangboard.
   * A link to an image that visually represents the hangboard.
   */
  image: string

  /**
   * The dimensions of the hangboard in millimeters (x, y, z).
   * Represents the width (x), height (y), and depth (z) of the hangboard.
   * Values can be null if dimensions are not available.
   */
  size: {
    x: number | null
    y: number | null
    z: number | null
  }

  /**
   * The material type of the hangboard.
   * Example: "wood", "plastic".
   */
  type: string

  /**
   * The URL of the hangboard for more information.
   * Optional, can be null if no additional information is available online.
   */
  url: string | null

  /**
   * The number of holds on the hangboard.
   * Indicates the total number of distinct holds or grips available.
   */
  holds: number

  /**
   * Optional: Information about additional sides of the hangboard.
   * Some hangboards have multiple sides, each with different holds and features.
   * Each side is described by a name, image, and the number of holds.
   */
  sides?: Array<{ name: string; image: string; holds: number }>
}

/**
 * Represents a company that produces hangboards.
 */
export interface Company {
  /**
   * The name of the company.
   * Example: "Beastmaker", "Metolius".
   */
  name: string

  /**
   * The description of the company.
   * Provides an overview of the company's mission, history, or offerings.
   */
  description: string

  /**
   * The country ISO 3166-1 alpha-2 code where the company is located.
   * Example: "GB", "US".
   */
  country: string

  /**
   * The geographical location of the company.
   * Represents the latitude and longitude of the company's headquarters.
   * Can be null if the location is not specified.
   */
  location: {
    lat: string | null
    lon: string | null
  } | null

  /**
   * The unique identifier of the company.
   * Used to distinguish this company from others in the system.
   */
  id: number

  /**
   * The website URL of the company.
   * A link to the company's official website for more information.
   * Optional, can be null if the company does not have a website.
   */
  url: string | null

  /**
   * The social media links of the company.
   * Includes links to the company's Facebook and Instagram pages.
   * Optional, each link can be null if not available.
   */
  socials: {
    facebook: string | null
    instagram: string | null
  }

  /**
   * The list of hangboards offered by the company.
   * An array of Hangboard objects, each representing a different product.
   */
  hangboards: Hangboard[]
}
