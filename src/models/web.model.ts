export class WebResponse<T> {
    data?: T;
    errors?: string;
    paging?: Paging
}

export class Paging {
    per_page: number;
    total_page: number;
    current_page: number;
}