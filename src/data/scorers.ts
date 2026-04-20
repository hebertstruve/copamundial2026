/**
 * Pool de apellidos plausibles por selección.
 * Llaves = código de bandera (igual que en groups.ts, minúsculas).
 * Si un equipo no está aquí, usamos fallback con número de dorsal.
 */
export const SCORER_POOL: Record<string, string[]> = {
  // CONMEBOL
  br: ['VINI JR.', 'RODRYGO', 'PAQUETÁ', 'RICHARLISON', 'RAPHINHA'],
  ar: ['MESSI', 'J. ÁLVAREZ', 'L. MARTÍNEZ', 'MAC ALLISTER', 'ALMADA'],
  uy: ['NÚÑEZ', 'VALVERDE', 'PELLISTRI', 'DE ARRASCAETA', 'SUÁREZ'],
  co: ['JAMES', 'D. MUÑOZ', 'L. DÍAZ', 'BORRÉ', 'URIBE'],
  ec: ['E. VALENCIA', 'CAICEDO', 'ESTUPIÑÁN', 'SARMIENTO', 'PRECIADO'],
  py: ['ALMIRÓN', 'SANABRIA', 'ENCISO', 'ROJAS', 'OVIEDO'],

  // CONCACAF
  mx: ['H. LOZANO', 'R. JIMÉNEZ', 'ANTUNA', 'E. ÁLVAREZ', 'A. VEGA'],
  us: ['PULISIC', 'REYNA', 'WEAH', 'BALOGUN', 'MCKENNIE'],
  ca: ['A. DAVIES', 'J. DAVID', 'BUCHANAN', 'LARIN', 'HOILETT'],
  pa: ['YOEL BÁRCENAS', 'WAYNE', 'FAJARDO', 'MURILLO', 'TANNER'],
  ht: ['BELFORT', 'PIERROT', 'SAINT-JUSTE', 'SANON', 'LAFROMBOISE'],

  // UEFA
  fr: ['MBAPPÉ', 'DEMBÉLÉ', 'GRIEZMANN', 'THURAM', 'KOLO MUANI'],
  es: ['YAMAL', 'N. WILLIAMS', 'PEDRI', 'MORATA', 'D. OLMO'],
  de: ['WIRTZ', 'MUSIALA', 'HAVERTZ', 'FÜLLKRUG', 'SANÉ'],
  'gb-eng': ['KANE', 'BELLINGHAM', 'FODEN', 'SAKA', 'WATKINS'],
  pt: ['B. FERNANDES', 'RAFA', 'LEÃO', 'J. FÉLIX', 'RONALDO'],
  be: ['DE BRUYNE', 'LUKAKU', 'DOKU', 'TROSSARD', 'OPENDA'],
  nl: ['DEPAY', 'GAKPO', 'WEGHORST', 'X. SIMONS', 'REIJNDERS'],
  hr: ['MODRIĆ', 'KOVAČIĆ', 'PERIŠIĆ', 'KRAMARIĆ', 'GVARDIOL'],
  ch: ['XHAKA', 'SHAQIRI', 'EMBOLO', 'AKANJI', 'AMDOUNI'],
  at: ['ARNAUTOVIĆ', 'ALABA', 'SABITZER', 'GRILLITSCH', 'BAUMGARTNER'],
  no: ['HAALAND', 'ØDEGAARD', 'SØRLOTH', 'SCHJELDERUP', 'NUSA'],
  se: ['ISAK', 'GYÖKERES', 'KULUSEVSKI', 'ELANGA', 'FORSBERG'],
  cz: ['SCHICK', 'SOUČEK', 'HLOŽEK', 'KUCHTA', 'ČERNÝ'],
  'gb-sct': ['McTOMINAY', 'ROBERTSON', 'DYKES', 'CHRISTIE', 'ADAMS'],
  tr: ['YILMAZ', 'ÇALHANOĞLU', 'GÜLER', 'KÖKÇÜ', 'YILDIZ'],
  ba: ['DŽEKO', 'PJANIĆ', 'KRUNIĆ', 'HADŽIAHMETOVIĆ', 'BEŠIĆ'],

  // CAF
  ma: ['ZIYECH', 'HAKIMI', 'EN-NESYRI', 'BOUFAL', 'OUNAHI'],
  sn: ['S. MANÉ', 'KOULIBALY', 'I. GUEYE', 'I. SARR', 'KOUYATÉ'],
  eg: ['M. SALAH', 'TREZEGUET', 'MARMOUSH', 'EL SHENAWY', 'HAMDI'],
  dz: ['MAHREZ', 'BOUNEDJAH', 'BELAILI', 'SLIMANI', 'DELORT'],
  tn: ['KHAZRI', 'MSAKNI', 'JEBALI', 'MEJBRI', 'CHAALALI'],
  ci: ['PEPÉ', 'HALLER', 'KESSIÉ', 'ADINGRA', 'KOSSOUNOU'],
  gh: ['J. KUDUS', 'T. PARTEY', 'A. AYEW', 'I. SULEMANA', 'FATAWU'],
  za: ['FOSTER', 'PERCY TAU', 'MAKGOPA', 'MOKOENA', 'MBEKI'],
  cv: ['DJANITÉ', 'DYLAN TAVARES', 'PINA', 'MARCOS LOPES', 'LIVRAMENTO'],
  cd: ['BAKAMBU', 'WISSA', 'CHANCEL MBEMBA', 'MASUAKU', 'WAN-BISSAKA'],

  // AFC
  jp: ['MITOMA', 'KUBO', 'DOAN', 'KAMADA', 'FURUHASHI'],
  kr: ['H. SON', 'LEE K.', 'HWANG H.', 'KIM M.', 'JUNG W.'],
  au: ['D. MITCHELL', 'IRVINE', 'GOODWIN', 'ROGIĆ', 'BOYLE'],
  sa: ['SALEM AL-DAWSARI', 'AL-SHEHRI', 'F. AL-BRIKAN', 'AL-BULAYHI', 'FIRAS'],
  ir: ['TAREMI', 'AZMOUN', 'JAHANBAKHSH', 'GHODDOS', 'CHESHMI'],
  iq: ['HUSSEIN ALI', 'ALI JASIM', 'BAYESH', 'RESAN', 'DAWOOD'],
  qa: ['AKRAM AFIF', 'ALI', 'MUNTARI', 'AL-HAYDOS', 'MADIBO'],
  uz: ['SHOMURODOV', 'TURGUNBOEV', 'ERKINOV', 'IBRAHIMOV', 'KHUSANOV'],
  jo: ['OLWAN', 'ABU-ZREIQ', 'ABOU-TAHA', 'AL-NAIMAT', 'HADDAD'],
  nz: ['WOOD', 'GARBETT', 'STAMENIĆ', 'BARBAROUSES', 'BELL'],
  cw: ['BACUNA', 'MARTINA', 'ANITA', 'LANSBERGEN', 'POLPREZ'],
};

export function scorersForTeam(teamCode: string): string[] {
  const key = teamCode.toLowerCase();
  const pool = SCORER_POOL[key];
  if (pool && pool.length > 0) return pool;
  const shortCode = key.includes('-') ? key.split('-').pop()!.toUpperCase() : key.toUpperCase();
  return ['#7', '#9', '#10', '#11', '#20'].map((n) => `${shortCode} ${n}`);
}
