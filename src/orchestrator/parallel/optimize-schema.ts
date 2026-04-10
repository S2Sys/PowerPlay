import {
  SchemaViolation,
  IndexRecommendation,
  SchemaOptimizationReport,
} from './types';

interface ParsedColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  defaultValue?: string;
}

interface ParsedTable {
  name: string;
  columns: ParsedColumn[];
  primaryKey?: string[];
  foreignKeys: Array<{ column: string; refTable: string; refColumn: string }>;
  indexes: Array<{ name: string; columns: string[] }>;
  uniqueConstraints: Array<{ columns: string[] }>;
}

/**
 * SchemaOptimizer — analyzes and optimizes SQL schema for:
 * - Normalization violations (1NF, 2NF, 3NF)
 * - Missing indexes
 * - Constraint issues
 * - Naming convention violations
 */
export class SchemaOptimizer {
  /**
   * Parse CREATE TABLE statements from SQL string.
   */
  parseSchema(sql: string): ParsedTable[] {
    if (!sql || sql.trim().length === 0) {
      return [];
    }

    const tables: ParsedTable[] = [];
    const createTableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\);/gi;
    let match;

    while ((match = createTableRegex.exec(sql)) !== null) {
      const tableName = match[1];
      const tableBody = match[2];
      const table = this.parseTableDefinition(tableName, tableBody);
      if (table) {
        tables.push(table);
      }
    }

    return tables;
  }

  /**
   * Check normalization violations.
   */
  checkNormalization(tables: ParsedTable[]): SchemaViolation[] {
    const violations: SchemaViolation[] = [];

    for (const table of tables) {
      // 1NF: Check for repeating column groups (phone1, phone2, phone3)
      const columnNames = table.columns.map(c => c.name.toLowerCase());
      const repeatingPattern = this.detectRepeatingColumns(columnNames);
      if (repeatingPattern.length > 0) {
        violations.push({
          table: table.name,
          violationType: '1NF',
          description: `Repeating column group detected: ${repeatingPattern.join(', ')}. Consider separate table.`,
          severity: 'warning',
        });
      }

      // 2NF: Check for partial key dependencies (non-key column depends on part of composite key)
      if (table.primaryKey && table.primaryKey.length > 1) {
        for (const col of table.columns) {
          if (!table.primaryKey.includes(col.name) && !col.isForeignKey) {
            // Simplified: flag as potential 2NF issue
            violations.push({
              table: table.name,
              column: col.name,
              violationType: '2NF',
              description: `Column "${col.name}" may depend on only part of composite key "${table.primaryKey.join(', ')}"`,
              severity: 'info',
            });
            break; // Report once per table
          }
        }
      }

      // 3NF: Check for transitive dependencies (e.g., City depends on ZipCode, ZipCode depends on State)
      const transitiveDeps = this.detectTransitiveDependencies(table);
      for (const dep of transitiveDeps) {
        violations.push({
          table: table.name,
          column: dep,
          violationType: '3NF',
          description: `Column "${dep}" may have transitive dependency through another non-key column.`,
          severity: 'info',
        });
      }
    }

    return violations;
  }

  /**
   * Recommend indexes.
   */
  recommendIndexes(tables: ParsedTable[]): IndexRecommendation[] {
    const recommendations: IndexRecommendation[] = [];

    for (const table of tables) {
      // 1. Index on FK columns
      for (const fk of table.foreignKeys) {
        const hasIndex = table.indexes.some(idx => idx.columns.includes(fk.column));
        if (!hasIndex) {
          recommendations.push({
            table: table.name,
            columns: [fk.column],
            type: 'composite',
            reason: `FK column "${fk.column}" referenced in "${fk.refTable}" should be indexed for join performance`,
            estimatedImpact: 'high',
            ddl: `CREATE INDEX idx_${table.name}_${fk.column} ON ${table.name}(${fk.column});`,
          });
        }
      }

      // 2. Index on commonly-queried columns (email, username, etc.)
      const commonQueryColumns = ['email', 'username', 'user_id', 'account_id', 'customer_id'];
      for (const col of table.columns) {
        if (commonQueryColumns.some(cq => col.name.toLowerCase().includes(cq))) {
          const hasIndex = table.indexes.some(idx => idx.columns.includes(col.name));
          if (!hasIndex && !col.isPrimaryKey) {
            recommendations.push({
              table: table.name,
              columns: [col.name],
              type: 'unique',
              reason: `Column "${col.name}" is commonly used in queries and should be indexed`,
              estimatedImpact: 'high',
              ddl: `CREATE INDEX idx_${table.name}_${col.name} ON ${table.name}(${col.name});`,
            });
          }
        }
      }

      // 3. Composite index for multi-column lookups
      if (table.foreignKeys.length > 1) {
        const fkColumns = table.foreignKeys.map(fk => fk.column).slice(0, 2);
        recommendations.push({
          table: table.name,
          columns: fkColumns,
          type: 'composite',
          reason: `Composite index on FK columns for multi-table joins`,
          estimatedImpact: 'medium',
          ddl: `CREATE INDEX idx_${table.name}_composite ON ${table.name}(${fkColumns.join(', ')});`,
        });
      }
    }

    return recommendations;
  }

  /**
   * Check constraint issues.
   */
  checkConstraints(tables: ParsedTable[]): SchemaViolation[] {
    const violations: SchemaViolation[] = [];

    for (const table of tables) {
      for (const col of table.columns) {
        // Missing NOT NULL
        if (col.nullable && (col.isPrimaryKey || col.isForeignKey)) {
          violations.push({
            table: table.name,
            column: col.name,
            violationType: 'missing-not-null',
            description: `Column "${col.name}" is part of key but allows NULL`,
            severity: 'critical',
          });
        }

        // Missing FK constraint
        if (col.name.toLowerCase().endsWith('_id') && !col.isForeignKey) {
          violations.push({
            table: table.name,
            column: col.name,
            violationType: 'missing-fk',
            description: `Column "${col.name}" appears to be a foreign key but has no FK constraint`,
            severity: 'warning',
          });
        }
      }

      // Missing UNIQUE on natural keys (email, username in many tables)
      for (const col of table.columns) {
        if ((col.name.toLowerCase() === 'email' || col.name.toLowerCase() === 'username') &&
            !col.isPrimaryKey &&
            !table.uniqueConstraints.some(uc => uc.columns.includes(col.name))) {
          violations.push({
            table: table.name,
            column: col.name,
            violationType: 'missing-unique',
            description: `Column "${col.name}" should have UNIQUE constraint`,
            severity: 'warning',
          });
        }
      }
    }

    return violations;
  }

  /**
   * Check naming conventions.
   */
  checkNaming(tables: ParsedTable[]): string[] {
    const issues: string[] = [];

    for (const table of tables) {
      // Table name should be PascalCase
      if (table.name !== table.name.charAt(0).toUpperCase() + table.name.slice(1)) {
        if (table.name.includes('_')) {
          issues.push(`Table "${table.name}" uses snake_case; use PascalCase (e.g., "${this.toPascalCase(table.name)}")`);
        }
      }

      // Columns should be consistent casing
      const casing = this.detectColumnCasing(table.columns.map(c => c.name));
      if (casing.length > 1) {
        issues.push(`Table "${table.name}" mixes column casing: ${casing.join(' and ')}. Use consistent style.`);
      }

      // Check for SQL reserved words
      const reservedWords = ['select', 'from', 'where', 'order', 'group', 'value', 'user'];
      for (const col of table.columns) {
        if (reservedWords.includes(col.name.toLowerCase())) {
          issues.push(`Column "${col.name}" in table "${table.name}" uses SQL reserved word. Use a different name.`);
        }
      }
    }

    return issues;
  }

  /**
   * Run the full optimization.
   */
  optimize(sql: string): SchemaOptimizationReport {
    const tables = this.parseSchema(sql);
    const violations = [
      ...this.checkNormalization(tables),
      ...this.checkConstraints(tables),
    ];
    const indexRecommendations = this.recommendIndexes(tables);
    const namingIssues = this.checkNaming(tables);

    const correctedSchema = this.generateCorrectedDDL(tables, violations);
    const migrationScript = this.generateMigrationScript(violations, indexRecommendations);

    return {
      inputTables: tables.map(t => t.name),
      violations,
      indexRecommendations,
      correctedSchema,
      migrationScript,
      namingIssues,
      timestamp: Date.now(),
    };
  }

  // ─ Private helpers ─

  private parseTableDefinition(tableName: string, body: string): ParsedTable | null {
    const table: ParsedTable = {
      name: tableName,
      columns: [],
      primaryKey: undefined,
      foreignKeys: [],
      indexes: [],
      uniqueConstraints: [],
    };

    // Parse columns
    const columnRegex = /(\w+)\s+(\w+)(?:\s*\(.*?\))?\s*(?:(NOT\s+NULL|NULL))?\s*(?:PRIMARY\s+KEY)?\s*(?:DEFAULT\s+(.+?))?(?:,|$)/gi;
    let match;
    while ((match = columnRegex.exec(body)) !== null) {
      const colName = match[1];
      const colType = match[2];
      const notNull = match[3]?.toUpperCase().includes('NOT NULL');
      const isPrimaryKey = body.includes(`PRIMARY KEY`) && body.includes(colName);

      table.columns.push({
        name: colName,
        type: colType,
        nullable: !notNull,
        isPrimaryKey,
        isForeignKey: false,
        defaultValue: match[4],
      });
    }

    // Parse PRIMARY KEY
    const pkRegex = /PRIMARY\s+KEY\s*\(([^)]+)\)/i;
    const pkMatch = body.match(pkRegex);
    if (pkMatch) {
      table.primaryKey = pkMatch[1].split(',').map(s => s.trim());
    }

    // Parse FOREIGN KEY
    const fkRegex = /FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+(\w+)\s*\(([^)]+)\)/gi;
    while ((match = fkRegex.exec(body)) !== null) {
      const col = match[1].trim();
      table.foreignKeys.push({
        column: col,
        refTable: match[2],
        refColumn: match[3],
      });
      // Mark column as FK
      const column = table.columns.find(c => c.name === col);
      if (column) column.isForeignKey = true;
    }

    // Parse UNIQUE constraints
    const uniqueRegex = /UNIQUE\s*\(([^)]+)\)/gi;
    while ((match = uniqueRegex.exec(body)) !== null) {
      table.uniqueConstraints.push({
        columns: match[1].split(',').map(s => s.trim()),
      });
    }

    // Parse INDEX/KEY
    const indexRegex = /(?:INDEX|KEY)\s+(\w+)\s*\(([^)]+)\)/gi;
    while ((match = indexRegex.exec(body)) !== null) {
      table.indexes.push({
        name: match[1],
        columns: match[2].split(',').map(s => s.trim()),
      });
    }

    return table.columns.length > 0 ? table : null;
  }

  private detectRepeatingColumns(names: string[]): string[] {
    const patterns: Record<string, string[]> = {};
    for (const name of names) {
      const base = name.replace(/\d+$/, '');
      if (!patterns[base]) patterns[base] = [];
      patterns[base].push(name);
    }
    return Object.entries(patterns)
      .filter(([_, cols]) => cols.length > 2)
      .map(([_, cols]) => cols.join(', '))
      .flat();
  }

  private detectTransitiveDependencies(table: ParsedTable): string[] {
    const deps: string[] = [];
    // Simplified heuristic: columns like city, state, country suggest transitive dependency
    const locColumns = table.columns
      .filter(c => ['city', 'state', 'country', 'zip', 'postal'].some(l => c.name.toLowerCase().includes(l)))
      .map(c => c.name);
    if (locColumns.length > 2) {
      deps.push(locColumns[0]);
    }
    return deps;
  }

  private generateCorrectedDDL(tables: ParsedTable[], violations: SchemaViolation[]): string {
    let ddl = '';
    for (const table of tables) {
      ddl += `CREATE TABLE ${table.name} (\n`;
      const columnDefs = table.columns.map(col => {
        let def = `  ${col.name} ${col.type}`;
        if (!col.nullable) def += ' NOT NULL';
        if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
        return def;
      });
      ddl += columnDefs.join(',\n');

      if (table.primaryKey) {
        ddl += `,\n  PRIMARY KEY (${table.primaryKey.join(', ')})`;
      }
      for (const fk of table.foreignKeys) {
        ddl += `,\n  FOREIGN KEY (${fk.column}) REFERENCES ${fk.refTable}(${fk.refColumn})`;
      }
      for (const uc of table.uniqueConstraints) {
        ddl += `,\n  UNIQUE (${uc.columns.join(', ')})`;
      }

      ddl += '\n);\n\n';
    }
    return ddl;
  }

  private generateMigrationScript(violations: SchemaViolation[], recommendations: IndexRecommendation[]): string {
    let script = '-- Migration script generated by SchemaOptimizer\n';
    script += '-- Review and test each statement before applying to production\n\n';

    // Add corrective ALTERs for violations
    for (const v of violations) {
      if (v.violationType === 'missing-not-null' && v.column) {
        script += `-- TODO: Review and apply: ALTER TABLE ${v.table} ALTER COLUMN ${v.column} SET NOT NULL;\n`;
      } else if (v.violationType === 'missing-unique' && v.column) {
        script += `-- TODO: Review and apply: ALTER TABLE ${v.table} ADD CONSTRAINT uk_${v.table}_${v.column} UNIQUE (${v.column});\n`;
      }
    }

    script += '\n';

    // Add recommended indexes
    for (const rec of recommendations) {
      script += `${rec.ddl}\n`;
    }

    return script;
  }

  private toPascalCase(snake: string): string {
    return snake
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private detectColumnCasing(names: string[]): string[] {
    const casings = new Set<string>();
    for (const name of names) {
      if (name.includes('_')) {
        casings.add('snake_case');
      } else if (name.charAt(0) === name.charAt(0).toUpperCase()) {
        casings.add('PascalCase');
      } else {
        casings.add('camelCase');
      }
    }
    return Array.from(casings);
  }

  reset(): void {
    // No internal state to reset
  }
}

export function createSchemaOptimizer(): SchemaOptimizer {
  return new SchemaOptimizer();
}
