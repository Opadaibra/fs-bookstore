/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

/* Manually added models for Django API */



export interface ApiResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}