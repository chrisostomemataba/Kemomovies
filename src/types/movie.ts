// src/types/movie.ts
export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    original_language: string;
    adult: boolean;
  }
  
  export interface MovieDetails extends Movie {
    runtime: number;
    status: string;
    tagline: string;
    budget: number;
    revenue: number;
    genres: Genre[];
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    spoken_languages: SpokenLanguage[];
    belongs_to_collection?: Collection;
  }
  
  export interface Genre {
    id: number;
    name: string;
  }
  
  export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }
  
  export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
  }
  
  export interface SpokenLanguage {
    iso_639_1: string;
    name: string;
  }
  
  export interface Collection {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  }
  
  export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
    known_for_department: string;
  }
  
  export interface Crew {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }
  
  export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
  }
  
  export interface MovieCredits {
    id: number;
    cast: Cast[];
    crew: Crew[];
  }