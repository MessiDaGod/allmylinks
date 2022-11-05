CREATE TABLE IF NOT EXISTS "all_columns" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_all_columns" PRIMARY KEY AUTOINCREMENT,
	"tables" TEXT NULL,
 "columns" TEXT NULL
)

INSERT INTO all_columns (tables, columns)
SELECT m.name as tables,
       p.name as columns
       ,p.*
FROM sqlite_master m
left join pragma_table_info((m.name)) p
     on m.name <> p.name
where m.type = 'table'
order by 1, 2;
