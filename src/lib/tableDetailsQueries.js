export const DETAIL_QUERIES = {
  COLUMNS: (tableid) =>
    (tableid || tableid === 0) &&
    `
    SELECT 
      attname,
      format_type(atttypid, atttypmod) as type
    FROM pg_attribute
    WHERE attrelid = ${tableid}
      AND attisdropped = false
      AND attnum > 0
    ORDER by attnum
    `,
  INDICES: (tableid) =>
    (tableid || tableid === 0) &&
    `
    SELECT
      index_name,
      STRING_AGG(
        CASE
          WHEN column_name NOT SIMILAR TO '[a-zA-Z_][a-zA-Z_0-9]*'
          THEN '"' || column_name || '"'
          ELSE column_name
        END,
        ','
      ) AS column_names,
      index_type
    FROM (
      SELECT
        i.relname AS index_name,
        a.attname AS column_name,
        am.amname AS index_type
      FROM pg_class t 
      JOIN pg_attribute a ON t.oid = a.attrelid
      JOIN pg_index ix ON ix.indrelid = t.oid
      JOIN pg_class i ON ix.indexrelid = i.oid AND a.attnum = ANY(ix.indkey)
      JOIN pg_am am ON i.relam = am.oid
      WHERE t.relkind IN ('r', 'p', 'm')
      AND t.oid = ${tableid}
      ORDER BY t.relname, i.relname, am.amname, a.attname
    ) a
    GROUP BY index_name, index_type
    `,
  CONSTRAINTS: (tableid) =>
    (tableid || tableid === 0) &&
    `SELECT * FROM pg_constraint WHERE conrelid = ${tableid}`,
  TRIGGERS: (tableid) =>
    (tableid || tableid === 0) &&
    `SELECT * FROM pg_trigger WHERE tgrelid = ${tableid}`
}
