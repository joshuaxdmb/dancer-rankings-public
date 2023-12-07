import { PlaylistEnum } from "../../content";

export const themes = {
    [PlaylistEnum.bachata]: {
      pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
      playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900',
    },
    [PlaylistEnum.salsa]: {
      pageBackground: 'bg-gradient-to-b from-red-950 via-black',
      playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-red-950 via-red-950',
    },
    [PlaylistEnum.zouk]: {
      pageBackground: 'bg-gradient-to-b from-blue-900 via-black',
      playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-blue-900 via-blue-900',
    },
    default: {
        pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
        playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900',
    }
  }