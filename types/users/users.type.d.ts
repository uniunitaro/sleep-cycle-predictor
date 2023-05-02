export type GetMeResponse = {
    id: string;
    nickname: string;
    email: string | null;
};
export type PostUserResponse = GetMeResponse;
export type GetUserResponse = {
    id: string;
    nickname: string;
};
