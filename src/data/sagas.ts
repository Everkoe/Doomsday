import type { FinalGoal, Saga } from '../types';

export const SAGAS: Saga[] = [
  {
    id: 'avengers',
    name: 'Los Vengadores',
    tagline: 'Del primer vengador al final de una era',
    description:
      'La columna vertebral del MCU: cómo se formó el equipo, cómo se rompió y cómo se enfrentó a Thanos.',
    accent: '#E62429',
    chapters: [
      { label: 'Orígenes', titleIds: ['captain-america-first-avenger', 'the-avengers', 'winter-soldier'] },
      { label: 'Conflictos', titleIds: ['age-of-ultron', 'civil-war', 'black-panther'] },
      { label: 'Infinity War', titleIds: ['infinity-war'] },
      { label: 'Endgame', titleIds: ['endgame'] },
    ],
  },
  {
    id: 'guardians',
    name: 'Guardianes de la Galaxia',
    tagline: 'Una familia improbable en el borde del universo',
    description: 'La trilogía completa de los Guardianes y su cruce con los Vengadores en la guerra contra Thanos.',
    accent: '#F2A93B',
    chapters: [
      { label: 'Volumen 1', titleIds: ['guardians-vol-1'] },
      { label: 'Volumen 2', titleIds: ['guardians-vol-2'] },
      { label: 'Infinity War / Endgame', titleIds: ['infinity-war', 'endgame'] },
      { label: 'Volumen 3', titleIds: ['guardians-vol-3'] },
    ],
  },
  {
    id: 'wanda-vision',
    name: 'Wanda y Visión',
    tagline: 'Duelo, magia y una conciencia sintética',
    description: 'Desde el nacimiento de Visión hasta la trilogía de series que cierra VisionQuest.',
    accent: '#C2185B',
    chapters: [
      { label: 'Age of Ultron', titleIds: ['age-of-ultron'] },
      { label: 'WandaVision', titleIds: ['wandavision'] },
      { label: 'Doctor Strange 2', titleIds: ['multiverse-of-madness'] },
      { label: 'Agatha All Along', titleIds: ['agatha-all-along'] },
      { label: 'VisionQuest', titleIds: ['visionquest'] },
    ],
  },
  {
    id: 'multiverse',
    name: 'El Multiverso',
    tagline: 'Infinitas realidades, un solo colapso',
    description: 'Las historias que abren la puerta a otros universos: la TVA, los cruces y las incursiones.',
    accent: '#3FA7D6',
    chapters: [
      { label: 'Loki', titleIds: ['loki'] },
      { label: 'No Way Home', titleIds: ['no-way-home'] },
      { label: 'Doctor Strange 2', titleIds: ['multiverse-of-madness'] },
      { label: 'Deadpool & Wolverine', titleIds: ['deadpool-wolverine'] },
    ],
  },
  {
    id: 'new-avengers',
    name: 'Los Nuevos Vengadores',
    tagline: 'Un nuevo escudo, un nuevo equipo',
    description: 'Sam Wilson asume el escudo y un grupo de antihéroes ocupa el vacío que dejaron los Vengadores.',
    accent: '#8FA3B8',
    chapters: [
      { label: 'Falcon y el Soldado del Invierno', titleIds: ['falcon-winter-soldier'] },
      { label: 'Brave New World', titleIds: ['brave-new-world'] },
      { label: 'Thunderbolts*', titleIds: ['black-widow', 'thunderbolts'] },
    ],
  },
  {
    id: 'road-to-doom',
    name: 'El camino hacia Doom',
    tagline: 'Lo que la premisa oficial de Doomsday ya confirma',
    description:
      'Las piezas que conectan de forma confirmada con Avengers: Doomsday: los universos y equipos que convergen frente a Doctor Doom.',
    accent: '#5E7C4B',
    chapters: [
      { label: 'Fantastic Four', titleIds: ['fantastic-four'] },
      { label: 'Wakanda', titleIds: ['black-panther', 'wakanda-forever'] },
      { label: 'Tierra-616 hoy', titleIds: ['shang-chi', 'thunderbolts'] },
      { label: 'Otros universos', titleIds: ['loki', 'deadpool-wolverine'] },
    ],
    notes: [
      'Doomsday transcurre 14 meses después de Thunderbolts*, en pleno colapso del multiverso.',
      'Convergen los Vengadores, Wakanda y los New Avengers (Tierra-616), los Cuatro Fantásticos (Tierra-828) y los X-Men (Tierra-10005).',
      'Robert Downey Jr. interpreta a Victor von Doom. Dirigen Anthony y Joe Russo.',
    ],
  },
];

export const SAGAS_BY_ID = Object.fromEntries(SAGAS.map((s) => [s.id, s])) as Record<Saga['id'], Saga>;

/** Meta final del maratón. Datos de la premisa y reparto oficialmente anunciados. */
export const DOOMSDAY: FinalGoal = {
  id: 'doomsday',
  title: 'Avengers: Doomsday',
  releaseDate: '2026-12-18',
  releaseLabel: '18 de diciembre de 2026',
  directors: 'Anthony y Joe Russo',
  premise:
    'En pleno colapso del multiverso, héroes de tres universos distintos convergen para enfrentarse a la amenaza existencial de Doctor Doom.',
  confirmedCast: [
    { actor: 'Robert Downey Jr.', role: 'Doctor Doom' },
    { actor: 'Chris Evans', role: 'Steve Rogers' },
    { actor: 'Chris Hemsworth', role: 'Thor' },
    { actor: 'Florence Pugh', role: 'Yelena Belova' },
    { actor: 'Anthony Mackie', role: 'Sam Wilson' },
    { actor: 'Pedro Pascal', role: 'Reed Richards' },
    { actor: 'Tom Hiddleston', role: 'Loki' },
    { actor: 'Simu Liu', role: 'Shang-Chi' },
    { actor: 'Sebastian Stan', role: 'Bucky Barnes' },
    { actor: 'Vanessa Kirby', role: 'Sue Storm' },
    { actor: 'Channing Tatum', role: 'Gambit' },
    { actor: 'Ian McKellen', role: 'Magneto' },
  ],
};
