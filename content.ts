import { DanceLevelsEnum, DanceRolesEnum } from "./src/types/danceClassesTypes";
import { ActiveLink, Routes } from "./src/types/types";

export enum LocationIdsEnum {
    toronto = 'toronto',
    newyork = 'newyork',
    spain='spain',
    europe='europe',
    latinamerica='latinamerica',
    global='global',
    USA='USA'
}

export enum PlaylistEnum{
    bachata = 'bachata',
    salsa = 'salsa',
    zouk = 'zouk'
}

export enum SignInMethodsEnum{
    google = 'google',
    spotify = 'spotify',
    spotifySession = 'spotify-session'
}

export const Locations = [
    {
        id:LocationIdsEnum.toronto,
        label:'Toronto',
    },
    {
        id:LocationIdsEnum.newyork,
        label:'New York',
    },
    {
        id:LocationIdsEnum.spain,
        label:'Spain',
    },
    {
        id:LocationIdsEnum.europe,
        label:'Europe',
    },
    {
        id:LocationIdsEnum.latinamerica,
        label:'Latin America',
    },
    {
        id:LocationIdsEnum.global,
        label:'Global',
    },
    {
        id:LocationIdsEnum.USA,
        label:'USA',
    },
]

type LocationLabelsType = {
    [key in LocationIdsEnum]: string
  };

export const LocationLabels:LocationLabelsType = {
    "toronto":'Toronto',
    "newyork":'New York',
    "spain":'Spain',
    "europe":'Europe',
    "latinamerica":'Latin America',
    "global":'Global',
    "USA":'USA'
}

type DanceLevelLabelsType = {
    [key in DanceLevelsEnum]: string
  };    

export const DanceLevelLabels:DanceLevelLabelsType = {
    "beginner1":'Beginner 1',
    "beginner2":'Beginner 2',
    "intermediate1":'Intermediate 1',
    "intermediate2":'Intermediate 2',
    "advanced":'Advanced'
}

type DanceRoleLabelsType = {
    [key in DanceRolesEnum]: string
}

export const DanceRoleLabels:DanceRoleLabelsType = {
    "Lead":'Lead',
    "Follow":'Follow',
    "Both":'Both'
}

export const PlaylistLabels = {
    "bachata":'Bachata',
    "salsa":'Salsa',
    "zouk":'Zouk'
}

export const EventsThisWeek: Array<any> = [
    {
        label:'TDF',
        venue:'Casa Do Alentejo',
        locationLink:'https://maps.app.goo.gl/4bYsTHKHFb3miYFS6',
        eventSite:'https://torontodancefridays.com/events/',
        startTime:'8pm',
        classesIncluded:'Salsa @8pm, Modern Bachata @9pm',
        instructors:'Ish and Natalya, Maya and Sunaal'

    },
    {
        label:'Fiesta X (aka DLX)',
        venue:'DanceLife X Centre',
        locationLink:'https://maps.app.goo.gl/WmHmbQSVaydeMVya9',
        eventSite:'https://instagram.com/fiestax_dlx?igshid=NzZhOTFlYzFmZQ==',
        startTime:'8pm',
        classesIncluded:'Bachata Intro @8:15pm, Bachata Intermediate @9:15pm, Zouk @ 10:15pm',
        instructors:'TBA'

    },
    {
        label:'Sunday Social',
        venue:'Dovercourt House',
        locationLink:'https://maps.app.goo.gl/SwdFhrqRT9qkhRSs6',
        eventSite:'https://instagram.com/fiestax_dlx?igshid=NzZhOTFlYzFmZQ==',
        startTime:'6pm',
        classesIncluded:'TBA',
        instructors:'TBA'

    }
]

export const ActiveLinks: Array<ActiveLink> = [
    {
        href: Routes.Songs,
        emoji:'🎊',
        label:`Vote Salsa`,
        playlist:PlaylistEnum.salsa
    },
    { 
        href: Routes.Songs,
        emoji:'🔥',
        label:'Vote Bachata',
        playlist:PlaylistEnum.bachata
    },
    {
        href: Routes.Songs,
        emoji:'🌊',
        label:'Vote Zouk',
        playlist:PlaylistEnum.zouk
    },
    {
        href: Routes.Events,
        emoji:'💃',
        label:'Vote Events',
    },
    {
        href: Routes.Classes,
        emoji:'🕺',
        label:'Book Classes',
    },
    {
        href: Routes.PartyPlaylist,
        emoji:'🎉',
        label:'Party Playlist',
    },
]

