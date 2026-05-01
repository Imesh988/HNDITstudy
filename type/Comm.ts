export interface Comm {
    _id?: string,
    name: string,
    comment: string
}

export interface CommProps {
    onCommAdded: () => void;
}