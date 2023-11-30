
export type Instructor = {
    firstName: string;
    lastName: string;
    email?: string;
    instagramId?: string;
    website?: string;
    phoneNumber: string;
}

export enum DanceRolesEnum {
    Lead = 'Lead',
    Follow = 'Follow',
    Both = 'Both'
}

export type ClassOfferedByInstructor = {
    title: string;
    genre: string;
    forDanceRole: DanceRolesEnum;
    forDanceLevels: DanceLevelsEnum[];
    durationInMinutes: number;
}

export enum DanceLevelsEnum {
    beginner1 = 'beginner1',
    beginner2 = 'beginner2',
    intermediate1 = 'intermediate1',
    intermediate2 = 'intermediate2',
    advanced = 'advanced'
}