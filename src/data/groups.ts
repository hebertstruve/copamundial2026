export interface Team {
  name: string;
  code: string;
  color: string;
}

export const INITIAL_GROUPS: Record<string, Team[]> = {
  A: [{ name: "México", code: "mx", color: "#006847" }, { name: "Sudáfrica", code: "za", color: "#007A4D" }, { name: "Corea del Sur", code: "kr", color: "#CD2E3A" }, { name: "República Checa", code: "cz", color: "#11457E" }],
  B: [{ name: "Canadá", code: "ca", color: "#FF0000" }, { name: "Bosnia y Herzegovina", code: "ba", color: "#002F6C" }, { name: "Qatar", code: "qa", color: "#8A1538" }, { name: "Suiza", code: "ch", color: "#DA291C" }],
  C: [{ name: "Brasil", code: "br", color: "#CBAD23" }, { name: "Marruecos", code: "ma", color: "#C1272D" }, { name: "Haití", code: "ht", color: "#00209F" }, { name: "Escocia", code: "gb-sct", color: "#0065BF" }],
  D: [{ name: "Estados Unidos", code: "us", color: "#002868" }, { name: "Paraguay", code: "py", color: "#D52B1E" }, { name: "Australia", code: "au", color: "#00008B" }, { name: "Turquía", code: "tr", color: "#E30A17" }],
  E: [{ name: "Alemania", code: "de", color: "#000000" }, { name: "Curazao", code: "cw", color: "#002B7F" }, { name: "Costa de Marfil", code: "ci", color: "#F77F00" }, { name: "Ecuador", code: "ec", color: "#FFCC00" }],
  F: [{ name: "Países Bajos", code: "nl", color: "#21468B" }, { name: "Japón", code: "jp", color: "#00008B" }, { name: "Suecia", code: "se", color: "#006AA7" }, { name: "Túnez", code: "tn", color: "#E70013" }],
  G: [{ name: "Bélgica", code: "be", color: "#000000" }, { name: "Egipto", code: "eg", color: "#C09300" }, { name: "Irán", code: "ir", color: "#239F40" }, { name: "Nueva Zelanda", code: "nz", color: "#000000" }],
  H: [{ name: "España", code: "es", color: "#FABD00" }, { name: "Cabo Verde", code: "cv", color: "#003893" }, { name: "Arabia Saudita", code: "sa", color: "#006C35" }, { name: "Uruguay", code: "uy", color: "#0081C6" }],
  I: [{ name: "Francia", code: "fr", color: "#002395" }, { name: "Senegal", code: "sn", color: "#00853F" }, { name: "Irak", code: "iq", color: "#007A33" }, { name: "Noruega", code: "no", color: "#BA0C2F" }],
  J: [{ name: "Argentina", code: "ar", color: "#74ACDF" }, { name: "Argelia", code: "dz", color: "#006233" }, { name: "Austria", code: "at", color: "#EF3340" }, { name: "Jordania", code: "jo", color: "#007A3D" }],
  K: [{ name: "Portugal", code: "pt", color: "#E42518" }, { name: "RD Congo", code: "cd", color: "#007FFF" }, { name: "Uzbekistán", code: "uz", color: "#1EB53A" }, { name: "Colombia", code: "co", color: "#FCD116" }],
  L: [{ name: "Inglaterra", code: "gb-eng", color: "#CE1124" }, { name: "Croacia", code: "hr", color: "#FF0000" }, { name: "Ghana", code: "gh", color: "#ED1C24" }, { name: "Panamá", code: "pa", color: "#DA121A" }],
};

export const ALL_TEAMS: Team[] = Object.values(INITIAL_GROUPS).flat();
