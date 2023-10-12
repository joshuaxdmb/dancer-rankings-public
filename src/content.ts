import { PlaylistInfo, Routes } from "./types/types";
export enum LocationIdsEnum {
    toronto = 'toronto',
    newyork = 'newyork'
}

export enum PlaylistEnum{
    bachata = 'bachata',
    salsa = 'salsa',
    zoilk = 'zouk'
}

export const Locations = [
    {
        id:LocationIdsEnum.toronto,
        label:'Toronto',
    },
    {
        id:LocationIdsEnum.newyork,
        label:'New York',
    }
]

type LocationLabels = {
    [key in LocationIdsEnum]: string
  };

export const LocationLabels:LocationLabels = {
    "toronto":'Toronto',
    "newyork":'New York'
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

export const ActiveLinks: Array<PlaylistInfo> = [
    {
        route: Routes.Salsa,
        emoji:'🎉',
        label:`Vote Salsa`,
    },
    { 
        route: Routes.Bachata,
        emoji:'🔥',
        label:'Vote Bachata',
    },
    {
        route: Routes.Zouk,
        emoji:'🌊',
        label:'Vote Zouk'
    },
    {
        route: Routes.Events,
        emoji:'💃',
        label:'Vote Events'
    },
]

