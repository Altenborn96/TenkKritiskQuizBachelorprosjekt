

//instillinger/[id].tsx
export interface Terms {
    id: number,
    title: string,
    description: string,
}

//instillinger/[id].tsx
export interface FAQ {
    id: number,
    question: string,
    answer: string,
    link?: string | null;
}

//instillinger/[id].tsx
export interface Sources {
    id: number,
    description: string,
    link: string,
}

//instillinger/[id].tsx
export interface AboutUs {
    id: number,
    title: string,
    description: string,
}

//instillinger/[id].tsx
export interface Privacy {
    id: number,
    title: string,
    content: string,
}

export interface FeedBackDto {
    id?: number,
    recommendScore?: number,
    funScore?: number,
    satisfiedScore?: number,
    suggestionComment?: string,
    generalComment?: string,
    identifier: string,
}