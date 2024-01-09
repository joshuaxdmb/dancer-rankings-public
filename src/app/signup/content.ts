import { DanceRolesEnum } from "@/types/danceClassesTypes"

export enum stagesEnum {
    identification = 'identification',
    alsoDance = 'also_dance',
    danceRole = 'primary_dance_role',
    birthday = 'birthdate'
}

export interface Stage {
    index?:number,
    title:any[],
    options?:any[]
}

export const indices = [
    stagesEnum.identification,
    stagesEnum.alsoDance,
    stagesEnum.danceRole,
    stagesEnum.danceRole
]

export const stages = {
    [stagesEnum.identification]: {
        index:1,
        title: [{ content: "Let's make this right for " },
        { content: "you", color: "#8250E6" }],
        options: [
            {
                title: "I am (only) a dancer",
                result: "dancer",
                image: '/assets/icons/id-dancer.png'
            },
            {
                title: "I am a DJ",
                result: "dj",
                image:'/assets/icons/id-dj.png'
            },
            {
                title: "I am an event organizer",
                result: "organizer",
                image:'/assets/icons/id-organizer.png'
            }
        ]
    },
    [stagesEnum.alsoDance]: {
        index:2,
        title: [
            { content: "Do you also " },
            { content: "dance", color: "#8250E6" },
            { content: "?" }
        ],
        options: [
            {
                title: "Yes",
                result: "yes"
            },
            {
                title: "Not really",
                result: "No"
            }
        ]
    },
    [stagesEnum.danceRole]: {
        index:3,
        title: [
            { content: "What is your " },
            { content: "primary ", color: "#8250E6" },
            { content: "dance role?" }
        ],
        options: [
            { title: "Follow", result: DanceRolesEnum.Follow },
            { title: "Lead", result: DanceRolesEnum.Lead }
        ]
    },
    [stagesEnum.birthday]:{
        index:4,
        title:[
            {content:"When are your "},
            {content: "birthday ", color:"#8250E6"},
            {content:"dances?"}
        ],
    }

}