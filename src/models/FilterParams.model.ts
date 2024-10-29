import { SortDirectionDto } from '@/models/SortDirection.enum';

export interface FilterParams<SORT_BY, PARAMS> {
  page: string;
  pageSize: string;
  sortBy: SORT_BY;
  sortOrder: SortDirectionDto;
  params: PARAMS;
}
