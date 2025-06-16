export interface Children {
    _id: string
    name: string
    fullname: string
    nickname: string
    age: number
    gender: string
    specialNeeds?: string
    allergies: string[] | string
}