export interface IUser{
    id: string;
    userName: string;
    teamId: string;
}

export  interface ITeam{
    id: number;
    teamName: string;
    users: IUser[]
}