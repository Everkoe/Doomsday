/**
 * Fichas oficiales de Disney+ (disneyplus.com/browse/entity-…).
 * El identificador es el mismo en todas las regiones: Disney+ redirige al catálogo del país del usuario.
 * Avengers: Doomsday no tiene ficha porque todavía no está en la plataforma.
 */
const DISNEY_PLUS_ENTITIES: Readonly<Record<string, string>> = {
  'captain-america-first-avenger': '8e68c43a-117c-4f4d-b217-0db106a1a614',
  'the-avengers': 'd2ab699b-67da-4906-a7a4-5bc542c953cf',
  'winter-soldier': 'ef333a5c-b855-4d3e-a7d9-d9e142b6dc7d',
  'guardians-vol-1': 'c9ee959b-7249-4a4c-9708-9ffd1ddb00f1',
  'guardians-vol-2': '9fcd7087-c151-49dc-aeb9-b2f9943fd4e6',
  'age-of-ultron': '42329b99-0953-4f1a-9420-a0dbf7733e95',
  'civil-war': '2fe7e94e-8b24-4a75-8fc8-969c2a16959e',
  'black-widow': 'd9cd6bd1-bcf8-4a3b-8f92-0fdd4f79ac08',
  'black-panther': '8904b1b5-da2c-4ff1-b389-dc81825559fd',
  'doctor-strange': '43a741e8-2369-4577-9bec-ef94f4aaae0b',
  'infinity-war': '9a136e06-852a-41bf-b71d-fa061cb43225',
  endgame: 'b39aa962-be56-4b09-a536-98617031717f',
  loki: '8f8c5cbb-e5ba-4285-9e2c-86abcac9fd50',
  wandavision: '90affd1f-0851-48bc-9cab-c142d5c9c20c',
  'falcon-winter-soldier': '3c08a31a-2350-4aaf-90d0-88def4c551bf',
  'shang-chi': '92243dd0-bcfe-4365-ae76-1fa3cf1a2ab9',
  'no-way-home': '295fb45a-c8bb-477e-816f-b0706b4d9984',
  'multiverse-of-madness': '6fe6062c-2499-4f44-a48a-fc93f59cb504',
  'wakanda-forever': '86e14fdb-3841-4282-ad38-07c8c4aab4b6',
  'guardians-vol-3': '820f0ded-3254-42c5-a7e4-7c044ff6dd65',
  'agatha-all-along': '5e474669-a4a2-4b90-a928-5ae7f845090c',
  'deadpool-wolverine': '120ae1e6-2240-4924-a4ce-f8de6e28b0b1',
  'brave-new-world': '3064ac7f-ef4d-4f89-b92f-b5524da92a72',
  thunderbolts: 'f51dce23-7d8f-490a-9f0c-be1b5432c2a9',
  visionquest: '8744ec55-8d14-4631-99b4-c889a2d6013f',
  'fantastic-four': '2142a7a9-4c49-438d-a492-296c4e08b714',
};

/** Enlace directo a la ficha de Disney+ del título, si está disponible en la plataforma. */
export function disneyPlusUrl(titleId: string): string | undefined {
  const entity = DISNEY_PLUS_ENTITIES[titleId];
  return entity ? `https://www.disneyplus.com/browse/entity-${entity}` : undefined;
}
