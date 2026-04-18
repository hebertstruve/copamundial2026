export interface ScheduleEntry {
  venue: string;
  date: string;
  time: string;
}

export interface VenueLocation {
  country: string;
  city: string;
}

// Orden de partidos por grupo: [0,1], [2,3], [0,2], [1,3], [0,3], [1,2]
export const GROUP_SCHEDULE: Record<string, ScheduleEntry[]> = {
  A: [
    { venue: "Estadio Azteca",    date: "11 Jun", time: "19:00 CT" },
    { venue: "SoFi Stadium",      date: "12 Jun", time: "15:00 PT" },
    { venue: "Estadio Akron",     date: "18 Jun", time: "19:00 CT" },
    { venue: "Hard Rock Stadium", date: "19 Jun", time: "15:00 ET" },
    { venue: "Estadio BBVA",      date: "26 Jun", time: "19:00 CT" },
    { venue: "MetLife Stadium",   date: "26 Jun", time: "19:00 ET" },
  ],
  B: [
    { venue: "MetLife Stadium",  date: "13 Jun", time: "21:00 ET" },
    { venue: "AT&T Stadium",     date: "14 Jun", time: "18:00 CT" },
    { venue: "SoFi Stadium",     date: "20 Jun", time: "18:00 PT" },
    { venue: "Levi's Stadium",   date: "20 Jun", time: "21:00 PT" },
    { venue: "Lumen Field",      date: "27 Jun", time: "16:00 PT" },
    { venue: "Gillette Stadium", date: "27 Jun", time: "16:00 ET" },
  ],
  C: [
    { venue: "SoFi Stadium",      date: "13 Jun", time: "20:00 PT" },
    { venue: "Levi's Stadium",    date: "14 Jun", time: "14:00 PT" },
    { venue: "MetLife Stadium",   date: "20 Jun", time: "21:00 ET" },
    { venue: "NRG Stadium",       date: "21 Jun", time: "18:00 CT" },
    { venue: "Arrowhead Stadium", date: "27 Jun", time: "16:00 CT" },
    { venue: "Empower Field",     date: "27 Jun", time: "16:00 MT" },
  ],
  D: [
    { venue: "AT&T Stadium",      date: "12 Jun", time: "21:00 CT" },
    { venue: "Lumen Field",       date: "12 Jun", time: "15:00 PT" },
    { venue: "Hard Rock Stadium", date: "19 Jun", time: "21:00 ET" },
    { venue: "Gillette Stadium",  date: "19 Jun", time: "15:00 ET" },
    { venue: "Lincoln Financial", date: "26 Jun", time: "16:00 ET" },
    { venue: "SoFi Stadium",      date: "26 Jun", time: "16:00 PT" },
  ],
  E: [
    { venue: "NRG Stadium",       date: "14 Jun", time: "18:00 CT" },
    { venue: "Arrowhead Stadium", date: "14 Jun", time: "15:00 CT" },
    { venue: "BC Place",          date: "21 Jun", time: "18:00 PT" },
    { venue: "BMO Field",         date: "21 Jun", time: "15:00 ET" },
    { venue: "Soldier Field",     date: "28 Jun", time: "17:00 CT" },
    { venue: "NRG Stadium",       date: "28 Jun", time: "20:00 CT" },
  ],
  F: [
    { venue: "Empower Field", date: "15 Jun", time: "17:00 MT" },
    { venue: "Soldier Field", date: "15 Jun", time: "14:00 CT" },
    { venue: "Lumen Field",   date: "22 Jun", time: "18:00 PT" },
    { venue: "AT&T Stadium",  date: "22 Jun", time: "21:00 CT" },
    { venue: "MetLife Stadium", date: "29 Jun", time: "16:00 ET" },
    { venue: "SoFi Stadium",  date: "29 Jun", time: "16:00 PT" },
  ],
  G: [
    { venue: "MetLife Stadium",   date: "15 Jun", time: "19:00 ET" },
    { venue: "NRG Stadium",       date: "16 Jun", time: "15:00 CT" },
    { venue: "Soldier Field",     date: "22 Jun", time: "17:00 CT" },
    { venue: "AT&T Stadium",      date: "23 Jun", time: "20:00 CT" },
    { venue: "Hard Rock Stadium", date: "29 Jun", time: "18:00 ET" },
    { venue: "Levi's Stadium",    date: "29 Jun", time: "18:00 PT" },
  ],
  H: [
    { venue: "Gillette Stadium",  date: "13 Jun", time: "18:00 ET" },
    { venue: "Lincoln Financial", date: "14 Jun", time: "14:00 ET" },
    { venue: "Empower Field",     date: "20 Jun", time: "14:00 MT" },
    { venue: "BC Place",          date: "21 Jun", time: "14:00 PT" },
    { venue: "BC Place",          date: "28 Jun", time: "15:00 PT" },
    { venue: "BMO Field",         date: "28 Jun", time: "15:00 ET" },
  ],
  I: [
    { venue: "Arrowhead Stadium", date: "16 Jun", time: "16:00 CT" },
    { venue: "NRG Stadium",       date: "16 Jun", time: "19:00 CT" },
    { venue: "AT&T Stadium",      date: "23 Jun", time: "17:00 CT" },
    { venue: "Empower Field",     date: "23 Jun", time: "14:00 MT" },
    { venue: "Levi's Stadium",    date: "30 Jun", time: "14:00 PT" },
    { venue: "SoFi Stadium",      date: "30 Jun", time: "14:00 PT" },
  ],
  J: [
    { venue: "Lumen Field",       date: "16 Jun", time: "14:00 PT" },
    { venue: "BC Place",          date: "17 Jun", time: "15:00 PT" },
    { venue: "Arrowhead Stadium", date: "23 Jun", time: "19:00 CT" },
    { venue: "Gillette Stadium",  date: "24 Jun", time: "14:00 ET" },
    { venue: "BMO Field",         date: "30 Jun", time: "17:00 ET" },
    { venue: "Lumen Field",       date: "30 Jun", time: "17:00 PT" },
  ],
  K: [
    { venue: "Estadio BBVA",  date: "17 Jun", time: "18:00 CT" },
    { venue: "Estadio Azteca", date: "17 Jun", time: "21:00 CT" },
    { venue: "NRG Stadium",   date: "24 Jun", time: "16:00 CT" },
    { venue: "Soldier Field", date: "24 Jun", time: "19:00 CT" },
    { venue: "Estadio BBVA",  date: "30 Jun", time: "18:00 CT" },
    { venue: "Estadio Azteca", date: "30 Jun", time: "18:00 CT" },
  ],
  L: [
    { venue: "BMO Field",         date: "17 Jun", time: "18:00 ET" },
    { venue: "BC Place",          date: "18 Jun", time: "14:00 PT" },
    { venue: "Lincoln Financial", date: "24 Jun", time: "17:00 ET" },
    { venue: "Arrowhead Stadium", date: "25 Jun", time: "19:00 CT" },
    { venue: "Levi's Stadium",    date: "01 Jul", time: "14:00 PT" },
    { venue: "Empower Field",     date: "01 Jul", time: "14:00 MT" },
  ],
};

export const VENUE_IMAGES: Record<string, string> = {
  "Estadio Azteca":    "/stadiums/azteca.jpg",
  "Estadio Akron":     "/stadiums/akron.jpg",
  "Estadio BBVA":      "/stadiums/bbva.jpg",
  "SoFi Stadium":      "/stadiums/sofi.jpg",
  "MetLife Stadium":   "/stadiums/metlife.jpg",
  "AT&T Stadium":      "/stadiums/att.jpg",
  "Hard Rock Stadium": "/stadiums/hardrock.jpg",
  "Levi's Stadium":    "/stadiums/levis.jpg",
  "NRG Stadium":       "/stadiums/nrg.jpg",
  "Arrowhead Stadium": "/stadiums/arrowhead.jpg",
  "Lumen Field":       "/stadiums/lumenfield.jpg",
  "Empower Field":     "/stadiums/empower.jpg",
  "Soldier Field":     "/stadiums/soldier.jpg",
  "Gillette Stadium":  "/stadiums/gillette.jpg",
  "Lincoln Financial": "/stadiums/lincoln.jpg",
  "BC Place":          "/stadiums/bcplace.jpg",
  "BMO Field":         "/stadiums/bmo.jpg",
};

export const VENUE_LOCATION: Record<string, VenueLocation> = {
  "Estadio Azteca":    { country: "México",  city: "Ciudad de México" },
  "Estadio Akron":     { country: "México",  city: "Guadalajara" },
  "Estadio BBVA":      { country: "México",  city: "Monterrey" },
  "SoFi Stadium":      { country: "USA",     city: "Inglewood, CA" },
  "MetLife Stadium":   { country: "USA",     city: "East Rutherford, NJ" },
  "AT&T Stadium":      { country: "USA",     city: "Arlington, TX" },
  "Hard Rock Stadium": { country: "USA",     city: "Miami Gardens, FL" },
  "Levi's Stadium":    { country: "USA",     city: "Santa Clara, CA" },
  "NRG Stadium":       { country: "USA",     city: "Houston, TX" },
  "Arrowhead Stadium": { country: "USA",     city: "Kansas City, MO" },
  "Lumen Field":       { country: "USA",     city: "Seattle, WA" },
  "Empower Field":     { country: "USA",     city: "Denver, CO" },
  "Soldier Field":     { country: "USA",     city: "Chicago, IL" },
  "Gillette Stadium":  { country: "USA",     city: "Foxborough, MA" },
  "Lincoln Financial": { country: "USA",     city: "Filadelfia, PA" },
  "BC Place":          { country: "Canadá",  city: "Vancouver" },
  "BMO Field":         { country: "Canadá",  city: "Toronto" },
};
