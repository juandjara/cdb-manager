export const QUERIES = {
  TABLES: `
    SELECT 
      pg_class.oid as id,
      pg_class.relname as name,
      pg_class.reltuples as row_count,
      pg_namespace.nspname as namespace,
      pg_class.relkind as table_type
    FROM pg_class, pg_roles, pg_namespace
    WHERE pg_roles.oid = pg_class.relowner 
      AND pg_roles.rolname = current_user
      AND pg_namespace.oid = pg_class.relnamespace
      AND pg_class.relkind IN ('r', 'm', 'v', 'p') 
      AND nspname = current_schema 
    ORDER BY relname
  `
}
