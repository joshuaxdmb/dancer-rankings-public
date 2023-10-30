
export type Instructor = {
    firstName: string;
    lastName: string;
    email?: string;
    instagramId?: string;
    website?: string;
    phoneNumber: string;
}

export enum DanceRoles {
    lead = 'lead',
    follow = 'follow',
    both = 'both'
}

export type ClassOfferedByInstructor = {
    title: string;
    genre: string;
    forDanceRole: DanceRoles;
    forDanceLevels: DanceLevels[];
    durationInMinutes: number;
}

export enum DanceLevels {
    beginner1 = 'beginnner1',
    beginner2 = 'beginner2',
    intermediate1 = 'intermediate1',
    intermediate2 = 'intermediate2',
    advanced = 'advanced'
}