export interface Joke {
    id: string;
    title: string;
    body: string;
    createdAt: number;
    favorited?: boolean;
}
