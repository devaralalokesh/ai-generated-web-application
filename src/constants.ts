export type Position = { x: number; y: number };

export const GRID_SIZE = 20;

export const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving UP

export const PLAYLIST = [
  {
    id: 1,
    title: "NEURAL_LINK_01",
    artist: "AI.X1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "CYBER_GRID_OVERRIDE",
    artist: "MECHA_MIND",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    duration: "4:05"
  },
  {
    id: 3,
    title: "GHOST_IN_THE_SYNTH",
    artist: "SYS.ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    duration: "5:21"
  }
];
