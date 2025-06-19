export default interface ColumnFilter{
    filters:FilterType[]
}

export interface FilterType{
    columnName:string,
    filter:any
}