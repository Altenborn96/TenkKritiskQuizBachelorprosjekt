//Login.tsx
export interface LoginUserDto {
    username: string,
    password: string,
}

//lag-bruker.tsx
export interface RegisterUserDto {
    username: string,
    email: string,
    password: string,
}

//ledertavle-anonym
export interface UserAnonymousStatus {
    isAnonymous: boolean,
    username: string,
}

//glemt-passord.tsx
export interface ResetPasswordRequest{
    email: string
}

//reset.tsx
export interface ResetPasswordDto{
    email:string,
    newPassword: string,
    token: string,
}

