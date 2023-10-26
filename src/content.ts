import { ActiveLink, Routes } from "./types/types";
export enum LocationIdsEnum {
    toronto = 'toronto',
    newyork = 'newyork',
    spain='spain',
    europe='europe',
    latinamerica='latinamerica',
    global='global'
}

export enum PlaylistEnum{
    bachata = 'bachata',
    salsa = 'salsa',
    zouk = 'zouk'
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
]

type LocationLabels = {
    [key in LocationIdsEnum]: string
  };

export const LocationLabels:LocationLabels = {
    "toronto":'Toronto',
    "newyork":'New York',
    "spain":'Spain',
    "europe":'Europe',
    "latinamerica":'Latin America',
    "global":'Global'
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
        emoji:'🎉',
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
]

