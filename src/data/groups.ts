export interface Team {
  name: string;
  code: string;
  color: string;
}

export const INITIAL_GROUPS: Record<string, Team[]> = {
  A: [{ name: "México", code: "mx", color: "#006847" }, { name: "USA", code: "us", color: "#002868" }, { name: "Canadá", code: "ca", color: "#FF0000" }, { name: "Panamá", code: "pa", color: "#DA121A" }],
  B: [{ name: "Argentina", code: "ar", color: "#74ACDF" }, { name: "Francia", code: "fr", color: "#002395" }, { name: "España", code: "es", color: "#FABD00" }, { name: "Marruecos", code: "ma", color: "#C1272D" }],
  C: [{ name: "Brasil", code: "br", color: "#CBAD23" }, { name: "Inglaterra", code: "gb-eng", color: "#CE1124" }, { name: "Japón", code: "jp", color: "#00008B" }, { name: "Ecuador", code: "ec", color: "#FFCC00" }],
  D: [{ name: "Bélgica", code: "be", color: "#000000" }, { name: "Portugal", code: "pt", color: "#E42518" }, { name: "Corea del Sur", code: "kr", color: "#CD2E3A" }, { name: "Colombia", code: "co", color: "#FCD116" }],
  E: [{ name: "Uruguay", code: "uy", color: "#0081C6" }, { name: "Alemania", code: "de", color: "#000000" }, { name: "Senegal", code: "sn", color: "#00853F" }, { name: "Australia", code: "au", color: "#00008B" }],
  F: [{ name: "Países Bajos", code: "nl", color: "#21468B" }, { name: "Croacia", code: "hr", color: "#FF0000" }, { name: "Nigeria", code: "ng", color: "#008751" }, { name: "Chile", code: "cl", color: "#0039A6" }],
  G: [{ name: "Italia", code: "it", color: "#008C45" }, { name: "Suiza", code: "ch", color: "#DA291C" }, { name: "Argelia", code: "dz", color: "#006233" }, { name: "Perú", code: "pe", color: "#D91023" }],
  H: [{ name: "Dinamarca", code: "dk", color: "#C60C30" }, { name: "Austria", code: "at", color: "#EF3340" }, { name: "Egipto", code: "eg", color: "#C09300" }, { name: "Costa Rica", code: "cr", color: "#EF3340" }],
  I: [{ name: "Túnez", code: "tn", color: "#E70013" }, { name: "Arabia Saudita", code: "sa", color: "#006C35" }, { name: "Paraguay", code: "py", color: "#D52B1E" }, { name: "Mali", code: "ml", color: "#FCD116" }],
  J: [{ name: "Eslovenia", code: "si", color: "#005EB8" }, { name: "Irak", code: "iq", color: "#007A33" }, { name: "Escocia", code: "gb-sct", color: "#0065BF" }, { name: "Ghana", code: "gh", color: "#ED1C24" }],
  K: [{ name: "Sudáfrica", code: "za", color: "#007A4D" }, { name: "Honduras", code: "hn", color: "#0073CF" }, { name: "Catar", code: "qa", color: "#8A1538" }, { name: "Georgia", code: "ge", color: "#FF0000" }],
  L: [{ name: "Jamaica", code: "jm", color: "#FED100" }, { name: "Grecia", code: "gr", color: "#0D5EAF" }, { name: "N. Zelanda", code: "nz", color: "#000000" }, { name: "Camerún", code: "cm", color: "#007A5E" }],
};

export const ALL_TEAMS: Team[] = Object.values(INITIAL_GROUPS).flat();
