import { Author } from "./author";

export interface Book {
    id: number;
    title: string;
    author: number | Author;  // Can be ID or full Author object
    author_info: Author;  // Can be ID or full Author object
    published_date?: string;  // Date as ISO string
}
