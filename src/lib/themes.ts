import { PlaylistEnum } from "./content";

export const playlistThemes = {
  [PlaylistEnum.bachata]:{
    pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
    playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900'
  },
  [PlaylistEnum.salsa]:{
    pageBackground: 'bg-gradient-to-b from-red-950 via-black',
    playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-red-950 via-red-950',
  },
  [PlaylistEnum.zouk]:{
    pageBackground: 'bg-gradient-to-b from-blue-900 via-black',
    playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-blue-900 via-blue-900',
  },
  default:{
    pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
    playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900'
  },
}

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

  export const availableThemes = {
    'purple':{
        pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
        playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900',
        label: 'Purple',
        mainColor: '#8250e6',
        buttonBackgroundColor: '#8250e6',
      },
      'blue':{
        pageBackground: 'bg-gradient-to-b from-blue-900 via-black',
        playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-blue-900 via-blue-900',
        label: 'Blue',
        mainColor: 'rgb(37 99 235)',
        buttonBackgroundColor: '#0284C7',
      },
      'red':{
        pageBackground: 'bg-gradient-to-b from-red-950 via-black',
        playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-red-950 via-red-950',
        label: 'Red',
        mainColor: 'rgb(220 38 38)',
        buttonBackgroundColor: '#F43F5E',
      },
      default:{
        pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
        playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900',
        label: 'Default',
        mainColor: '#8250e6',
        buttonBackgroundColor: '#8250e6',
      },
}
