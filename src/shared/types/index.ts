// Entity types (each also re-exports its own request/response DTOs)
export * from './entities/deal';
export * from './entities/university';
export * from './entities/category';
export * from './entities/store';
export * from './entities/user';
export * from './entities/submittedDeal';

// Common / pagination types
export * from './common/base';

// NOTE: api/requests and api/responses are intentionally NOT re-exported here;
// their types surface through the entity re-exports above to avoid duplicate
// export conflicts.  Import directly from '@/shared/types/api/requests' or
// '@/shared/types/api/responses' when you need a type not covered by entities.
