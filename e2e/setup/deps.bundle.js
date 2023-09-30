"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// deps.ts
var deps_exports = {};
__export(deps_exports, {
  db: () => db
});
module.exports = __toCommonJS(deps_exports);

// ../../node_modules/.pnpm/drizzle-orm@0.28.5_@planetscale+database@1.8.0_mysql2@3.6.0/node_modules/drizzle-orm/alias-a0c6a0a1.mjs
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(`Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
  }
  let cls = value.constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}
var Column = class {
  table;
  static [entityKind] = "Column";
  name;
  primary;
  notNull;
  default;
  defaultFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  config;
  constructor(table, config2) {
    this.table = table;
    this.config = config2;
    this.name = config2.name;
    this.notNull = config2.notNull;
    this.default = config2.default;
    this.defaultFn = config2.defaultFn;
    this.hasDefault = config2.hasDefault;
    this.primary = config2.primaryKey;
    this.isUnique = config2.isUnique;
    this.uniqueName = config2.uniqueName;
    this.uniqueType = config2.uniqueType;
    this.dataType = config2.dataType;
    this.columnType = config2.columnType;
  }
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
};
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
var View = class {
  static [entityKind] = "View";
  /** @internal */
  [ViewBaseConfig];
  constructor({ name: name2, schema, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
};
var SubqueryConfig = Symbol.for("drizzle:SubqueryConfig");
var Subquery = class {
  static [entityKind] = "Subquery";
  /** @internal */
  [SubqueryConfig];
  constructor(sql2, selection, alias, isWith = false) {
    this[SubqueryConfig] = {
      sql: sql2,
      selection,
      alias,
      isWith
    };
  }
  getSQL() {
    return new SQL([this]);
  }
};
var WithSubquery = class extends Subquery {
  static [entityKind] = "WithSubquery";
};
var SelectionProxyHandler = class _SelectionProxyHandler {
  static [entityKind] = "SelectionProxyHandler";
  config;
  constructor(config2) {
    this.config = { ...config2 };
  }
  get(subquery, prop) {
    if (prop === SubqueryConfig) {
      return {
        ...subquery[SubqueryConfig],
        selection: new Proxy(subquery[SubqueryConfig].selection, this)
      };
    }
    if (prop === ViewBaseConfig) {
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(subquery[ViewBaseConfig].selectedFields, this)
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = is(subquery, Subquery) ? subquery[SubqueryConfig].selection : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if (is(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if (is(value, SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(`You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
    }
    if (is(value, Column)) {
      if (this.config.alias) {
        return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(value.table, new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false))));
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new _SelectionProxyHandler(this.config));
  }
};
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce((result2, { path, field }, columnIndex) => {
    let decoder2;
    if (is(field, Column)) {
      decoder2 = field;
    } else if (is(field, SQL)) {
      decoder2 = field.decoder;
    } else {
      decoder2 = field.sql.decoder;
    }
    let node = result2;
    for (const [pathChunkIndex, pathChunk] of path.entries()) {
      if (pathChunkIndex < path.length - 1) {
        if (!(pathChunk in node)) {
          node[pathChunk] = {};
        }
        node = node[pathChunk];
      } else {
        const rawValue = row[columnIndex];
        const value = node[pathChunk] = rawValue === null ? null : decoder2.mapFromDriverValue(rawValue);
        if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
          const objectName = path[0];
          if (!(objectName in nullifyMap)) {
            nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
          } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
            nullifyMap[objectName] = false;
          }
        }
      }
    }
    return result2;
  }, {});
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name2, field]) => {
    if (typeof name2 !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name2] : [name2];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
function mapUpdateSet(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name2 of Object.getOwnPropertyNames(extendedClass.prototype)) {
      Object.defineProperty(baseClass.prototype, name2, Object.getOwnPropertyDescriptor(extendedClass.prototype, name2) || /* @__PURE__ */ Object.create(null));
    }
  }
}
function getTableColumns(table) {
  return table[Table.Symbol.Columns];
}
function getTableLikeName(table) {
  return is(table, Subquery) ? table[SubqueryConfig].alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
function iife(fn, ...args) {
  return fn(...args);
}
var TableName = Symbol.for("drizzle:Name");
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
  static [entityKind] = "Table";
  /** @internal */
  static Symbol = {
    Name: TableName,
    Schema,
    OriginalName,
    Columns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [TableName];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName];
  /** @internal */
  [Schema];
  /** @internal */
  [Columns];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName];
  /** @internal */
  [IsAlias] = false;
  /** @internal */
  [ExtraConfigBuilder] = void 0;
  [IsDrizzleTable] = true;
  constructor(name2, schema, baseName) {
    this[TableName] = this[OriginalName] = name2;
    this[Schema] = schema;
    this[BaseName] = baseName;
  }
  getSQL() {
    return new SQL([this]);
  }
};
function isTable(table) {
  return typeof table === "object" && table !== null && IsDrizzleTable in table;
}
function getTableName(table) {
  return table[TableName];
}
var QueryPromise = class {
  static [entityKind] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then((value) => {
      onFinally?.();
      return value;
    }, (reason) => {
      onFinally?.();
      throw reason;
    });
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
};
var tracer = {
  startActiveSpan(name2, fn) {
    {
      return fn();
    }
  }
};
var DrizzleError = class _DrizzleError extends Error {
  static [entityKind] = "DrizzleError";
  constructor(message) {
    super(message);
    this.name = "DrizzleError";
  }
  static wrap(error, message) {
    return error instanceof Error ? new _DrizzleError(message ? `${message}: ${error.message}` : error.message) : new _DrizzleError(message ?? String(error));
  }
};
var TransactionRollbackError = class extends DrizzleError {
  static [entityKind] = "TransactionRollbackError";
  constructor() {
    super("Rollback");
  }
};
var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
var PgTable = class extends Table {
  static [entityKind] = "PgTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys
  });
  /**@internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
};
function pgTableWithSchema(name2, columns, extraConfig, schema, baseName = name2) {
  const rawTable = new PgTable(name2, schema, baseName);
  const builtColumns = Object.fromEntries(Object.entries(columns).map(([name3, colBuilderBase]) => {
    const colBuilder = colBuilderBase;
    const column = colBuilder.build(rawTable);
    rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
    return [name3, column];
  }));
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  if (extraConfig) {
    table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
var pgTable = (name2, columns, extraConfig) => {
  return pgTableWithSchema(name2, columns, extraConfig, void 0);
};
var CheckBuilder = class {
  name;
  value;
  static [entityKind] = "PgCheckBuilder";
  brand;
  constructor(name2, value) {
    this.name = name2;
    this.value = value;
  }
  /** @internal */
  build(table) {
    return new Check(table, this);
  }
};
var Check = class {
  table;
  static [entityKind] = "PgCheck";
  name;
  value;
  constructor(table, builder) {
    this.table = table;
    this.name = builder.name;
    this.value = builder.value;
  }
};
var ForeignKeyBuilder = class {
  static [entityKind] = "PgForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate = "no action";
  /** @internal */
  _onDelete = "no action";
  constructor(config2, actions) {
    this.reference = () => {
      const { columns, foreignColumns } = config2();
      return { columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action === void 0 ? "no action" : action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action === void 0 ? "no action" : action;
    return this;
  }
  /** @internal */
  build(table) {
    return new ForeignKey(table, this);
  }
};
var ForeignKey = class {
  table;
  static [entityKind] = "PgForeignKey";
  reference;
  onUpdate;
  onDelete;
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  getName() {
    const { columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[PgTable.Symbol.Name],
      ...columnNames,
      foreignColumns[0].table[PgTable.Symbol.Name],
      ...foreignColumnNames
    ];
    return `${chunks.join("_")}_fk`;
  }
};
var IndexBuilderOn = class {
  unique;
  name;
  static [entityKind] = "PgIndexBuilderOn";
  constructor(unique2, name2) {
    this.unique = unique2;
    this.name = name2;
  }
  on(...columns) {
    return new IndexBuilder(columns, this.unique, false, this.name);
  }
  onOnly(...columns) {
    return new IndexBuilder(columns, this.unique, true, this.name);
  }
};
var IndexBuilder = class {
  static [entityKind] = "PgIndexBuilder";
  /** @internal */
  config;
  constructor(columns, unique2, only, name2) {
    this.config = {
      name: name2,
      columns,
      unique: unique2,
      only
    };
  }
  concurrently() {
    this.config.concurrently = true;
    return this;
  }
  using(method) {
    this.config.using = method;
    return this;
  }
  asc() {
    this.config.order = "asc";
    return this;
  }
  desc() {
    this.config.order = "desc";
    return this;
  }
  nullsFirst() {
    this.config.nulls = "first";
    return this;
  }
  nullsLast() {
    this.config.nulls = "last";
    return this;
  }
  where(condition) {
    this.config.where = condition;
    return this;
  }
  /** @internal */
  build(table) {
    return new Index(this.config, table);
  }
};
var Index = class {
  static [entityKind] = "PgIndex";
  config;
  constructor(config2, table) {
    this.config = { ...config2, table };
  }
};
var PrimaryKeyBuilder = class {
  static [entityKind] = "PgPrimaryKeyBuilder";
  /** @internal */
  columns;
  constructor(columns) {
    this.columns = columns;
  }
  /** @internal */
  build(table) {
    return new PrimaryKey(table, this.columns);
  }
};
var PrimaryKey = class {
  table;
  static [entityKind] = "PgPrimaryKey";
  columns;
  constructor(table, columns) {
    this.table = table;
    this.columns = columns;
  }
  getName() {
    return `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
};
function uniqueKeyName(table, columns) {
  return `${table[PgTable.Symbol.Name]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder = class {
  name;
  static [entityKind] = "PgUniqueConstraintBuilder";
  /** @internal */
  columns;
  /** @internal */
  nullsNotDistinctConfig = false;
  constructor(columns, name2) {
    this.name = name2;
    this.columns = columns;
  }
  nullsNotDistinct() {
    this.nullsNotDistinctConfig = true;
    return this;
  }
  /** @internal */
  build(table) {
    return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
  }
};
var UniqueOnConstraintBuilder = class {
  static [entityKind] = "PgUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name2) {
    this.name = name2;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
};
var UniqueConstraint = class {
  table;
  static [entityKind] = "PgUniqueConstraint";
  columns;
  name;
  nullsNotDistinct = false;
  constructor(table, columns, nullsNotDistinct, name2) {
    this.table = table;
    this.columns = columns;
    this.name = name2 ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
    this.nullsNotDistinct = nullsNotDistinct;
  }
  getName() {
    return this.name;
  }
};
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char = arrayString[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char === "," || char === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char = arrayString[i];
    if (char === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char === "\\") {
      i += 2;
      continue;
    }
    if (char === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char === "}") {
      return [result, i + 1];
    }
    if (char === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
function makePgArray(array) {
  return `{${array.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string" && item.includes(",")) {
      return `"${item.replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}
var ColumnBuilder = class {
  static [entityKind] = "ColumnBuilder";
  config;
  constructor(name2, dataType, columnType) {
    this.config = {
      name: name2,
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType,
      columnType
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    this.config.notNull = true;
    return this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $defaultFn}.
   */
  $default = this.$defaultFn;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
};
var PgColumnBuilder = class extends ColumnBuilder {
  foreignKeyConfigs = [];
  static [entityKind] = "PgColumnBuilder";
  array(size) {
    return new PgArrayBuilder(this.config.name, this, size);
  }
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name2, config2) {
    this.config.isUnique = true;
    this.config.uniqueName = name2;
    this.config.uniqueType = config2?.nulls;
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return iife((ref2, actions2) => {
        const builder = new ForeignKeyBuilder(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table);
      }, ref, actions);
    });
  }
};
var PgColumn = class extends Column {
  table;
  static [entityKind] = "PgColumn";
  constructor(table, config2) {
    if (!config2.uniqueName) {
      config2.uniqueName = uniqueKeyName(table, [config2.name]);
    }
    super(table, config2);
    this.table = table;
  }
};
var PgArrayBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgArrayBuilder";
  constructor(name2, baseBuilder, size) {
    super(name2, "array", "PgArray");
    this.config.baseBuilder = baseBuilder;
    this.config.size = size;
  }
  /** @internal */
  build(table) {
    const baseColumn = this.config.baseBuilder.build(table);
    return new PgArray(table, this.config, baseColumn);
  }
};
var PgArray = class _PgArray extends PgColumn {
  baseColumn;
  range;
  size;
  static [entityKind] = "PgArray";
  constructor(table, config2, baseColumn, range) {
    super(table, config2);
    this.baseColumn = baseColumn;
    this.range = range;
    this.size = config2.size;
  }
  getSQLType() {
    return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      value = parsePgArray(value);
    }
    return value.map((v) => this.baseColumn.mapFromDriverValue(v));
  }
  mapToDriverValue(value, isNestedArray = false) {
    const a = value.map((v) => v === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v));
    if (isNestedArray)
      return a;
    return makePgArray(a);
  }
};
var PgDateColumnBaseBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgDateColumnBaseBuilder";
  defaultNow() {
    return this.default(sql`now()`);
  }
};
var PgDateBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgDateBuilder";
  constructor(name2) {
    super(name2, "date", "PgDate");
  }
  /** @internal */
  build(table) {
    return new PgDate(table, this.config);
  }
};
var PgDate = class extends PgColumn {
  static [entityKind] = "PgDate";
  getSQLType() {
    return "date";
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
  mapToDriverValue(value) {
    return value.toISOString();
  }
};
var PgDateStringBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgDateStringBuilder";
  constructor(name2) {
    super(name2, "string", "PgDateString");
  }
  /** @internal */
  build(table) {
    return new PgDateString(table, this.config);
  }
};
var PgDateString = class extends PgColumn {
  static [entityKind] = "PgDateString";
  getSQLType() {
    return "date";
  }
};
var PgJsonBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgJsonBuilder";
  constructor(name2) {
    super(name2, "json", "PgJson");
  }
  /** @internal */
  build(table) {
    return new PgJson(table, this.config);
  }
};
var PgJson = class extends PgColumn {
  static [entityKind] = "PgJson";
  constructor(table, config2) {
    super(table, config2);
  }
  getSQLType() {
    return "json";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
};
var PgJsonbBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgJsonbBuilder";
  constructor(name2) {
    super(name2, "json", "PgJsonb");
  }
  /** @internal */
  build(table) {
    return new PgJsonb(table, this.config);
  }
};
var PgJsonb = class extends PgColumn {
  static [entityKind] = "PgJsonb";
  constructor(table, config2) {
    super(table, config2);
  }
  getSQLType() {
    return "jsonb";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
};
var PgNumericBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericBuilder";
  constructor(name2, precision, scale) {
    super(name2, "string", "PgNumeric");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  /** @internal */
  build(table) {
    return new PgNumeric(table, this.config);
  }
};
var PgNumeric = class extends PgColumn {
  static [entityKind] = "PgNumeric";
  precision;
  scale;
  constructor(table, config2) {
    super(table, config2);
    this.precision = config2.precision;
    this.scale = config2.scale;
  }
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `numeric(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "numeric";
    } else {
      return `numeric(${this.precision})`;
    }
  }
};
var PgTimeBuilder = class extends PgDateColumnBaseBuilder {
  withTimezone;
  precision;
  static [entityKind] = "PgTimeBuilder";
  constructor(name2, withTimezone, precision) {
    super(name2, "string", "PgTime");
    this.withTimezone = withTimezone;
    this.precision = precision;
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTime(table, this.config);
  }
};
var PgTime = class extends PgColumn {
  static [entityKind] = "PgTime";
  withTimezone;
  precision;
  constructor(table, config2) {
    super(table, config2);
    this.withTimezone = config2.withTimezone;
    this.precision = config2.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : `(${this.precision})`;
    return `time${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
};
var PgTimestampBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgTimestampBuilder";
  constructor(name2, withTimezone, precision) {
    super(name2, "date", "PgTimestamp");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTimestamp(table, this.config);
  }
};
var PgTimestamp = class extends PgColumn {
  static [entityKind] = "PgTimestamp";
  withTimezone;
  precision;
  constructor(table, config2) {
    super(table, config2);
    this.withTimezone = config2.withTimezone;
    this.precision = config2.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : ` (${this.precision})`;
    return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
  mapFromDriverValue = (value) => {
    return new Date(this.withTimezone ? value : value + "+0000");
  };
  mapToDriverValue = (value) => {
    return this.withTimezone ? value.toUTCString() : value.toISOString();
  };
};
var PgTimestampStringBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgTimestampStringBuilder";
  constructor(name2, withTimezone, precision) {
    super(name2, "string", "PgTimestampString");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTimestampString(table, this.config);
  }
};
var PgTimestampString = class extends PgColumn {
  static [entityKind] = "PgTimestampString";
  withTimezone;
  precision;
  constructor(table, config2) {
    super(table, config2);
    this.withTimezone = config2.withTimezone;
    this.precision = config2.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : `(${this.precision})`;
    return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
};
var PgUUIDBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgUUIDBuilder";
  constructor(name2) {
    super(name2, "string", "PgUUID");
  }
  /**
   * Adds `default gen_random_uuid()` to the column definition.
   */
  defaultRandom() {
    return this.default(sql`gen_random_uuid()`);
  }
  /** @internal */
  build(table) {
    return new PgUUID(table, this.config);
  }
};
var PgUUID = class extends PgColumn {
  static [entityKind] = "PgUUID";
  getSQLType() {
    return "uuid";
  }
};
var PgDialect = class {
  static [entityKind] = "PgDialect";
  async migrate(migrations, session) {
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at bigint
			)
		`;
    await session.execute(sql`CREATE SCHEMA IF NOT EXISTS "drizzle"`);
    await session.execute(migrationTableCreate);
    const dbMigrations = await session.all(sql`select id, hash, created_at from "drizzle"."__drizzle_migrations" order by created_at desc limit 1`);
    const lastDbMigration = dbMigrations[0];
    await session.transaction(async (tx) => {
      for await (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.execute(sql.raw(stmt));
          }
          await tx.execute(sql`insert into "drizzle"."__drizzle_migrations" ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`);
        }
      }
    });
  }
  escapeName(name2) {
    return `"${name2}"`;
  }
  escapeParam(num) {
    return `$${num + 1}`;
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildDeleteQuery({ table, where, returning }) {
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`delete from ${table}${whereSql}${returningSql}`;
  }
  buildUpdateSet(table, set) {
    const setEntries = Object.entries(set);
    const setSize = setEntries.length;
    return sql.join(setEntries.flatMap(([colName, value], i) => {
      const col = table[Table.Symbol.Columns][colName];
      const res = sql`${sql.identifier(col.name)} = ${value}`;
      if (i < setSize - 1) {
        return [res, sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning }) {
    const setSql = this.buildUpdateSet(table, set);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`update ${table} set ${setSql}${whereSql}${returningSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if (is(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is(field, SQL.Aliased) || is(field, SQL)) {
        const query = is(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(new SQL(query.queryChunks.map((c) => {
            if (is(c, PgColumn)) {
              return sql.identifier(c.name);
            }
            return c;
          })));
        } else {
          chunk.push(query);
        }
        if (is(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is(field, Column)) {
        if (isSingleTable) {
          chunk.push(sql.identifier(field.name));
        } else {
          chunk.push(field);
        }
      }
      if (i < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.join(chunks);
  }
  buildSelectQuery({ withList, fields, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, lockingClauses, distinct }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f of fieldsList) {
      if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table[SubqueryConfig].alias : is(table, PgViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins?.some(({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])))(f.field.table)) {
        const tableName = getTableName(f.field.table);
        throw new Error(`Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`);
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    let withSql;
    if (withList?.length) {
      const withSqlChunks = [sql`with `];
      for (const [i, w] of withList.entries()) {
        withSqlChunks.push(sql`${sql.identifier(w[SubqueryConfig].alias)} as (${w[SubqueryConfig].sql})`);
        if (i < withList.length - 1) {
          withSqlChunks.push(sql`, `);
        }
      }
      withSqlChunks.push(sql` `);
      withSql = sql.join(withSqlChunks);
    }
    let distinctSql;
    if (distinct) {
      distinctSql = distinct === true ? sql` distinct` : sql` distinct on (${sql.join(distinct.on, ", ")})`;
    }
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = (() => {
      if (is(table, Table) && table[Table.Symbol.OriginalName] !== table[Table.Symbol.Name]) {
        let fullName = sql`${sql.identifier(table[Table.Symbol.OriginalName])}`;
        if (table[Table.Symbol.Schema]) {
          fullName = sql`${sql.identifier(table[Table.Symbol.Schema])}.${fullName}`;
        }
        return sql`${fullName} ${sql.identifier(table[Table.Symbol.Name])}`;
      }
      return table;
    })();
    const joinsArray = [];
    if (joins) {
      for (const [index2, joinMeta] of joins.entries()) {
        if (index2 === 0) {
          joinsArray.push(sql` `);
        }
        const table2 = joinMeta.table;
        const lateralSql = joinMeta.lateral ? sql` lateral` : void 0;
        if (is(table2, PgTable)) {
          const tableName = table2[PgTable.Symbol.Name];
          const tableSchema = table2[PgTable.Symbol.Schema];
          const origTableName = table2[PgTable.Symbol.OriginalName];
          const alias = tableName === origTableName ? void 0 : joinMeta.alias;
          joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`);
        } else if (is(table2, View)) {
          const viewName = table2[ViewBaseConfig].name;
          const viewSchema = table2[ViewBaseConfig].schema;
          const origViewName = table2[ViewBaseConfig].originalName;
          const alias = viewName === origViewName ? void 0 : joinMeta.alias;
          joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${viewSchema ? sql`${sql.identifier(viewSchema)}.` : void 0}${sql.identifier(origViewName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`);
        } else {
          joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${table2} on ${joinMeta.on}`);
        }
        if (index2 < joins.length - 1) {
          joinsArray.push(sql` `);
        }
      }
    }
    const joinsSql = sql.join(joinsArray);
    const whereSql = where ? sql` where ${where}` : void 0;
    const havingSql = having ? sql` having ${having}` : void 0;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      orderBySql = sql` order by ${sql.join(orderBy, sql`, `)}`;
    }
    let groupBySql;
    if (groupBy && groupBy.length > 0) {
      groupBySql = sql` group by ${sql.join(groupBy, sql`, `)}`;
    }
    const limitSql = limit ? sql` limit ${limit}` : void 0;
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    const lockingClausesSql = sql.empty();
    if (lockingClauses) {
      for (const { strength, config: config2 } of lockingClauses) {
        const clauseSql = sql` for ${sql.raw(strength)}`;
        if (config2.of) {
          clauseSql.append(sql` of ${config2.of}`);
        }
        if (config2.noWait) {
          clauseSql.append(sql` no wait`);
        } else if (config2.skipLocked) {
          clauseSql.append(sql` skip locked`);
        }
        lockingClausesSql.append(clauseSql);
      }
    }
    return sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClausesSql}`;
  }
  buildInsertQuery({ table, values, onConflict, returning }) {
    const valuesSqlList = [];
    const columns = table[Table.Symbol.Columns];
    const colEntries = Object.entries(columns);
    const insertOrder = colEntries.map(([, column]) => sql.identifier(column.name));
    for (const [valueIndex, value] of values.entries()) {
      const valueList = [];
      for (const [fieldName, col] of colEntries) {
        const colValue = value[fieldName];
        if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
          if (col.defaultFn !== void 0) {
            const defaultFnResult = col.defaultFn();
            const defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
            valueList.push(defaultValue);
          } else {
            valueList.push(sql`default`);
          }
        } else {
          valueList.push(colValue);
        }
      }
      valuesSqlList.push(valueList);
      if (valueIndex < values.length - 1) {
        valuesSqlList.push(sql`, `);
      }
    }
    const valuesSql = sql.join(valuesSqlList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const onConflictSql = onConflict ? sql` on conflict ${onConflict}` : void 0;
    return sql`insert into ${table} ${insertOrder} values ${valuesSql}${onConflictSql}${returningSql}`;
  }
  buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }) {
    const concurrentlySql = concurrently ? sql` concurrently` : void 0;
    const withNoDataSql = withNoData ? sql` with no data` : void 0;
    return sql`refresh materialized view${concurrentlySql} ${view}${withNoDataSql}`;
  }
  prepareTyping(encoder) {
    if (is(encoder, PgJsonb) || is(encoder, PgJson)) {
      return "json";
    } else if (is(encoder, PgNumeric)) {
      return "decimal";
    } else if (is(encoder, PgTime)) {
      return "time";
    } else if (is(encoder, PgTimestamp)) {
      return "timestamp";
    } else if (is(encoder, PgDate)) {
      return "date";
    } else if (is(encoder, PgUUID)) {
      return "uuid";
    } else {
      return "none";
    }
  }
  sqlToQuery(sql2) {
    return sql2.toQuery({
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      prepareTyping: this.prepareTyping
    });
  }
  // buildRelationalQueryWithPK({
  // 	fullSchema,
  // 	schema,
  // 	tableNamesMap,
  // 	table,
  // 	tableConfig,
  // 	queryConfig: config,
  // 	tableAlias,
  // 	isRoot = false,
  // 	joinOn,
  // }: {
  // 	fullSchema: Record<string, unknown>;
  // 	schema: TablesRelationalConfig;
  // 	tableNamesMap: Record<string, string>;
  // 	table: PgTable;
  // 	tableConfig: TableRelationalConfig;
  // 	queryConfig: true | DBQueryConfig<'many', true>;
  // 	tableAlias: string;
  // 	isRoot?: boolean;
  // 	joinOn?: SQL;
  // }): BuildRelationalQueryResult<PgTable, PgColumn> {
  // 	// For { "<relation>": true }, return a table with selection of all columns
  // 	if (config === true) {
  // 		const selectionEntries = Object.entries(tableConfig.columns);
  // 		const selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = selectionEntries.map((
  // 			[key, value],
  // 		) => ({
  // 			dbKey: value.name,
  // 			tsKey: key,
  // 			field: value as PgColumn,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 		return {
  // 			tableTsKey: tableConfig.tsName,
  // 			sql: table,
  // 			selection,
  // 		};
  // 	}
  // 	// let selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = [];
  // 	// let selectionForBuild = selection;
  // 	const aliasedColumns = Object.fromEntries(
  // 		Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)]),
  // 	);
  // 	const aliasedRelations = Object.fromEntries(
  // 		Object.entries(tableConfig.relations).map(([key, value]) => [key, aliasedRelation(value, tableAlias)]),
  // 	);
  // 	const aliasedFields = Object.assign({}, aliasedColumns, aliasedRelations);
  // 	let where, hasUserDefinedWhere;
  // 	if (config.where) {
  // 		const whereSql = typeof config.where === 'function' ? config.where(aliasedFields, operators) : config.where;
  // 		where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
  // 		hasUserDefinedWhere = !!where;
  // 	}
  // 	where = and(joinOn, where);
  // 	// const fieldsSelection: { tsKey: string; value: PgColumn | SQL.Aliased; isExtra?: boolean }[] = [];
  // 	let joins: Join[] = [];
  // 	let selectedColumns: string[] = [];
  // 	// Figure out which columns to select
  // 	if (config.columns) {
  // 		let isIncludeMode = false;
  // 		for (const [field, value] of Object.entries(config.columns)) {
  // 			if (value === undefined) {
  // 				continue;
  // 			}
  // 			if (field in tableConfig.columns) {
  // 				if (!isIncludeMode && value === true) {
  // 					isIncludeMode = true;
  // 				}
  // 				selectedColumns.push(field);
  // 			}
  // 		}
  // 		if (selectedColumns.length > 0) {
  // 			selectedColumns = isIncludeMode
  // 				? selectedColumns.filter((c) => config.columns?.[c] === true)
  // 				: Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
  // 		}
  // 	} else {
  // 		// Select all columns if selection is not specified
  // 		selectedColumns = Object.keys(tableConfig.columns);
  // 	}
  // 	// for (const field of selectedColumns) {
  // 	// 	const column = tableConfig.columns[field]! as PgColumn;
  // 	// 	fieldsSelection.push({ tsKey: field, value: column });
  // 	// }
  // 	let initiallySelectedRelations: {
  // 		tsKey: string;
  // 		queryConfig: true | DBQueryConfig<'many', false>;
  // 		relation: Relation;
  // 	}[] = [];
  // 	// let selectedRelations: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = [];
  // 	// Figure out which relations to select
  // 	if (config.with) {
  // 		initiallySelectedRelations = Object.entries(config.with)
  // 			.filter((entry): entry is [typeof entry[0], NonNullable<typeof entry[1]>] => !!entry[1])
  // 			.map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey]! }));
  // 	}
  // 	const manyRelations = initiallySelectedRelations.filter((r) =>
  // 		is(r.relation, Many)
  // 		&& (schema[tableNamesMap[r.relation.referencedTable[Table.Symbol.Name]]!]?.primaryKey.length ?? 0) > 0
  // 	);
  // 	// If this is the last Many relation (or there are no Many relations), we are on the innermost subquery level
  // 	const isInnermostQuery = manyRelations.length < 2;
  // 	const selectedExtras: {
  // 		tsKey: string;
  // 		value: SQL.Aliased;
  // 	}[] = [];
  // 	// Figure out which extras to select
  // 	if (isInnermostQuery && config.extras) {
  // 		const extras = typeof config.extras === 'function'
  // 			? config.extras(aliasedFields, { sql })
  // 			: config.extras;
  // 		for (const [tsKey, value] of Object.entries(extras)) {
  // 			selectedExtras.push({
  // 				tsKey,
  // 				value: mapColumnsInAliasedSQLToAlias(value, tableAlias),
  // 			});
  // 		}
  // 	}
  // 	// Transform `fieldsSelection` into `selection`
  // 	// `fieldsSelection` shouldn't be used after this point
  // 	// for (const { tsKey, value, isExtra } of fieldsSelection) {
  // 	// 	selection.push({
  // 	// 		dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey]!.name,
  // 	// 		tsKey,
  // 	// 		field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
  // 	// 		relationTableTsKey: undefined,
  // 	// 		isJson: false,
  // 	// 		isExtra,
  // 	// 		selection: [],
  // 	// 	});
  // 	// }
  // 	let orderByOrig = typeof config.orderBy === 'function'
  // 		? config.orderBy(aliasedFields, orderByOperators)
  // 		: config.orderBy ?? [];
  // 	if (!Array.isArray(orderByOrig)) {
  // 		orderByOrig = [orderByOrig];
  // 	}
  // 	const orderBy = orderByOrig.map((orderByValue) => {
  // 		if (is(orderByValue, Column)) {
  // 			return aliasedTableColumn(orderByValue, tableAlias) as PgColumn;
  // 		}
  // 		return mapColumnsInSQLToAlias(orderByValue, tableAlias);
  // 	});
  // 	const limit = isInnermostQuery ? config.limit : undefined;
  // 	const offset = isInnermostQuery ? config.offset : undefined;
  // 	// For non-root queries without additional config except columns, return a table with selection
  // 	if (
  // 		!isRoot
  // 		&& initiallySelectedRelations.length === 0
  // 		&& selectedExtras.length === 0
  // 		&& !where
  // 		&& orderBy.length === 0
  // 		&& limit === undefined
  // 		&& offset === undefined
  // 	) {
  // 		return {
  // 			tableTsKey: tableConfig.tsName,
  // 			sql: table,
  // 			selection: selectedColumns.map((key) => ({
  // 				dbKey: tableConfig.columns[key]!.name,
  // 				tsKey: key,
  // 				field: tableConfig.columns[key] as PgColumn,
  // 				relationTableTsKey: undefined,
  // 				isJson: false,
  // 				selection: [],
  // 			})),
  // 		};
  // 	}
  // 	const selectedRelationsWithoutPK:
  // 	// Process all relations without primary keys, because they need to be joined differently and will all be on the same query level
  // 	for (
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationConfigValue,
  // 			relation,
  // 		} of initiallySelectedRelations
  // 	) {
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTable = schema[relationTableTsName]!;
  // 		if (relationTable.primaryKey.length > 0) {
  // 			continue;
  // 		}
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelation = this.buildRelationalQueryWithoutPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationConfigValue,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 			nestedQueryRelation: relation,
  // 		});
  // 		const field = sql`${sql.identifier(relationTableAlias)}.${sql.identifier('data')}`.as(selectedRelationTsKey);
  // 		joins.push({
  // 			on: sql`true`,
  // 			table: new Subquery(builtRelation.sql as SQL, {}, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: true,
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelation.selection,
  // 		});
  // 	}
  // 	const oneRelations = initiallySelectedRelations.filter((r): r is typeof r & { relation: One } =>
  // 		is(r.relation, One)
  // 	);
  // 	// Process all One relations with PKs, because they can all be joined on the same level
  // 	for (
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationConfigValue,
  // 			relation,
  // 		} of oneRelations
  // 	) {
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const relationTable = schema[relationTableTsName]!;
  // 		if (relationTable.primaryKey.length === 0) {
  // 			continue;
  // 		}
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelation = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationConfigValue,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 		});
  // 		const field = sql`case when ${sql.identifier(relationTableAlias)} is null then null else json_build_array(${
  // 			sql.join(
  // 				builtRelation.selection.map(({ field }) =>
  // 					is(field, SQL.Aliased)
  // 						? sql`${sql.identifier(relationTableAlias)}.${sql.identifier(field.fieldAlias)}`
  // 						: is(field, Column)
  // 						? aliasedTableColumn(field, relationTableAlias)
  // 						: field
  // 				),
  // 				sql`, `,
  // 			)
  // 		}) end`.as(selectedRelationTsKey);
  // 		const isLateralJoin = is(builtRelation.sql, SQL);
  // 		joins.push({
  // 			on: isLateralJoin ? sql`true` : joinOn,
  // 			table: is(builtRelation.sql, SQL)
  // 				? new Subquery(builtRelation.sql, {}, relationTableAlias)
  // 				: aliasedTable(builtRelation.sql, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: is(builtRelation.sql, SQL),
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelation.selection,
  // 		});
  // 	}
  // 	let distinct: PgSelectConfig['distinct'];
  // 	let tableFrom: PgTable | Subquery = table;
  // 	// Process first Many relation - each one requires a nested subquery
  // 	const manyRelation = manyRelations[0];
  // 	if (manyRelation) {
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationQueryConfig,
  // 			relation,
  // 		} = manyRelation;
  // 		distinct = {
  // 			on: tableConfig.primaryKey.map((c) => aliasedTableColumn(c as PgColumn, tableAlias)),
  // 		};
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelationJoin = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationQueryConfig,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 		});
  // 		const builtRelationSelectionField = sql`case when ${
  // 			sql.identifier(relationTableAlias)
  // 		} is null then '[]' else json_agg(json_build_array(${
  // 			sql.join(
  // 				builtRelationJoin.selection.map(({ field }) =>
  // 					is(field, SQL.Aliased)
  // 						? sql`${sql.identifier(relationTableAlias)}.${sql.identifier(field.fieldAlias)}`
  // 						: is(field, Column)
  // 						? aliasedTableColumn(field, relationTableAlias)
  // 						: field
  // 				),
  // 				sql`, `,
  // 			)
  // 		})) over (partition by ${sql.join(distinct.on, sql`, `)}) end`.as(selectedRelationTsKey);
  // 		const isLateralJoin = is(builtRelationJoin.sql, SQL);
  // 		joins.push({
  // 			on: isLateralJoin ? sql`true` : joinOn,
  // 			table: isLateralJoin
  // 				? new Subquery(builtRelationJoin.sql as SQL, {}, relationTableAlias)
  // 				: aliasedTable(builtRelationJoin.sql as PgTable, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: isLateralJoin,
  // 		});
  // 		// Build the "from" subquery with the remaining Many relations
  // 		const builtTableFrom = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table,
  // 			tableConfig,
  // 			queryConfig: {
  // 				...config,
  // 				where: undefined,
  // 				orderBy: undefined,
  // 				limit: undefined,
  // 				offset: undefined,
  // 				with: manyRelations.slice(1).reduce<NonNullable<typeof config['with']>>(
  // 					(result, { tsKey, queryConfig: configValue }) => {
  // 						result[tsKey] = configValue;
  // 						return result;
  // 					},
  // 					{},
  // 				),
  // 			},
  // 			tableAlias,
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field: builtRelationSelectionField,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelationJoin.selection,
  // 		});
  // 		// selection = builtTableFrom.selection.map((item) =>
  // 		// 	is(item.field, SQL.Aliased)
  // 		// 		? { ...item, field: sql`${sql.identifier(tableAlias)}.${sql.identifier(item.field.fieldAlias)}` }
  // 		// 		: item
  // 		// );
  // 		// selectionForBuild = [{
  // 		// 	dbKey: '*',
  // 		// 	tsKey: '*',
  // 		// 	field: sql`${sql.identifier(tableAlias)}.*`,
  // 		// 	selection: [],
  // 		// 	isJson: false,
  // 		// 	relationTableTsKey: undefined,
  // 		// }];
  // 		// const newSelectionItem: (typeof selection)[number] = {
  // 		// 	dbKey: selectedRelationTsKey,
  // 		// 	tsKey: selectedRelationTsKey,
  // 		// 	field,
  // 		// 	relationTableTsKey: relationTableTsName,
  // 		// 	isJson: true,
  // 		// 	selection: builtRelationJoin.selection,
  // 		// };
  // 		// selection.push(newSelectionItem);
  // 		// selectionForBuild.push(newSelectionItem);
  // 		tableFrom = is(builtTableFrom.sql, PgTable)
  // 			? builtTableFrom.sql
  // 			: new Subquery(builtTableFrom.sql, {}, tableAlias);
  // 	}
  // 	if (selectedColumns.length === 0 && selectedRelations.length === 0 && selectedExtras.length === 0) {
  // 		throw new DrizzleError(`No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")`);
  // 	}
  // 	let selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'];
  // 	function prepareSelectedColumns() {
  // 		return selectedColumns.map((key) => ({
  // 			dbKey: tableConfig.columns[key]!.name,
  // 			tsKey: key,
  // 			field: tableConfig.columns[key] as PgColumn,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 	}
  // 	function prepareSelectedExtras() {
  // 		return selectedExtras.map((item) => ({
  // 			dbKey: item.value.fieldAlias,
  // 			tsKey: item.tsKey,
  // 			field: item.value,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 	}
  // 	if (isRoot) {
  // 		selection = [
  // 			...prepareSelectedColumns(),
  // 			...prepareSelectedExtras(),
  // 		];
  // 	}
  // 	if (hasUserDefinedWhere || orderBy.length > 0) {
  // 		tableFrom = new Subquery(
  // 			this.buildSelectQuery({
  // 				table: is(tableFrom, PgTable) ? aliasedTable(tableFrom, tableAlias) : tableFrom,
  // 				fields: {},
  // 				fieldsFlat: selectionForBuild.map(({ field }) => ({
  // 					path: [],
  // 					field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field,
  // 				})),
  // 				joins,
  // 				distinct,
  // 			}),
  // 			{},
  // 			tableAlias,
  // 		);
  // 		selectionForBuild = selection.map((item) =>
  // 			is(item.field, SQL.Aliased)
  // 				? { ...item, field: sql`${sql.identifier(tableAlias)}.${sql.identifier(item.field.fieldAlias)}` }
  // 				: item
  // 		);
  // 		joins = [];
  // 		distinct = undefined;
  // 	}
  // 	const result = this.buildSelectQuery({
  // 		table: is(tableFrom, PgTable) ? aliasedTable(tableFrom, tableAlias) : tableFrom,
  // 		fields: {},
  // 		fieldsFlat: selectionForBuild.map(({ field }) => ({
  // 			path: [],
  // 			field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field,
  // 		})),
  // 		where,
  // 		limit,
  // 		offset,
  // 		joins,
  // 		orderBy,
  // 		distinct,
  // 	});
  // 	return {
  // 		tableTsKey: tableConfig.tsName,
  // 		sql: result,
  // 		selection,
  // 	};
  // }
  buildRelationalQueryWithoutPK({ fullSchema, schema, tableNamesMap, table, tableConfig, queryConfig: config2, tableAlias, nestedQueryRelation, joinOn }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    const joins = [];
    if (config2 === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)]));
      if (config2.where) {
        const whereSql = typeof config2.where === "function" ? config2.where(aliasedColumns, getOperators()) : config2.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config2.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config2.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config2.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config2.with) {
        selectedRelations = Object.entries(config2.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config2.extras) {
        extras = typeof config2.extras === "function" ? config2.extras(aliasedColumns, { sql }) : config2.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config2.orderBy === "function" ? config2.orderBy(aliasedColumns, getOrderByOperators()) : config2.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config2.limit;
      offset = config2.offset;
      for (const { tsKey: selectedRelationTsKey, queryConfig: selectedRelationConfigValue, relation } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
        const relationTableName = relation.referencedTable[Table.Symbol.Name];
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(...normalizedRelation.fields.map((field2, i) => eq(aliasedTableColumn(normalizedRelation.references[i], relationTableAlias), aliasedTableColumn(field2, tableAlias))));
        const builtRelation = this.buildRelationalQueryWithoutPK({
          fullSchema,
          schema,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = sql`${sql.identifier(relationTableAlias)}.${sql.identifier("data")}`.as(selectedRelationTsKey);
        joins.push({
          on: sql`true`,
          table: new Subquery(builtRelation.sql, {}, relationTableAlias),
          alias: relationTableAlias,
          joinType: "left",
          lateral: true
        });
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError(`No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")`);
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_build_array(${sql.join(selection.map(({ field: field2, tsKey, isJson }) => isJson ? sql`${sql.identifier(`${tableAlias}_${tsKey}`)}.${sql.identifier("data")}` : is(field2, SQL.Aliased) ? field2.sql : field2), sql`, `)})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`coalesce(json_agg(${field}${orderBy.length > 0 ? sql` order by ${sql.join(orderBy, sql`, `)}` : void 0}), '[]'::json)`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table, tableAlias),
          fields: {},
          fieldsFlat: [{
            path: [],
            field: sql.raw("*")
          }],
          where,
          limit,
          offset,
          orderBy
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = [];
      } else {
        result = aliasedTable(table, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, PgTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
};
var TypedQueryBuilder = class {
  static [entityKind] = "TypedQueryBuilder";
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
};
var PgSelectBuilder = class {
  static [entityKind] = "PgSelectBuilder";
  fields;
  session;
  dialect;
  withList = [];
  distinct;
  constructor(config2) {
    this.fields = config2.fields;
    this.session = config2.session;
    this.dialect = config2.dialect;
    if (config2.withList) {
      this.withList = config2.withList;
    }
    this.distinct = config2.distinct;
  }
  /**
   * Specify the table, subquery, or other target that you're
   * building a select query against.
   *
   * {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM|Postgres from documentation}
   */
  from(source) {
    const isPartialSelect = !!this.fields;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is(source, Subquery)) {
      fields = Object.fromEntries(Object.keys(source[SubqueryConfig].selection).map((key) => [key, source[key]]));
    } else if (is(source, PgViewBase)) {
      fields = source[ViewBaseConfig].selectedFields;
    } else if (is(source, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(source);
    }
    return new PgSelect({
      table: source,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
};
var PgSelectQueryBuilder = class extends TypedQueryBuilder {
  static [entityKind] = "PgSelectQueryBuilder";
  _;
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table,
      fields: { ...fields },
      distinct
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields
    };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  createJoin(joinType) {
    return (table, on) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is(table, SQL)) {
          const selection = is(table, Subquery) ? table[SubqueryConfig].selection : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on === "function") {
        on = on(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
      }
      if (!this.config.joins) {
        this.config.joins = [];
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  /**
   * For each row of the table, include
   * values from a matching row of the joined
   * table, if there is a matching row. If not,
   * all of the columns of the joined table
   * will be set to null.
   */
  leftJoin = this.createJoin("left");
  /**
   * Includes all of the rows of the joined table.
   * If there is no matching row in the main table,
   * all the columns of the main table will be
   * set to null.
   */
  rightJoin = this.createJoin("right");
  /**
   * This is the default type of join.
   *
   * For each row of the table, the joined table
   * needs to have a matching row, or it will
   * be excluded from results.
   */
  innerJoin = this.createJoin("inner");
  /**
   * Rows from both the main & joined are included,
   * regardless of whether or not they have matching
   * rows in the other table.
   */
  fullJoin = this.createJoin("full");
  /**
   * Specify a condition to narrow the result set. Multiple
   * conditions can be combined with the `and` and `or`
   * functions.
   *
   * ## Examples
   *
   * ```ts
   * // Find cars made in the year 2000
   * db.select().from(cars).where(eq(cars.year, 2000));
   * ```
   */
  where(where) {
    if (typeof where === "function") {
      where = where(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
    }
    this.config.where = where;
    return this;
  }
  /**
   * Sets the HAVING clause of this query, which often
   * used with GROUP BY and filters rows after they've been
   * grouped together and combined.
   *
   * {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-HAVING|Postgres having clause documentation}
   */
  having(having) {
    if (typeof having === "function") {
      having = having(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
      this.config.orderBy = Array.isArray(orderBy) ? orderBy : [orderBy];
    } else {
      this.config.orderBy = columns;
    }
    return this;
  }
  /**
   * Set the maximum number of rows that will be
   * returned by this query.
   *
   * ## Examples
   *
   * ```ts
   * // Get the first 10 people from this query.
   * db.select().from(people).limit(10);
   * ```
   *
   * {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-LIMIT|Postgres LIMIT documentation}
   */
  limit(limit) {
    this.config.limit = limit;
    return this;
  }
  /**
   * Skip a number of rows when returning results
   * from this query.
   *
   * ## Examples
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(offset) {
    this.config.offset = offset;
    return this;
  }
  /**
   * The FOR clause specifies a lock strength for this query
   * that controls how strictly it acquires exclusive access to
   * the rows being queried.
   *
   * {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE|Postgres locking clause documentation}
   */
  for(strength, config2 = {}) {
    if (!this.config.lockingClauses) {
      this.config.lockingClauses = [];
    }
    this.config.lockingClauses.push({ strength, config: config2 });
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    return new Proxy(new Subquery(this.getSQL(), this.config.fields, alias), new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
  }
};
var PgSelect = class extends PgSelectQueryBuilder {
  static [entityKind] = "PgSelect";
  _prepare(name2) {
    const { session, config: config2, dialect, joinsNotNullableMap } = this;
    if (!session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const fieldsList = orderSelectedFields(config2.fields);
      const query = session.prepareQuery(dialect.sqlToQuery(this.getSQL()), fieldsList, name2);
      query.joinsNotNullableMap = joinsNotNullableMap;
      return query;
    });
  }
  /**
   * Create a prepared statement for this query. This allows
   * the database to remember this query for the given session
   * and call it by name, rather than specifying the full query.
   *
   * {@link https://www.postgresql.org/docs/current/sql-prepare.html|Postgres prepare documentation}
   */
  prepare(name2) {
    return this._prepare(name2);
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues);
    });
  };
};
applyMixins(PgSelect, [QueryPromise]);
var QueryBuilder = class {
  static [entityKind] = "PgQueryBuilder";
  dialect;
  $with(alias) {
    const queryBuilder = this;
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(queryBuilder);
        }
        return new Proxy(new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true), new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
      }
    };
  }
  with(...queries) {
    const self = this;
    function select(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        distinct: true
      });
    }
    function selectDistinctOn(on, fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        distinct: { on }
      });
    }
    return { select, selectDistinct, selectDistinctOn };
  }
  select(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect()
    });
  }
  selectDistinct(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  selectDistinctOn(on, fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: { on }
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new PgDialect();
    }
    return this.dialect;
  }
};
var DefaultViewBuilderCore = class {
  name;
  schema;
  static [entityKind] = "PgDefaultViewBuilderCore";
  constructor(name2, schema) {
    this.name = name2;
    this.schema = schema;
  }
  config = {};
  with(config2) {
    this.config.with = config2;
    return this;
  }
};
var ViewBuilder = class extends DefaultViewBuilderCore {
  static [entityKind] = "PgViewBuilder";
  as(qb) {
    if (typeof qb === "function") {
      qb = qb(new QueryBuilder());
    }
    const selectionProxy = new SelectionProxyHandler({
      alias: this.name,
      sqlBehavior: "error",
      sqlAliasedBehavior: "alias",
      replaceOriginalName: true
    });
    const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
    return new Proxy(new PgView({
      pgConfig: this.config,
      config: {
        name: this.name,
        schema: this.schema,
        selectedFields: aliasedSelection,
        query: qb.getSQL().inlineParams()
      }
    }), selectionProxy);
  }
};
var ManualViewBuilder = class extends DefaultViewBuilderCore {
  static [entityKind] = "PgManualViewBuilder";
  columns;
  constructor(name2, columns, schema) {
    super(name2, schema);
    this.columns = getTableColumns(pgTable(name2, columns));
  }
  existing() {
    return new Proxy(new PgView({
      pgConfig: void 0,
      config: {
        name: this.name,
        schema: this.schema,
        selectedFields: this.columns,
        query: void 0
      }
    }), new SelectionProxyHandler({
      alias: this.name,
      sqlBehavior: "error",
      sqlAliasedBehavior: "alias",
      replaceOriginalName: true
    }));
  }
  as(query) {
    return new Proxy(new PgView({
      pgConfig: this.config,
      config: {
        name: this.name,
        schema: this.schema,
        selectedFields: this.columns,
        query: query.inlineParams()
      }
    }), new SelectionProxyHandler({
      alias: this.name,
      sqlBehavior: "error",
      sqlAliasedBehavior: "alias",
      replaceOriginalName: true
    }));
  }
};
var MaterializedViewBuilderCore = class {
  name;
  schema;
  static [entityKind] = "PgMaterializedViewBuilderCore";
  constructor(name2, schema) {
    this.name = name2;
    this.schema = schema;
  }
  config = {};
  using(using) {
    this.config.using = using;
    return this;
  }
  with(config2) {
    this.config.with = config2;
    return this;
  }
  tablespace(tablespace) {
    this.config.tablespace = tablespace;
    return this;
  }
  withNoData() {
    this.config.withNoData = true;
    return this;
  }
};
var MaterializedViewBuilder = class extends MaterializedViewBuilderCore {
  static [entityKind] = "PgMaterializedViewBuilder";
  as(qb) {
    if (typeof qb === "function") {
      qb = qb(new QueryBuilder());
    }
    const selectionProxy = new SelectionProxyHandler({
      alias: this.name,
      sqlBehavior: "error",
      sqlAliasedBehavior: "alias",
      replaceOriginalName: true
    });
    const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
    return new Proxy(new PgMaterializedView({
      pgConfig: {
        with: this.config.with,
        using: this.config.using,
        tablespace: this.config.tablespace,
        withNoData: this.config.withNoData
      },
      config: {
        name: this.name,
        schema: this.schema,
        selectedFields: aliasedSelection,
        query: qb.getSQL().inlineParams()
      }
    }), selectionProxy);
  }
};
var ManualMaterializedViewBuilder = class extends MaterializedViewBuilderCore {
  static [entityKind] = "PgManualMaterializedViewBuilder";
  columns;
  constructor(name2, columns, schema) {
    super(name2, schema);
    this.columns = getTableColumns(pgTable(name2, columns));
  }
  existing() {
    return new Proxy(new PgMaterializedView({
      pgConfig: void 0,
      config: {
        name: this.name,
        schema: this.schema,
        selectedFields: this.columns,
        query: void 0
      }
    }), new SelectionProxyHandler({
      alias: this.name,
      sqlBehavior: "error",
      sqlAliasedBehavior: "alias",
      replaceOriginalName: true
    }));
  }
  as(query) {
    return new Proxy(new PgMaterializedView({
      pgConfig: void 0,
      config: {
        name: this.name,
        schema: this.schema,
        selectedFields: this.columns,
        query: query.inlineParams()
      }
    }), new SelectionProxyHandler({
      alias: this.name,
      sqlBehavior: "error",
      sqlAliasedBehavior: "alias",
      replaceOriginalName: true
    }));
  }
};
var PgViewBase = class extends View {
  static [entityKind] = "PgViewBase";
};
var PgViewConfig = Symbol.for("drizzle:PgViewConfig");
var PgView = class extends PgViewBase {
  static [entityKind] = "PgView";
  [PgViewConfig];
  constructor({ pgConfig, config: config2 }) {
    super(config2);
    if (pgConfig) {
      this[PgViewConfig] = {
        with: pgConfig.with
      };
    }
  }
};
var PgMaterializedViewConfig = Symbol.for("drizzle:PgMaterializedViewConfig");
var PgMaterializedView = class extends PgViewBase {
  static [entityKind] = "PgMaterializedView";
  [PgMaterializedViewConfig];
  constructor({ pgConfig, config: config2 }) {
    super(config2);
    this[PgMaterializedViewConfig] = {
      with: pgConfig?.with,
      using: pgConfig?.using,
      tablespace: pgConfig?.tablespace,
      withNoData: pgConfig?.withNoData
    };
  }
};
var Relation = class {
  sourceTable;
  referencedTable;
  relationName;
  static [entityKind] = "Relation";
  referencedTableName;
  fieldName;
  constructor(sourceTable, referencedTable, relationName) {
    this.sourceTable = sourceTable;
    this.referencedTable = referencedTable;
    this.relationName = relationName;
    this.referencedTableName = referencedTable[Table.Symbol.Name];
  }
};
var Relations = class {
  table;
  config;
  static [entityKind] = "Relations";
  constructor(table, config2) {
    this.table = table;
    this.config = config2;
  }
};
var One = class _One extends Relation {
  config;
  isNullable;
  static [entityKind] = "One";
  constructor(sourceTable, referencedTable, config2, isNullable) {
    super(sourceTable, referencedTable, config2?.relationName);
    this.config = config2;
    this.isNullable = isNullable;
  }
  withFieldName(fieldName) {
    const relation = new _One(this.sourceTable, this.referencedTable, this.config, this.isNullable);
    relation.fieldName = fieldName;
    return relation;
  }
};
var Many = class _Many extends Relation {
  config;
  static [entityKind] = "Many";
  constructor(sourceTable, referencedTable, config2) {
    super(sourceTable, referencedTable, config2?.relationName);
    this.config = config2;
  }
  withFieldName(fieldName) {
    const relation = new _Many(this.sourceTable, this.referencedTable, this.config);
    relation.fieldName = fieldName;
    return relation;
  }
};
function getOperators() {
  return {
    sql,
    eq,
    and,
    or
  };
}
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
function extractTablesRelationalConfig(schema, configHelpers) {
  if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) {
    schema = schema["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema)) {
    if (isTable(value)) {
      const dbName = value[Table.Symbol.Name];
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(value[Table.Symbol.Columns])) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = value.table[Table.Symbol.Name];
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(configHelpers(value.table));
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
function relations(table, relations2) {
  return new Relations(table, (helpers) => Object.fromEntries(Object.entries(relations2(helpers)).map(([key, value]) => [key, value.withFieldName(key)])));
}
function createOne(sourceTable) {
  return function one(table, config2) {
    return new One(sourceTable, table, config2, config2?.fields.reduce((res, f) => res && f.notNull, true) ?? false);
  };
}
function createMany(sourceTable) {
  return function many(referencedTable, config2) {
    return new Many(sourceTable, referencedTable, config2);
  };
}
function normalizeRelation(schema, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[relation.referencedTable[Table.Symbol.Name]];
  if (!referencedTableTsName) {
    throw new Error(`Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`);
  }
  const referencedTableConfig = schema[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[sourceTable[Table.Symbol.Name]];
  if (!sourceTableTsName) {
    throw new Error(`Table "${sourceTable[Table.Symbol.Name]}" not found in schema`);
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(referencedTableConfig.relations)) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(`There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`) : new Error(`There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`);
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(`There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`);
}
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [selectionItemIndex, selectionItem] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(tablesConfig, tablesConfig[selectionItem.relationTableTsKey], subRows, selectionItem.selection, mapColumnValue) : subRows.map((subRow) => mapRelationalRow(tablesConfig, tablesConfig[selectionItem.relationTableTsKey], subRow, selectionItem.selection, mapColumnValue));
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder2;
      if (is(field, Column)) {
        decoder2 = field;
      } else if (is(field, SQL)) {
        decoder2 = field.decoder;
      } else {
        decoder2 = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder2.mapFromDriverValue(value);
    }
  }
  return result;
}
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
var eq = (left, right) => {
  return sql`${left} = ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter((c) => c !== void 0);
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([new StringChunk("("), sql.join(conditions, new StringChunk(" and ")), new StringChunk(")")]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter((c) => c !== void 0);
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([new StringChunk("("), sql.join(conditions, new StringChunk(" or ")), new StringChunk(")")]);
}
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}
var FakePrimitiveParam = class {
  static [entityKind] = "FakePrimitiveParam";
};
function isSQLWrapper(value) {
  return typeof value === "object" && value !== null && "getSQL" in value && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      result.typings = result.typings || [];
      result.typings.push(...query.typings);
    }
  }
  return result;
}
var StringChunk = class {
  static [entityKind] = "StringChunk";
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
};
var SQL = class _SQL {
  queryChunks;
  static [entityKind] = "SQL";
  /** @internal */
  decoder = noopDecoder;
  shouldInlineParams = false;
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
  }
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config2) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config2);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config2 = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const { escapeName, escapeParam, prepareTyping, inlineParams, paramStartIndex } = config2;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === void 0) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p] of chunk.entries()) {
          result.push(p);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config2);
      }
      if (is(chunk, _SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config2,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === void 0 ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        return { sql: escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(chunk.name), params: [] };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === void 0 ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, _SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config2);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config2), params: [] };
        }
        let typings;
        if (prepareTyping !== void 0) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk] };
      }
      if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk[SubqueryConfig].isWith) {
          return { sql: escapeName(chunk[SubqueryConfig].alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk[SubqueryConfig].sql,
          new StringChunk(") "),
          new Name(chunk[SubqueryConfig].alias)
        ], config2);
      }
      if (isSQLWrapper(chunk)) {
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config2);
      }
      if (is(chunk, Relation)) {
        return this.buildQueryFromSourceParams([
          chunk.sourceTable,
          new StringChunk("."),
          sql.identifier(chunk.fieldName)
        ], config2);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config2), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === void 0) {
      return this;
    }
    return new _SQL.Aliased(this, alias);
  }
  mapWith(decoder2) {
    this.decoder = typeof decoder2 === "function" ? { mapFromDriverValue: decoder2 } : decoder2;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
};
var Name = class {
  value;
  static [entityKind] = "Name";
  brand;
  constructor(value) {
    this.value = value;
  }
  getSQL() {
    return new SQL([this]);
  }
};
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
var noopDecoder = {
  mapFromDriverValue: (value) => value
};
var noopEncoder = {
  mapToDriverValue: (value) => value
};
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};
var Param = class {
  value;
  encoder;
  static [entityKind] = "Param";
  brand;
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
  getSQL() {
    return new SQL([this]);
  }
};
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
(function(sql2) {
  function empty() {
    return new SQL([]);
  }
  sql2.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  sql2.fromList = fromList;
  function raw(str) {
    return new SQL([new StringChunk(str)]);
  }
  sql2.raw = raw;
  function join(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== void 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  sql2.join = join;
  function identifier(value) {
    return new Name(value);
  }
  sql2.identifier = identifier;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  sql2.param = param2;
})(sql || (sql = {}));
(function(SQL2) {
  class Aliased {
    sql;
    fieldAlias;
    static [entityKind] = "SQL.Aliased";
    /** @internal */
    isSelectionField = false;
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
  name;
  static [entityKind] = "Placeholder";
  constructor(name2) {
    this.name = name2;
  }
  getSQL() {
    return new SQL([this]);
  }
};
function fillPlaceholders(params, values) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values)) {
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      }
      return values[p.name];
    }
    return p;
  });
}
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
var ColumnAliasProxyHandler = class {
  table;
  static [entityKind] = "ColumnAliasProxyHandler";
  constructor(table) {
    this.table = table;
  }
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
};
var TableAliasProxyHandler = class {
  alias;
  replaceOriginalName;
  static [entityKind] = "TableAliasProxyHandler";
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === ViewBaseConfig) {
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(columns[key], new ColumnAliasProxyHandler(new Proxy(target, this)));
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is(value, Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
};
var RelationTableAliasProxyHandler = class {
  alias;
  static [entityKind] = "RelationTableAliasProxyHandler";
  constructor(alias) {
    this.alias = alias;
  }
  get(target, prop) {
    if (prop === "sourceTable") {
      return aliasedTable(target.sourceTable, this.alias);
    }
    return target[prop];
  }
};
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(column, new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false))));
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}

// ../../node_modules/.pnpm/drizzle-orm@0.28.5_@planetscale+database@1.8.0_mysql2@3.6.0/node_modules/drizzle-orm/index.mjs
var ConsoleLogWriter = class {
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
};
var DefaultLogger = class {
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config2) {
    this.writer = config2?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
};
var NoopLogger = class {
  static [entityKind] = "NoopLogger";
  logQuery() {
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.28.5_@planetscale+database@1.8.0_mysql2@3.6.0/node_modules/drizzle-orm/view-3fdec7de.mjs
var InlineForeignKeys2 = Symbol.for("drizzle:MySqlInlineForeignKeys");
var MySqlTable = class extends Table {
  static [entityKind] = "MySqlTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys: InlineForeignKeys2
  });
  /** @internal */
  [Table.Symbol.Columns];
  /** @internal */
  [InlineForeignKeys2] = [];
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
};
function mysqlTableWithSchema(name2, columns, extraConfig, schema, baseName = name2) {
  const rawTable = new MySqlTable(name2, schema, baseName);
  const builtColumns = Object.fromEntries(Object.entries(columns).map(([name3, colBuilderBase]) => {
    const colBuilder = colBuilderBase;
    const column = colBuilder.build(rawTable);
    rawTable[InlineForeignKeys2].push(...colBuilder.buildForeignKeys(column, rawTable));
    return [name3, column];
  }));
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  if (extraConfig) {
    table[MySqlTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
var mysqlTable = (name2, columns, extraConfig) => {
  return mysqlTableWithSchema(name2, columns, extraConfig, void 0, name2);
};
var ForeignKeyBuilder2 = class {
  static [entityKind] = "MySqlForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate;
  /** @internal */
  _onDelete;
  constructor(config2, actions) {
    this.reference = () => {
      const { columns, foreignColumns } = config2();
      return { columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action;
    return this;
  }
  /** @internal */
  build(table) {
    return new ForeignKey2(table, this);
  }
};
var ForeignKey2 = class {
  table;
  static [entityKind] = "MySqlForeignKey";
  reference;
  onUpdate;
  onDelete;
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  getName() {
    const { columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[MySqlTable.Symbol.Name],
      ...columnNames,
      foreignColumns[0].table[MySqlTable.Symbol.Name],
      ...foreignColumnNames
    ];
    return `${chunks.join("_")}_fk`;
  }
};
function uniqueKeyName2(table, columns) {
  return `${table[MySqlTable.Symbol.Name]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder2 = class {
  name;
  static [entityKind] = "MySqlUniqueConstraintBuilder";
  /** @internal */
  columns;
  constructor(columns, name2) {
    this.name = name2;
    this.columns = columns;
  }
  /** @internal */
  build(table) {
    return new UniqueConstraint2(table, this.columns, this.name);
  }
};
var UniqueOnConstraintBuilder2 = class {
  static [entityKind] = "MySqlUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name2) {
    this.name = name2;
  }
  on(...columns) {
    return new UniqueConstraintBuilder2(columns, this.name);
  }
};
var UniqueConstraint2 = class {
  table;
  static [entityKind] = "MySqlUniqueConstraint";
  columns;
  name;
  nullsNotDistinct = false;
  constructor(table, columns, name2) {
    this.table = table;
    this.columns = columns;
    this.name = name2 ?? uniqueKeyName2(this.table, this.columns.map((column) => column.name));
  }
  getName() {
    return this.name;
  }
};
var MySqlColumnBuilder = class extends ColumnBuilder {
  static [entityKind] = "MySqlColumnBuilder";
  foreignKeyConfigs = [];
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name2) {
    this.config.isUnique = true;
    this.config.uniqueName = name2;
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return ((ref2, actions2) => {
        const builder = new ForeignKeyBuilder2(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table);
      })(ref, actions);
    });
  }
};
var MySqlColumn = class extends Column {
  table;
  static [entityKind] = "MySqlColumn";
  constructor(table, config2) {
    if (!config2.uniqueName) {
      config2.uniqueName = uniqueKeyName2(table, [config2.name]);
    }
    super(table, config2);
    this.table = table;
  }
};
var MySqlColumnBuilderWithAutoIncrement = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlColumnBuilderWithAutoIncrement";
  constructor(name2, dataType, columnType) {
    super(name2, dataType, columnType);
    this.config.autoIncrement = false;
  }
  autoincrement() {
    this.config.autoIncrement = true;
    this.config.hasDefault = true;
    return this;
  }
};
var MySqlColumnWithAutoIncrement = class extends MySqlColumn {
  static [entityKind] = "MySqlColumnWithAutoIncrement";
  autoIncrement = this.config.autoIncrement;
};
var MySqlDelete = class extends QueryPromise {
  table;
  session;
  dialect;
  static [entityKind] = "MySqlDelete";
  config;
  constructor(table, session, dialect) {
    super();
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.config = { table };
  }
  where(where) {
    this.config.where = where;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  prepare() {
    return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning);
  }
  execute = (placeholderValues) => {
    return this.prepare().execute(placeholderValues);
  };
  createIterator = () => {
    const self = this;
    return async function* (placeholderValues) {
      yield* self.prepare().iterator(placeholderValues);
    };
  };
  iterator = this.createIterator();
};
var MySqlInsertBuilder = class {
  table;
  session;
  dialect;
  static [entityKind] = "MySqlInsertBuilder";
  shouldIgnore = false;
  constructor(table, session, dialect) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
  }
  ignore() {
    this.shouldIgnore = true;
    return this;
  }
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new MySqlInsert(this.table, mappedValues, this.shouldIgnore, this.session, this.dialect);
  }
};
var MySqlInsert = class extends QueryPromise {
  session;
  dialect;
  static [entityKind] = "MySqlInsert";
  config;
  constructor(table, values, ignore, session, dialect) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, values, ignore };
  }
  onDuplicateKeyUpdate(config2) {
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config2.set));
    this.config.onConflict = sql`update ${setSql}`;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  prepare() {
    return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), void 0);
  }
  execute = (placeholderValues) => {
    return this.prepare().execute(placeholderValues);
  };
  createIterator = () => {
    const self = this;
    return async function* (placeholderValues) {
      yield* self.prepare().iterator(placeholderValues);
    };
  };
  iterator = this.createIterator();
};
var MySqlDialect = class {
  static [entityKind] = "MySqlDialect";
  async migrate(migrations, session, config2) {
    const migrationsTable = config2.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = sql`
			create table if not exists ${sql.identifier(migrationsTable)} (
				id serial primary key,
				hash text not null,
				created_at bigint
			)
		`;
    await session.execute(migrationTableCreate);
    const dbMigrations = await session.all(sql`select id, hash, created_at from ${sql.identifier(migrationsTable)} order by created_at desc limit 1`);
    const lastDbMigration = dbMigrations[0];
    await session.transaction(async (tx) => {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.execute(sql.raw(stmt));
          }
          await tx.execute(sql`insert into ${sql.identifier(migrationsTable)} (\`hash\`, \`created_at\`) values(${migration.hash}, ${migration.folderMillis})`);
        }
      }
    });
  }
  escapeName(name2) {
    return `\`${name2}\``;
  }
  escapeParam(_num) {
    return `?`;
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildDeleteQuery({ table, where, returning }) {
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`delete from ${table}${whereSql}${returningSql}`;
  }
  buildUpdateSet(table, set) {
    const setEntries = Object.entries(set);
    const setSize = setEntries.length;
    return sql.join(setEntries.flatMap(([colName, value], i) => {
      const col = table[Table.Symbol.Columns][colName];
      const res = sql`${sql.identifier(col.name)} = ${value}`;
      if (i < setSize - 1) {
        return [res, sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning }) {
    const setSql = this.buildUpdateSet(table, set);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`update ${table} set ${setSql}${whereSql}${returningSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if (is(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is(field, SQL.Aliased) || is(field, SQL)) {
        const query = is(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(new SQL(query.queryChunks.map((c) => {
            if (is(c, MySqlColumn)) {
              return sql.identifier(c.name);
            }
            return c;
          })));
        } else {
          chunk.push(query);
        }
        if (is(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is(field, Column)) {
        if (isSingleTable) {
          chunk.push(sql.identifier(field.name));
        } else {
          chunk.push(field);
        }
      }
      if (i < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.join(chunks);
  }
  buildSelectQuery({ withList, fields, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, lockingClause, distinct }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f of fieldsList) {
      if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table[SubqueryConfig].alias : is(table, MySqlViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins?.some(({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])))(f.field.table)) {
        const tableName = getTableName(f.field.table);
        throw new Error(`Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`);
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    let withSql;
    if (withList?.length) {
      const withSqlChunks = [sql`with `];
      for (const [i, w] of withList.entries()) {
        withSqlChunks.push(sql`${sql.identifier(w[SubqueryConfig].alias)} as (${w[SubqueryConfig].sql})`);
        if (i < withList.length - 1) {
          withSqlChunks.push(sql`, `);
        }
      }
      withSqlChunks.push(sql` `);
      withSql = sql.join(withSqlChunks);
    }
    const distinctSql = distinct ? sql` distinct` : void 0;
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = (() => {
      if (is(table, Table) && table[Table.Symbol.OriginalName] !== table[Table.Symbol.Name]) {
        return sql`${sql.identifier(table[Table.Symbol.OriginalName])} ${sql.identifier(table[Table.Symbol.Name])}`;
      }
      return table;
    })();
    const joinsArray = [];
    if (joins) {
      for (const [index2, joinMeta] of joins.entries()) {
        if (index2 === 0) {
          joinsArray.push(sql` `);
        }
        const table2 = joinMeta.table;
        const lateralSql = joinMeta.lateral ? sql` lateral` : void 0;
        if (is(table2, MySqlTable)) {
          const tableName = table2[MySqlTable.Symbol.Name];
          const tableSchema = table2[MySqlTable.Symbol.Schema];
          const origTableName = table2[MySqlTable.Symbol.OriginalName];
          const alias = tableName === origTableName ? void 0 : joinMeta.alias;
          joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`);
        } else if (is(table2, View)) {
          const viewName = table2[ViewBaseConfig].name;
          const viewSchema = table2[ViewBaseConfig].schema;
          const origViewName = table2[ViewBaseConfig].originalName;
          const alias = viewName === origViewName ? void 0 : joinMeta.alias;
          joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${viewSchema ? sql`${sql.identifier(viewSchema)}.` : void 0}${sql.identifier(origViewName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`);
        } else {
          joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${table2} on ${joinMeta.on}`);
        }
        if (index2 < joins.length - 1) {
          joinsArray.push(sql` `);
        }
      }
    }
    const joinsSql = sql.join(joinsArray);
    const whereSql = where ? sql` where ${where}` : void 0;
    const havingSql = having ? sql` having ${having}` : void 0;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      orderBySql = sql` order by ${sql.join(orderBy, sql`, `)}`;
    }
    let groupBySql;
    if (groupBy && groupBy.length > 0) {
      groupBySql = sql` group by ${sql.join(groupBy, sql`, `)}`;
    }
    const limitSql = limit ? sql` limit ${limit}` : void 0;
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    let lockingClausesSql;
    if (lockingClause) {
      const { config: config2, strength } = lockingClause;
      lockingClausesSql = sql` for ${sql.raw(strength)}`;
      if (config2.noWait) {
        lockingClausesSql.append(sql` no wait`);
      } else if (config2.skipLocked) {
        lockingClausesSql.append(sql` skip locked`);
      }
    }
    return sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClausesSql}`;
  }
  buildInsertQuery({ table, values, ignore, onConflict }) {
    const valuesSqlList = [];
    const columns = table[Table.Symbol.Columns];
    const colEntries = Object.entries(columns);
    const insertOrder = colEntries.map(([, column]) => sql.identifier(column.name));
    for (const [valueIndex, value] of values.entries()) {
      const valueList = [];
      for (const [fieldName, col] of colEntries) {
        const colValue = value[fieldName];
        if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
          if (col.defaultFn !== void 0) {
            const defaultFnResult = col.defaultFn();
            const defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
            valueList.push(defaultValue);
          } else {
            valueList.push(sql`default`);
          }
        } else {
          valueList.push(colValue);
        }
      }
      valuesSqlList.push(valueList);
      if (valueIndex < values.length - 1) {
        valuesSqlList.push(sql`, `);
      }
    }
    const valuesSql = sql.join(valuesSqlList);
    const ignoreSql = ignore ? sql` ignore` : void 0;
    const onConflictSql = onConflict ? sql` on duplicate key ${onConflict}` : void 0;
    return sql`insert${ignoreSql} into ${table} ${insertOrder} values ${valuesSql}${onConflictSql}`;
  }
  sqlToQuery(sql2) {
    return sql2.toQuery({
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString
    });
  }
  buildRelationalQuery({ fullSchema, schema, tableNamesMap, table, tableConfig, queryConfig: config2, tableAlias, nestedQueryRelation, joinOn }) {
    let selection = [];
    let limit, offset, orderBy, where;
    const joins = [];
    if (config2 === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)]));
      if (config2.where) {
        const whereSql = typeof config2.where === "function" ? config2.where(aliasedColumns, getOperators()) : config2.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config2.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config2.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config2.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config2.with) {
        selectedRelations = Object.entries(config2.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config2.extras) {
        extras = typeof config2.extras === "function" ? config2.extras(aliasedColumns, { sql }) : config2.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config2.orderBy === "function" ? config2.orderBy(aliasedColumns, getOrderByOperators()) : config2.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config2.limit;
      offset = config2.offset;
      for (const { tsKey: selectedRelationTsKey, queryConfig: selectedRelationConfigValue, relation } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
        const relationTableName = relation.referencedTable[Table.Symbol.Name];
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(...normalizedRelation.fields.map((field2, i) => eq(aliasedTableColumn(normalizedRelation.references[i], relationTableAlias), aliasedTableColumn(field2, tableAlias))));
        const builtRelation = this.buildRelationalQuery({
          fullSchema,
          schema,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = sql`${sql.identifier(relationTableAlias)}.${sql.identifier("data")}`.as(selectedRelationTsKey);
        joins.push({
          on: sql`true`,
          table: new Subquery(builtRelation.sql, {}, relationTableAlias),
          alias: relationTableAlias,
          joinType: "left",
          lateral: true
        });
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError(`No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")`);
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_array(${sql.join(selection.map(({ field: field2, tsKey, isJson }) => isJson ? sql`${sql.identifier(`${tableAlias}_${tsKey}`)}.${sql.identifier("data")}` : is(field2, SQL.Aliased) ? field2.sql : field2), sql`, `)})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`coalesce(json_arrayagg(${field}), json_array())`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || (orderBy?.length ?? 0) > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table, tableAlias),
          fields: {},
          fieldsFlat: [
            {
              path: [],
              field: sql.raw("*")
            },
            ...(orderBy?.length ?? 0) > 0 ? [{
              path: [],
              field: sql`row_number() over (order by ${sql.join(orderBy, sql`, `)})`
            }] : []
          ],
          where,
          limit,
          offset
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = void 0;
      } else {
        result = aliasedTable(table, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, MySqlTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
  buildRelationalQueryWithoutLateralSubqueries({ fullSchema, schema, tableNamesMap, table, tableConfig, queryConfig: config2, tableAlias, nestedQueryRelation, joinOn }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    if (config2 === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)]));
      if (config2.where) {
        const whereSql = typeof config2.where === "function" ? config2.where(aliasedColumns, getOperators()) : config2.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config2.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config2.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config2.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config2.with) {
        selectedRelations = Object.entries(config2.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config2.extras) {
        extras = typeof config2.extras === "function" ? config2.extras(aliasedColumns, { sql }) : config2.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config2.orderBy === "function" ? config2.orderBy(aliasedColumns, getOrderByOperators()) : config2.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config2.limit;
      offset = config2.offset;
      for (const { tsKey: selectedRelationTsKey, queryConfig: selectedRelationConfigValue, relation } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
        const relationTableName = relation.referencedTable[Table.Symbol.Name];
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(...normalizedRelation.fields.map((field2, i) => eq(aliasedTableColumn(normalizedRelation.references[i], relationTableAlias), aliasedTableColumn(field2, tableAlias))));
        const builtRelation = this.buildRelationalQueryWithoutLateralSubqueries({
          fullSchema,
          schema,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        let fieldSql = sql`(${builtRelation.sql})`;
        if (is(relation, Many)) {
          fieldSql = sql`coalesce(${fieldSql}, json_array())`;
        }
        const field = fieldSql.as(selectedRelationTsKey);
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError(`No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`);
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_array(${sql.join(selection.map(({ field: field2 }) => is(field2, MySqlColumn) ? sql.identifier(field2.name) : is(field2, SQL.Aliased) ? field2.sql : field2), sql`, `)})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`json_arrayagg(${field})`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field,
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table, tableAlias),
          fields: {},
          fieldsFlat: [
            {
              path: [],
              field: sql.raw("*")
            },
            ...orderBy.length > 0 ? [{
              path: [],
              field: sql`row_number() over (order by ${sql.join(orderBy, sql`, `)})`
            }] : []
          ],
          where,
          limit,
          offset
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = void 0;
      } else {
        result = aliasedTable(table, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, MySqlTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        where,
        limit,
        offset,
        orderBy
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        where,
        limit,
        offset,
        orderBy
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
};
var MySqlSelectBuilder = class {
  static [entityKind] = "MySqlSelectBuilder";
  fields;
  session;
  dialect;
  withList = [];
  distinct;
  constructor(config2) {
    this.fields = config2.fields;
    this.session = config2.session;
    this.dialect = config2.dialect;
    if (config2.withList) {
      this.withList = config2.withList;
    }
    this.distinct = config2.distinct;
  }
  from(source) {
    const isPartialSelect = !!this.fields;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is(source, Subquery)) {
      fields = Object.fromEntries(Object.keys(source[SubqueryConfig].selection).map((key) => [key, source[key]]));
    } else if (is(source, MySqlViewBase)) {
      fields = source[ViewBaseConfig].selectedFields;
    } else if (is(source, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(source);
    }
    return new MySqlSelect({
      table: source,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
};
var MySqlSelectQueryBuilder = class extends TypedQueryBuilder {
  static [entityKind] = "MySqlSelectQueryBuilder";
  _;
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  /** @internal */
  session;
  dialect;
  constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table,
      fields: { ...fields },
      distinct
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields
    };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  createJoin(joinType) {
    return (table, on) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is(table, SQL)) {
          const selection = is(table, Subquery) ? table[SubqueryConfig].selection : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on === "function") {
        on = on(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
      }
      if (!this.config.joins) {
        this.config.joins = [];
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  where(where) {
    if (typeof where === "function") {
      where = where(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
    }
    this.config.where = where;
    return this;
  }
  having(having) {
    if (typeof having === "function") {
      having = having(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
      this.config.orderBy = Array.isArray(orderBy) ? orderBy : [orderBy];
    } else {
      this.config.orderBy = columns;
    }
    return this;
  }
  limit(limit) {
    this.config.limit = limit;
    return this;
  }
  offset(offset) {
    this.config.offset = offset;
    return this;
  }
  for(strength, config2 = {}) {
    this.config.lockingClause = { strength, config: config2 };
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    return new Proxy(new Subquery(this.getSQL(), this.config.fields, alias), new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
  }
};
var MySqlSelect = class extends MySqlSelectQueryBuilder {
  static [entityKind] = "MySqlSelect";
  prepare() {
    if (!this.session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    const fieldsList = orderSelectedFields(this.config.fields);
    const query = this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), fieldsList);
    query.joinsNotNullableMap = this.joinsNotNullableMap;
    return query;
  }
  execute = (placeholderValues) => {
    return this.prepare().execute(placeholderValues);
  };
  createIterator = () => {
    const self = this;
    return async function* (placeholderValues) {
      yield* self.prepare().iterator(placeholderValues);
    };
  };
  iterator = this.createIterator();
};
applyMixins(MySqlSelect, [QueryPromise]);
var QueryBuilder2 = class {
  static [entityKind] = "MySqlQueryBuilder";
  dialect;
  $with(alias) {
    const queryBuilder = this;
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(queryBuilder);
        }
        return new Proxy(new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true), new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
      }
    };
  }
  with(...queries) {
    const self = this;
    function select(fields) {
      return new MySqlSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new MySqlSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries,
        distinct: true
      });
    }
    return { select, selectDistinct };
  }
  select(fields) {
    return new MySqlSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(fields) {
    return new MySqlSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new MySqlDialect();
    }
    return this.dialect;
  }
};
var RelationalQueryBuilder = class {
  fullSchema;
  schema;
  tableNamesMap;
  table;
  tableConfig;
  dialect;
  session;
  mode;
  static [entityKind] = "MySqlRelationalQueryBuilder";
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, mode) {
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.mode = mode;
  }
  findMany(config2) {
    return new MySqlRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config2 ? config2 : {}, "many", this.mode);
  }
  findFirst(config2) {
    return new MySqlRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config2 ? { ...config2, limit: 1 } : { limit: 1 }, "first", this.mode);
  }
};
var MySqlRelationalQuery = class extends QueryPromise {
  fullSchema;
  schema;
  tableNamesMap;
  table;
  tableConfig;
  dialect;
  session;
  config;
  queryMode;
  mode;
  static [entityKind] = "MySqlRelationalQuery";
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config2, queryMode, mode) {
    super();
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config2;
    this.queryMode = queryMode;
    this.mode = mode;
  }
  prepare() {
    const query = this.mode === "planetscale" ? this.dialect.buildRelationalQueryWithoutLateralSubqueries({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }) : this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return this.session.prepareQuery(builtQuery, void 0, (rawRows) => {
      const rows = rawRows.map((row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection));
      if (this.queryMode === "first") {
        return rows[0];
      }
      return rows;
    });
  }
  execute() {
    return this.prepare().execute();
  }
};
var MySqlDatabase = class {
  dialect;
  session;
  mode;
  static [entityKind] = "MySqlDatabase";
  query;
  constructor(dialect, session, schema, mode) {
    this.dialect = dialect;
    this.session = session;
    this.mode = mode;
    this._ = schema ? { schema: schema.schema, tableNamesMap: schema.tableNamesMap } : { schema: void 0, tableNamesMap: {} };
    this.query = {};
    if (this._.schema) {
      for (const [tableName, columns] of Object.entries(this._.schema)) {
        this.query[tableName] = new RelationalQueryBuilder(schema.fullSchema, this._.schema, this._.tableNamesMap, schema.fullSchema[tableName], columns, dialect, session, this.mode);
      }
    }
  }
  $with(alias) {
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(new QueryBuilder2());
        }
        return new Proxy(new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true), new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
      }
    };
  }
  with(...queries) {
    const self = this;
    function select(fields) {
      return new MySqlSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new MySqlSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: true
      });
    }
    return { select, selectDistinct };
  }
  select(fields) {
    return new MySqlSelectBuilder({ fields: fields ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(fields) {
    return new MySqlSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  update(table) {
    return new MySqlUpdateBuilder(table, this.session, this.dialect);
  }
  insert(table) {
    return new MySqlInsertBuilder(table, this.session, this.dialect);
  }
  delete(table) {
    return new MySqlDelete(table, this.session, this.dialect);
  }
  execute(query) {
    return this.session.execute(query.getSQL());
  }
  transaction(transaction, config2) {
    return this.session.transaction(transaction, config2);
  }
};
var PreparedQuery = class {
  static [entityKind] = "MySqlPreparedQuery";
  /** @internal */
  joinsNotNullableMap;
};
var MySqlSession = class {
  dialect;
  static [entityKind] = "MySqlSession";
  constructor(dialect) {
    this.dialect = dialect;
  }
  execute(query) {
    return this.prepareQuery(this.dialect.sqlToQuery(query), void 0).execute();
  }
  getSetTransactionSQL(config2) {
    const parts = [];
    if (config2.isolationLevel) {
      parts.push(`isolation level ${config2.isolationLevel}`);
    }
    return parts.length ? sql.join(["set transaction ", parts.join(" ")]) : void 0;
  }
  getStartTransactionSQL(config2) {
    const parts = [];
    if (config2.withConsistentSnapshot) {
      parts.push("with consistent snapshot");
    }
    if (config2.accessMode) {
      parts.push(config2.accessMode);
    }
    return parts.length ? sql.join(["start transaction ", parts.join(" ")]) : void 0;
  }
};
var MySqlTransaction = class extends MySqlDatabase {
  schema;
  nestedIndex;
  static [entityKind] = "MySqlTransaction";
  constructor(dialect, session, schema, nestedIndex, mode) {
    super(dialect, session, schema, mode);
    this.schema = schema;
    this.nestedIndex = nestedIndex;
  }
  rollback() {
    throw new TransactionRollbackError();
  }
};
var MySqlUpdateBuilder = class {
  table;
  session;
  dialect;
  static [entityKind] = "MySqlUpdateBuilder";
  constructor(table, session, dialect) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
  }
  set(values) {
    return new MySqlUpdate(this.table, mapUpdateSet(this.table, values), this.session, this.dialect);
  }
};
var MySqlUpdate = class extends QueryPromise {
  session;
  dialect;
  static [entityKind] = "MySqlUpdate";
  config;
  constructor(table, set, session, dialect) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { set, table };
  }
  where(where) {
    this.config.where = where;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  prepare() {
    return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning);
  }
  execute = (placeholderValues) => {
    return this.prepare().execute(placeholderValues);
  };
  createIterator = () => {
    const self = this;
    return async function* (placeholderValues) {
      yield* self.prepare().iterator(placeholderValues);
    };
  };
  iterator = this.createIterator();
};
var ViewBuilderCore = class {
  name;
  schema;
  static [entityKind] = "MySqlViewBuilder";
  constructor(name2, schema) {
    this.name = name2;
    this.schema = schema;
  }
  config = {};
  algorithm(algorithm) {
    this.config.algorithm = algorithm;
    return this;
  }
  definer(definer) {
    this.config.definer = definer;
    return this;
  }
  sqlSecurity(sqlSecurity) {
    this.config.sqlSecurity = sqlSecurity;
    return this;
  }
  withCheckOption(withCheckOption) {
    this.config.withCheckOption = withCheckOption ?? "cascaded";
    return this;
  }
};
var ViewBuilder2 = class extends ViewBuilderCore {
  static [entityKind] = "MySqlViewBuilder";
  as(qb) {
    if (typeof qb === "function") {
      qb = qb(new QueryBuilder2());
    }
    const selectionProxy = new SelectionProxyHandler({
      alias: this.name,
      sqlBehavior: "error",
      sqlAliasedBehavior: "alias",
      replaceOriginalName: true
    });
    const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
    return new Proxy(new MySqlView({
      mysqlConfig: this.config,
      config: {
        name: this.name,
        schema: this.schema,
        selectedFields: aliasedSelection,
        query: qb.getSQL().inlineParams()
      }
    }), selectionProxy);
  }
};
var ManualViewBuilder2 = class extends ViewBuilderCore {
  static [entityKind] = "MySqlManualViewBuilder";
  columns;
  constructor(name2, columns, schema) {
    super(name2, schema);
    this.columns = getTableColumns(mysqlTable(name2, columns));
  }
  existing() {
    return new Proxy(new MySqlView({
      mysqlConfig: void 0,
      config: {
        name: this.name,
        schema: this.schema,
        selectedFields: this.columns,
        query: void 0
      }
    }), new SelectionProxyHandler({
      alias: this.name,
      sqlBehavior: "error",
      sqlAliasedBehavior: "alias",
      replaceOriginalName: true
    }));
  }
  as(query) {
    return new Proxy(new MySqlView({
      mysqlConfig: this.config,
      config: {
        name: this.name,
        schema: this.schema,
        selectedFields: this.columns,
        query: query.inlineParams()
      }
    }), new SelectionProxyHandler({
      alias: this.name,
      sqlBehavior: "error",
      sqlAliasedBehavior: "alias",
      replaceOriginalName: true
    }));
  }
};
var MySqlViewBase = class extends View {
  static [entityKind] = "MySqlViewBase";
};
var MySqlViewConfig = Symbol.for("drizzle:MySqlViewConfig");
var MySqlView = class extends MySqlViewBase {
  static [entityKind] = "MySqlView";
  [MySqlViewConfig];
  constructor({ mysqlConfig, config: config2 }) {
    super(config2);
    this[MySqlViewConfig] = mysqlConfig;
  }
};
function mysqlViewWithSchema(name2, selection, schema) {
  if (selection) {
    return new ManualViewBuilder2(name2, selection, schema);
  }
  return new ViewBuilder2(name2, schema);
}

// ../../node_modules/.pnpm/drizzle-orm@0.28.5_@planetscale+database@1.8.0_mysql2@3.6.0/node_modules/drizzle-orm/planetscale-serverless/index.mjs
var PlanetScalePreparedQuery = class extends PreparedQuery {
  client;
  queryString;
  params;
  logger;
  fields;
  customResultMapper;
  static [entityKind] = "PlanetScalePreparedQuery";
  rawQuery = { as: "object" };
  query = { as: "array" };
  constructor(client, queryString, params, logger, fields, customResultMapper) {
    super();
    this.client = client;
    this.queryString = queryString;
    this.params = params;
    this.logger = logger;
    this.fields = fields;
    this.customResultMapper = customResultMapper;
  }
  async execute(placeholderValues = {}) {
    const params = fillPlaceholders(this.params, placeholderValues);
    this.logger.logQuery(this.queryString, params);
    const { fields, client, queryString, rawQuery, query, joinsNotNullableMap, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return client.execute(queryString, params, rawQuery);
    }
    const { rows } = await client.execute(queryString, params, query);
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  iterator(_placeholderValues) {
    throw new Error("Streaming is not supported by the PlanetScale Serverless driver");
  }
};
var PlanetscaleSession = class _PlanetscaleSession extends MySqlSession {
  baseClient;
  schema;
  options;
  static [entityKind] = "PlanetscaleSession";
  logger;
  client;
  constructor(baseClient, dialect, tx, schema, options = {}) {
    super(dialect);
    this.baseClient = baseClient;
    this.schema = schema;
    this.options = options;
    this.client = tx ?? baseClient;
    this.logger = options.logger ?? new NoopLogger();
  }
  prepareQuery(query, fields, customResultMapper) {
    return new PlanetScalePreparedQuery(this.client, query.sql, query.params, this.logger, fields, customResultMapper);
  }
  async query(query, params) {
    this.logger.logQuery(query, params);
    return await this.client.execute(query, params, { as: "array" });
  }
  async queryObjects(query, params) {
    return this.client.execute(query, params, { as: "object" });
  }
  all(query) {
    const querySql = this.dialect.sqlToQuery(query);
    this.logger.logQuery(querySql.sql, querySql.params);
    return this.client.execute(querySql.sql, querySql.params, { as: "object" }).then((eQuery) => eQuery.rows);
  }
  transaction(transaction) {
    return this.baseClient.transaction((pstx) => {
      const session = new _PlanetscaleSession(this.baseClient, this.dialect, pstx, this.schema, this.options);
      const tx = new PlanetScaleTransaction(this.dialect, session, this.schema);
      return transaction(tx);
    });
  }
};
var PlanetScaleTransaction = class _PlanetScaleTransaction extends MySqlTransaction {
  static [entityKind] = "PlanetScaleTransaction";
  constructor(dialect, session, schema, nestedIndex = 0) {
    super(dialect, session, schema, nestedIndex, "planetscale");
  }
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new _PlanetScaleTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
    await tx.execute(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await tx.execute(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
};
function drizzle(client, config2 = {}) {
  const dialect = new MySqlDialect();
  let logger;
  if (config2.logger === true) {
    logger = new DefaultLogger();
  } else if (config2.logger !== false) {
    logger = config2.logger;
  }
  let schema;
  if (config2.schema) {
    const tablesConfig = extractTablesRelationalConfig(config2.schema, createTableRelationsHelpers);
    schema = {
      fullSchema: config2.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new PlanetscaleSession(client, dialect, void 0, schema, { logger });
  return new MySqlDatabase(dialect, session, schema, "planetscale");
}

// ../../node_modules/.pnpm/@planetscale+database@1.8.0/node_modules/@planetscale/database/dist/sanitization.js
function format(query, values) {
  return Array.isArray(values) ? replacePosition(query, values) : replaceNamed(query, values);
}
function replacePosition(query, values) {
  let index2 = 0;
  return query.replace(/\?/g, (match) => {
    return index2 < values.length ? sanitize(values[index2++]) : match;
  });
}
function replaceNamed(query, values) {
  return query.replace(/:(\w+)/g, (match, name2) => {
    return hasOwn(values, name2) ? sanitize(values[name2]) : match;
  });
}
function hasOwn(obj, name2) {
  return Object.prototype.hasOwnProperty.call(obj, name2);
}
function sanitize(value) {
  if (value == null) {
    return "null";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "string") {
    return quote(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitize).join(", ");
  }
  if (value instanceof Date) {
    return quote(value.toISOString().replace("Z", ""));
  }
  return quote(value.toString());
}
function quote(text2) {
  return `'${escape(text2)}'`;
}
var re = /[\0\b\n\r\t\x1a\\"']/g;
function escape(text2) {
  return text2.replace(re, replacement);
}
function replacement(text2) {
  switch (text2) {
    case '"':
      return '\\"';
    case "'":
      return "\\'";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\\":
      return "\\\\";
    case "\0":
      return "\\0";
    case "\b":
      return "\\b";
    case "":
      return "\\Z";
    default:
      return "";
  }
}

// ../../node_modules/.pnpm/@planetscale+database@1.8.0/node_modules/@planetscale/database/dist/text.js
var decoder = new TextDecoder("utf-8");
function decode(text2) {
  return text2 ? decoder.decode(Uint8Array.from(bytes(text2))) : "";
}
function bytes(text2) {
  return text2.split("").map((c) => c.charCodeAt(0));
}

// ../../node_modules/.pnpm/@planetscale+database@1.8.0/node_modules/@planetscale/database/dist/version.js
var Version = "1.8.0";

// ../../node_modules/.pnpm/@planetscale+database@1.8.0/node_modules/@planetscale/database/dist/index.js
var DatabaseError = class extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.name = "DatabaseError";
    this.body = body;
  }
};
var defaultExecuteOptions = {
  as: "object"
};
var Tx = class {
  constructor(conn) {
    this.conn = conn;
  }
  async execute(query, args = null, options = defaultExecuteOptions) {
    return this.conn.execute(query, args, options);
  }
};
var Connection = class _Connection {
  constructor(config2) {
    var _a;
    this.session = null;
    this.config = { ...config2 };
    if (typeof fetch !== "undefined") {
      (_a = this.config).fetch || (_a.fetch = fetch);
    }
    if (config2.url) {
      const url = new URL(config2.url);
      this.config.username = url.username;
      this.config.password = url.password;
      this.config.host = url.hostname;
    }
  }
  async transaction(fn) {
    const conn = new _Connection(this.config);
    const tx = new Tx(conn);
    try {
      await tx.execute("BEGIN");
      const res = await fn(tx);
      await tx.execute("COMMIT");
      return res;
    } catch (err) {
      await tx.execute("ROLLBACK");
      throw err;
    }
  }
  async refresh() {
    await this.createSession();
  }
  async execute(query, args = null, options = defaultExecuteOptions) {
    const url = new URL("/psdb.v1alpha1.Database/Execute", `https://${this.config.host}`);
    const formatter = this.config.format || format;
    const sql2 = args ? formatter(query, args) : query;
    const saved = await postJSON(this.config, url, { query: sql2, session: this.session });
    const { result, session, error, timing } = saved;
    if (error) {
      throw new DatabaseError(error.message, 400, error);
    }
    const rowsAffected = result?.rowsAffected ? parseInt(result.rowsAffected, 10) : 0;
    const insertId = result?.insertId ?? "0";
    this.session = session;
    const fields = result?.fields ?? [];
    for (const field of fields) {
      field.type || (field.type = "NULL");
    }
    const castFn = options.cast || this.config.cast || cast;
    const rows = result ? parse(result, castFn, options.as || "object") : [];
    const headers = fields.map((f) => f.name);
    const typeByName = (acc, { name: name2, type }) => ({ ...acc, [name2]: type });
    const types = fields.reduce(typeByName, {});
    const timingSeconds = timing ?? 0;
    return {
      headers,
      types,
      fields,
      rows,
      rowsAffected,
      insertId,
      size: rows.length,
      statement: sql2,
      time: timingSeconds * 1e3
    };
  }
  async createSession() {
    const url = new URL("/psdb.v1alpha1.Database/CreateSession", `https://${this.config.host}`);
    const { session } = await postJSON(this.config, url);
    this.session = session;
    return session;
  }
};
async function postJSON(config2, url, body = {}) {
  const auth = btoa(`${config2.username}:${config2.password}`);
  const { fetch: fetch2 } = config2;
  const response = await fetch2(url.toString(), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `database-js/${Version}`,
      Authorization: `Basic ${auth}`
    },
    cache: "no-store"
  });
  if (response.ok) {
    return await response.json();
  } else {
    let error = null;
    try {
      const e = (await response.json()).error;
      error = new DatabaseError(e.message, response.status, e);
    } catch {
      error = new DatabaseError(response.statusText, response.status, {
        code: "internal",
        message: response.statusText
      });
    }
    throw error;
  }
}
function connect(config2) {
  return new Connection(config2);
}
function parseArrayRow(fields, rawRow, cast2) {
  const row = decodeRow(rawRow);
  return fields.map((field, ix) => {
    return cast2(field, row[ix]);
  });
}
function parseObjectRow(fields, rawRow, cast2) {
  const row = decodeRow(rawRow);
  return fields.reduce((acc, field, ix) => {
    acc[field.name] = cast2(field, row[ix]);
    return acc;
  }, {});
}
function parse(result, cast2, returnAs) {
  const fields = result.fields;
  const rows = result.rows ?? [];
  return rows.map((row) => returnAs === "array" ? parseArrayRow(fields, row, cast2) : parseObjectRow(fields, row, cast2));
}
function decodeRow(row) {
  const values = row.values ? atob(row.values) : "";
  let offset = 0;
  return row.lengths.map((size) => {
    const width = parseInt(size, 10);
    if (width < 0)
      return null;
    const splice = values.substring(offset, offset + width);
    offset += width;
    return splice;
  });
}
function cast(field, value) {
  if (value === "" || value == null) {
    return value;
  }
  switch (field.type) {
    case "INT8":
    case "INT16":
    case "INT24":
    case "INT32":
    case "UINT8":
    case "UINT16":
    case "UINT24":
    case "UINT32":
    case "YEAR":
      return parseInt(value, 10);
    case "FLOAT32":
    case "FLOAT64":
      return parseFloat(value);
    case "DECIMAL":
    case "INT64":
    case "UINT64":
    case "DATE":
    case "TIME":
    case "DATETIME":
    case "TIMESTAMP":
    case "BLOB":
    case "BIT":
    case "VARBINARY":
    case "BINARY":
    case "GEOMETRY":
      return value;
    case "JSON":
      return JSON.parse(decode(value));
    default:
      return decode(value);
  }
}

// ../../src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  config: () => config,
  sleep: () => sleep,
  sleepRelations: () => sleepRelations,
  user: () => user,
  userRelations: () => userRelations
});

// ../../node_modules/.pnpm/drizzle-orm@0.28.5_@planetscale+database@1.8.0_mysql2@3.6.0/node_modules/drizzle-orm/mysql-core/index.mjs
var MySqlBigInt53Builder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlBigInt53Builder";
  constructor(name2) {
    super(name2, "number", "MySqlBigInt53");
  }
  /** @internal */
  build(table) {
    return new MySqlBigInt53(table, this.config);
  }
};
var MySqlBigInt53 = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlBigInt53";
  getSQLType() {
    return "bigint";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
};
var MySqlBigInt64Builder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlBigInt64Builder";
  constructor(name2) {
    super(name2, "bigint", "MySqlBigInt64");
  }
  /** @internal */
  build(table) {
    return new MySqlBigInt64(table, this.config);
  }
};
var MySqlBigInt64 = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlBigInt64";
  getSQLType() {
    return "bigint";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
};
var MySqlBinaryBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlBinaryBuilder";
  constructor(name2, length) {
    super(name2, "string", "MySqlBinary");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new MySqlBinary(table, this.config);
  }
};
var MySqlBinary = class extends MySqlColumn {
  static [entityKind] = "MySqlBinary";
  length = this.config.length;
  getSQLType() {
    return this.length === void 0 ? `binary` : `binary(${this.length})`;
  }
};
function binary(name2, config2 = {}) {
  return new MySqlBinaryBuilder(name2, config2.length);
}
var MySqlBooleanBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlBooleanBuilder";
  constructor(name2) {
    super(name2, "boolean", "MySqlBoolean");
  }
  /** @internal */
  build(table) {
    return new MySqlBoolean(table, this.config);
  }
};
var MySqlBoolean = class extends MySqlColumn {
  static [entityKind] = "MySqlBoolean";
  getSQLType() {
    return "boolean";
  }
  mapFromDriverValue(value) {
    if (typeof value === "boolean") {
      return value;
    }
    return value === 1;
  }
};
var MySqlCharBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlCharBuilder";
  constructor(name2, config2) {
    super(name2, "string", "MySqlChar");
    this.config.length = config2.length;
    this.config.enum = config2.enum;
  }
  /** @internal */
  build(table) {
    return new MySqlChar(table, this.config);
  }
};
var MySqlChar = class extends MySqlColumn {
  static [entityKind] = "MySqlChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
};
var MySqlCustomColumnBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlCustomColumnBuilder";
  constructor(name2, fieldConfig, customTypeParams) {
    super(name2, "custom", "MySqlCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new MySqlCustomColumn(table, this.config);
  }
};
var MySqlCustomColumn = class extends MySqlColumn {
  static [entityKind] = "MySqlCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table, config2) {
    super(table, config2);
    this.sqlName = config2.customTypeParams.dataType(config2.fieldConfig);
    this.mapTo = config2.customTypeParams.toDriver;
    this.mapFrom = config2.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
};
var MySqlDateBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateBuilder";
  constructor(name2) {
    super(name2, "date", "MySqlDate");
  }
  /** @internal */
  build(table) {
    return new MySqlDate(table, this.config);
  }
};
var MySqlDate = class extends MySqlColumn {
  static [entityKind] = "MySqlDate";
  constructor(table, config2) {
    super(table, config2);
  }
  getSQLType() {
    return `date`;
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
};
var MySqlDateStringBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateStringBuilder";
  constructor(name2) {
    super(name2, "string", "MySqlDateString");
  }
  /** @internal */
  build(table) {
    return new MySqlDateString(table, this.config);
  }
};
var MySqlDateString = class extends MySqlColumn {
  static [entityKind] = "MySqlDateString";
  constructor(table, config2) {
    super(table, config2);
  }
  getSQLType() {
    return `date`;
  }
};
var MySqlDateTimeBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateTimeBuilder";
  constructor(name2, config2) {
    super(name2, "date", "MySqlDateTime");
    this.config.fsp = config2?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlDateTime(table, this.config);
  }
};
var MySqlDateTime = class extends MySqlColumn {
  static [entityKind] = "MySqlDateTime";
  fsp;
  constructor(table, config2) {
    super(table, config2);
    this.fsp = config2.fsp;
  }
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `datetime${precision}`;
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
};
var MySqlDateTimeStringBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateTimeStringBuilder";
  constructor(name2, config2) {
    super(name2, "string", "MySqlDateTimeString");
    this.config.fsp = config2?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlDateTimeString(table, this.config);
  }
};
var MySqlDateTimeString = class extends MySqlColumn {
  static [entityKind] = "MySqlDateTimeString";
  fsp;
  constructor(table, config2) {
    super(table, config2);
    this.fsp = config2.fsp;
  }
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `datetime${precision}`;
  }
};
function datetime(name2, config2 = {}) {
  if (config2.mode === "string") {
    return new MySqlDateTimeStringBuilder(name2, config2);
  }
  return new MySqlDateTimeBuilder(name2, config2);
}
var MySqlDecimalBuilder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlDecimalBuilder";
  constructor(name2, precision, scale) {
    super(name2, "string", "MySqlDecimal");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  /** @internal */
  build(table) {
    return new MySqlDecimal(table, this.config);
  }
};
var MySqlDecimal = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlDecimal";
  precision = this.config.precision;
  scale = this.config.scale;
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `decimal(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      return "decimal";
    } else {
      return `decimal(${this.precision})`;
    }
  }
};
var MySqlDoubleBuilder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlDoubleBuilder";
  constructor(name2, config2) {
    super(name2, "number", "MySqlDouble");
    this.config.precision = config2?.precision;
    this.config.scale = config2?.scale;
  }
  /** @internal */
  build(table) {
    return new MySqlDouble(table, this.config);
  }
};
var MySqlDouble = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlDouble";
  precision = this.config.precision;
  scale = this.config.scale;
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `double(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      return "double";
    } else {
      return `double(${this.precision})`;
    }
  }
};
var MySqlEnumColumnBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlEnumColumnBuilder";
  constructor(name2, values) {
    super(name2, "string", "MySqlEnumColumn");
    this.config.enumValues = values;
  }
  /** @internal */
  build(table) {
    return new MySqlEnumColumn(table, this.config);
  }
};
var MySqlEnumColumn = class extends MySqlColumn {
  static [entityKind] = "MySqlEnumColumn";
  enumValues = this.config.enumValues;
  getSQLType() {
    return `enum(${this.enumValues.map((value) => `'${value}'`).join(",")})`;
  }
};
function mysqlEnum(name2, values) {
  if (values.length === 0) {
    throw new Error(`You have an empty array for "${name2}" enum values`);
  }
  return new MySqlEnumColumnBuilder(name2, values);
}
var MySqlFloatBuilder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlFloatBuilder";
  constructor(name2) {
    super(name2, "number", "MySqlFloat");
  }
  /** @internal */
  build(table) {
    return new MySqlFloat(table, this.config);
  }
};
var MySqlFloat = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlFloat";
  getSQLType() {
    return "float";
  }
};
var MySqlIntBuilder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlIntBuilder";
  constructor(name2) {
    super(name2, "number", "MySqlInt");
  }
  /** @internal */
  build(table) {
    return new MySqlInt(table, this.config);
  }
};
var MySqlInt = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlInt";
  getSQLType() {
    return "int";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
};
function int(name2) {
  return new MySqlIntBuilder(name2);
}
var MySqlJsonBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlJsonBuilder";
  constructor(name2) {
    super(name2, "json", "MySqlJson");
  }
  /** @internal */
  build(table) {
    return new MySqlJson(table, this.config);
  }
};
var MySqlJson = class extends MySqlColumn {
  static [entityKind] = "MySqlJson";
  getSQLType() {
    return "json";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
};
var MySqlMediumIntBuilder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlMediumIntBuilder";
  constructor(name2) {
    super(name2, "number", "MySqlMediumInt");
  }
  /** @internal */
  build(table) {
    return new MySqlMediumInt(table, this.config);
  }
};
var MySqlMediumInt = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlMediumInt";
  getSQLType() {
    return "mediumint";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
};
var MySqlRealBuilder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlRealBuilder";
  constructor(name2, config2) {
    super(name2, "number", "MySqlReal");
    this.config.precision = config2?.precision;
    this.config.scale = config2?.scale;
  }
  /** @internal */
  build(table) {
    return new MySqlReal(table, this.config);
  }
};
var MySqlReal = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlReal";
  precision = this.config.precision;
  scale = this.config.scale;
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `real(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "real";
    } else {
      return `real(${this.precision})`;
    }
  }
};
var MySqlSerialBuilder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlSerialBuilder";
  constructor(name2) {
    super(name2, "number", "MySqlSerial");
    this.config.hasDefault = true;
    this.config.autoIncrement = true;
  }
  /** @internal */
  build(table) {
    return new MySqlSerial(table, this.config);
  }
};
var MySqlSerial = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlSerial";
  getSQLType() {
    return "serial";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
};
var MySqlSmallIntBuilder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlSmallIntBuilder";
  constructor(name2) {
    super(name2, "number", "MySqlSmallInt");
  }
  /** @internal */
  build(table) {
    return new MySqlSmallInt(table, this.config);
  }
};
var MySqlSmallInt = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlSmallInt";
  getSQLType() {
    return "smallint";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
};
var MySqlTextBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlTextBuilder";
  constructor(name2, textType, config2) {
    super(name2, "string", "MySqlText");
    this.config.textType = textType;
    this.config.enumValues = config2.enum;
  }
  /** @internal */
  build(table) {
    return new MySqlText(table, this.config);
  }
};
var MySqlText = class extends MySqlColumn {
  static [entityKind] = "MySqlText";
  textType = this.config.textType;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.textType;
  }
};
function text(name2, config2 = {}) {
  return new MySqlTextBuilder(name2, "text", config2);
}
var MySqlTimeBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlTimeBuilder";
  constructor(name2, config2) {
    super(name2, "string", "MySqlTime");
    this.config.fsp = config2?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlTime(table, this.config);
  }
};
var MySqlTime = class extends MySqlColumn {
  static [entityKind] = "MySqlTime";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `time${precision}`;
  }
};
var MySqlDateColumnBaseBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateColumnBuilder";
  defaultNow() {
    return this.default(sql`(now())`);
  }
  // "on update now" also adds an implicit default value to the column - https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html
  onUpdateNow() {
    this.config.hasOnUpdateNow = true;
    this.config.hasDefault = true;
    return this;
  }
};
var MySqlDateBaseColumn = class extends MySqlColumn {
  static [entityKind] = "MySqlDateColumn";
  hasOnUpdateNow = this.config.hasOnUpdateNow;
};
var MySqlTimestampBuilder = class extends MySqlDateColumnBaseBuilder {
  static [entityKind] = "MySqlTimestampBuilder";
  constructor(name2, config2) {
    super(name2, "date", "MySqlTimestamp");
    this.config.fsp = config2?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlTimestamp(table, this.config);
  }
};
var MySqlTimestamp = class extends MySqlDateBaseColumn {
  static [entityKind] = "MySqlTimestamp";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `timestamp${precision}`;
  }
  mapFromDriverValue(value) {
    return /* @__PURE__ */ new Date(value + "+0000");
  }
  mapToDriverValue(value) {
    return value.toISOString().slice(0, -1).replace("T", " ");
  }
};
var MySqlTimestampStringBuilder = class extends MySqlDateColumnBaseBuilder {
  static [entityKind] = "MySqlTimestampStringBuilder";
  constructor(name2, config2) {
    super(name2, "string", "MySqlTimestampString");
    this.config.fsp = config2?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlTimestampString(table, this.config);
  }
};
var MySqlTimestampString = class extends MySqlDateBaseColumn {
  static [entityKind] = "MySqlTimestampString";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `timestamp${precision}`;
  }
};
function timestamp(name2, config2 = {}) {
  if (config2.mode === "string") {
    return new MySqlTimestampStringBuilder(name2, config2);
  }
  return new MySqlTimestampBuilder(name2, config2);
}
var MySqlTinyIntBuilder = class extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlTinyIntBuilder";
  constructor(name2) {
    super(name2, "number", "MySqlTinyInt");
  }
  /** @internal */
  build(table) {
    return new MySqlTinyInt(table, this.config);
  }
};
var MySqlTinyInt = class extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlTinyInt";
  getSQLType() {
    return "tinyint";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
};
var MySqlVarBinaryBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlVarBinaryBuilder";
  /** @internal */
  constructor(name2, config2) {
    super(name2, "string", "MySqlVarBinary");
    this.config.length = config2?.length;
  }
  /** @internal */
  build(table) {
    return new MySqlVarBinary(table, this.config);
  }
};
var MySqlVarBinary = class extends MySqlColumn {
  static [entityKind] = "MySqlVarBinary";
  length = this.config.length;
  getSQLType() {
    return this.length === void 0 ? `varbinary` : `varbinary(${this.length})`;
  }
};
var MySqlVarCharBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlVarCharBuilder";
  /** @internal */
  constructor(name2, config2) {
    super(name2, "string", "MySqlVarChar");
    this.config.length = config2.length;
    this.config.enum = config2.enum;
  }
  /** @internal */
  build(table) {
    return new MySqlVarChar(table, this.config);
  }
};
var MySqlVarChar = class extends MySqlColumn {
  static [entityKind] = "MySqlVarChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
  }
};
function varchar(name2, config2) {
  return new MySqlVarCharBuilder(name2, config2);
}
var MySqlYearBuilder = class extends MySqlColumnBuilder {
  static [entityKind] = "MySqlYearBuilder";
  constructor(name2) {
    super(name2, "number", "MySqlYear");
  }
  /** @internal */
  build(table) {
    return new MySqlYear(table, this.config);
  }
};
var MySqlYear = class extends MySqlColumn {
  static [entityKind] = "MySqlYear";
  getSQLType() {
    return `year`;
  }
};
var CheckBuilder2 = class {
  name;
  value;
  static [entityKind] = "MySqlCheckBuilder";
  brand;
  constructor(name2, value) {
    this.name = name2;
    this.value = value;
  }
  /** @internal */
  build(table) {
    return new Check2(table, this);
  }
};
var Check2 = class {
  table;
  static [entityKind] = "MySqlCheck";
  name;
  value;
  constructor(table, builder) {
    this.table = table;
    this.name = builder.name;
    this.value = builder.value;
  }
};
var IndexBuilderOn2 = class {
  name;
  unique;
  static [entityKind] = "MySqlIndexBuilderOn";
  constructor(name2, unique2) {
    this.name = name2;
    this.unique = unique2;
  }
  on(...columns) {
    return new IndexBuilder2(this.name, columns, this.unique);
  }
};
var IndexBuilder2 = class {
  static [entityKind] = "MySqlIndexBuilder";
  /** @internal */
  config;
  constructor(name2, columns, unique2) {
    this.config = {
      name: name2,
      columns,
      unique: unique2
    };
  }
  using(using) {
    this.config.using = using;
    return this;
  }
  algorythm(algorythm) {
    this.config.algorythm = algorythm;
    return this;
  }
  lock(lock) {
    this.config.lock = lock;
    return this;
  }
  /** @internal */
  build(table) {
    return new Index2(this.config, table);
  }
};
var Index2 = class {
  static [entityKind] = "MySqlIndex";
  config;
  constructor(config2, table) {
    this.config = { ...config2, table };
  }
};
function index(name2) {
  return new IndexBuilderOn2(name2, false);
}
var PrimaryKeyBuilder2 = class {
  static [entityKind] = "MySqlPrimaryKeyBuilder";
  /** @internal */
  columns;
  constructor(columns) {
    this.columns = columns;
  }
  /** @internal */
  build(table) {
    return new PrimaryKey2(table, this.columns);
  }
};
var PrimaryKey2 = class {
  table;
  static [entityKind] = "MySqlPrimaryKey";
  columns;
  constructor(table, columns) {
    this.table = table;
    this.columns = columns;
  }
  getName() {
    return `${this.table[MySqlTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
};
var MySqlSchema = class {
  schemaName;
  static [entityKind] = "MySqlSchema";
  constructor(schemaName) {
    this.schemaName = schemaName;
  }
  table = (name2, columns, extraConfig) => {
    return mysqlTableWithSchema(name2, columns, extraConfig, this.schemaName);
  };
  view = (name2, columns) => {
    return mysqlViewWithSchema(name2, columns, this.schemaName);
  };
};

// ../../src/db/schema.ts
var user = mysqlTable("User", {
  id: binary("id", { length: 16 }).primaryKey().notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
  email: varchar("email", { length: 255 }).unique(),
  newEmail: varchar("newEmail", { length: 255 }),
  nickname: varchar("nickname", { length: 255 }).notNull(),
  avatarUrl: text("avatarUrl")
});
var userRelations = relations(user, ({ one, many }) => ({
  config: one(config, { fields: [user.id], references: [config.userId] }),
  sleeps: many(sleep)
}));
var config = mysqlTable("Config", {
  id: int("id").autoincrement().primaryKey().notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
  userId: binary("userId", { length: 16 }).unique(),
  predictionSrcDuration: mysqlEnum("predictionSrcDuration", [
    "week1",
    "week2",
    "month1",
    "month2",
    "month3",
    "month4",
    "month6",
    "year1"
  ]).default("month2").notNull()
});
var sleep = mysqlTable(
  "Sleep",
  {
    id: int("id").autoincrement().primaryKey().notNull(),
    createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
    userId: binary("userId", { length: 16 }).notNull(),
    start: datetime("start").notNull(),
    end: datetime("end").notNull(),
    parentSleepId: int("parentSleepId")
  },
  (table) => {
    return {
      userIdIdx: index("userIdIdx").on(table.userId),
      parentSleepIdIdx: index("parentSleepIdIdx").on(table.parentSleepId),
      searchIdx: index("searchIdx").on(
        table.parentSleepId,
        table.userId,
        table.start,
        table.end
      )
    };
  }
);
var sleepRelations = relations(sleep, ({ one, many }) => ({
  user: one(user, { fields: [sleep.userId], references: [user.id] }),
  segmentedSleeps: many(sleep, { relationName: "segmentedSleeps" }),
  parentSleep: one(sleep, {
    fields: [sleep.parentSleepId],
    references: [sleep.id],
    relationName: "segmentedSleeps"
  })
}));

// ../../src/db/index.ts
var connection = connect({
  url: process.env.DATABASE_URL
});
var db = drizzle(connection, { schema: schema_exports });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  db
});
