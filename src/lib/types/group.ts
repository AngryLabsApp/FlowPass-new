export interface Group {
    id: string;            // uuid
    created_at: string;    // timestamp with time zone (ISO string)
    gym_id: string;        // uuid
    title: string;         // text
    updated_at: string;
    color: string;
    member_count: number;
    members: string[];
}


