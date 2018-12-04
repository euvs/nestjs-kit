import {PaginationOptions} from './pagination.decorator';

export interface IPageInfo {
    // total number of items
    itemCount: number;
    // total number of pages for current request
    pageCount: number;
    // current page size
    pageSize: number;
    // current page index
    pageIndex: number;
}

export interface IPaginatedResponse<T> {
    items: T[];
    pageInfo: IPageInfo;
}

export const toListResponse = <T = any>(items: T[], pagination: PaginationOptions, totalItemCount: number): IPaginatedResponse<T> => {
    return {
        items: items,
        pageInfo: {
            itemCount: totalItemCount,
            pageCount: Math.ceil(totalItemCount / pagination.pageSize),
            pageSize: pagination.pageSize,
            pageIndex: pagination.pageIndex,
        },
    };
};
