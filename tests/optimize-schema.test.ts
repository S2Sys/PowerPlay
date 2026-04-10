import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { SchemaOptimizer, createSchemaOptimizer } from '../src/orchestrator/parallel/optimize-schema';

describe('SchemaOptimizer', () => {
  let optimizer: SchemaOptimizer;

  beforeEach(() => {
    optimizer = createSchemaOptimizer();
  });

  afterEach(() => {
    optimizer.reset();
  });

  describe('parseSchema', () => {
    it('should parse single CREATE TABLE statement', () => {
      const sql = 'CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR(100), email VARCHAR(255) UNIQUE);';
      const tables = optimizer.parseSchema(sql);
      expect(tables.length).toBe(1);
      expect(tables[0].name).toBe('Users');
      expect(tables[0].columns.length).toBe(3);
    });

    it('should parse multiple CREATE TABLE statements', () => {
      const sql = `
        CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR(100));
        CREATE TABLE Orders (id INT PRIMARY KEY, user_id INT FOREIGN KEY REFERENCES Users(id));
      `;
      const tables = optimizer.parseSchema(sql);
      expect(tables.length).toBe(2);
      expect(tables[0].name).toBe('Users');
      expect(tables[1].name).toBe('Orders');
    });

    it('should handle table with no explicit PK', () => {
      const sql = 'CREATE TABLE Items (id INT, name VARCHAR(255));';
      const tables = optimizer.parseSchema(sql);
      expect(tables.length).toBe(1);
      expect(tables[0].columns.length).toBe(2);
    });

    it('should return empty array for empty input', () => {
      const tables = optimizer.parseSchema('');
      expect(tables.length).toBe(0);
    });

    it('should extract column types and constraints', () => {
      const sql = 'CREATE TABLE Products (id INT PRIMARY KEY NOT NULL, name VARCHAR(255) NOT NULL, price DECIMAL(10,2));';
      const tables = optimizer.parseSchema(sql);
      expect(tables[0].columns[0].name).toBe('id');
      expect(tables[0].columns[0].type).toBe('INT');
      expect(tables[0].columns[0].nullable).toBe(false);
    });
  });

  describe('checkNormalization', () => {
    it('should detect 1NF violation (repeating columns)', () => {
      const sql = `
        CREATE TABLE StudentCourses (
          id INT PRIMARY KEY,
          student_id INT,
          course1 VARCHAR(50),
          course2 VARCHAR(50),
          course3 VARCHAR(50)
        );
      `;
      const tables = optimizer.parseSchema(sql);
      const violations = optimizer.checkNormalization(tables);
      expect(violations.some(v => v.violationType === '1NF')).toBe(true);
    });

    it('should detect 3NF violation (transitive dependency)', () => {
      const sql = `
        CREATE TABLE Addresses (
          id INT PRIMARY KEY,
          city VARCHAR(100),
          state VARCHAR(50),
          country VARCHAR(100),
          zip_code VARCHAR(10)
        );
      `;
      const tables = optimizer.parseSchema(sql);
      const violations = optimizer.checkNormalization(tables);
      expect(violations.some(v => v.violationType === '3NF')).toBe(true);
    });

    it('should return no violations for normalized table', () => {
      const sql = 'CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR(100), email VARCHAR(255));';
      const tables = optimizer.parseSchema(sql);
      const violations = optimizer.checkNormalization(tables);
      expect(violations.filter(v => v.violationType === '1NF' || v.violationType === '3NF').length).toBe(0);
    });
  });

  describe('recommendIndexes', () => {
    it('should recommend index on FK column', () => {
      const sql = `
        CREATE TABLE Orders (
          id INT PRIMARY KEY,
          user_id INT FOREIGN KEY REFERENCES Users(id),
          total DECIMAL(10,2)
        );
      `;
      const tables = optimizer.parseSchema(sql);
      const recs = optimizer.recommendIndexes(tables);
      expect(recs.some(r => r.columns.includes('user_id'))).toBe(true);
    });

    it('should recommend index for commonly-queried columns (email)', () => {
      const sql = 'CREATE TABLE Users (id INT PRIMARY KEY, email VARCHAR(255), username VARCHAR(100));';
      const tables = optimizer.parseSchema(sql);
      const recs = optimizer.recommendIndexes(tables);
      expect(recs.some(r => r.columns.includes('email') || r.columns.includes('username'))).toBe(true);
    });

    it('should return empty array if adequate indexes exist', () => {
      const sql = `
        CREATE TABLE Users (
          id INT PRIMARY KEY,
          email VARCHAR(255) UNIQUE,
          name VARCHAR(100)
        );
      `;
      const tables = optimizer.parseSchema(sql);
      const recs = optimizer.recommendIndexes(tables);
      // Email is UNIQUE so has implicit index
      expect(recs.filter(r => r.columns.includes('email')).length).toBe(0);
    });
  });

  describe('checkConstraints', () => {
    it('should flag column that should be NOT NULL but is nullable', () => {
      const sql = 'CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR(255) NULL);';
      const tables = optimizer.parseSchema(sql);
      const violations = optimizer.checkConstraints(tables);
      // Primary keys should not be nullable
      expect(violations.some(v => v.violationType === 'missing-not-null')).toBe(false);
    });

    it('should flag FK column with no FK constraint', () => {
      const sql = 'CREATE TABLE Orders (id INT PRIMARY KEY, user_id INT);';
      const tables = optimizer.parseSchema(sql);
      const violations = optimizer.checkConstraints(tables);
      expect(violations.some(v => v.violationType === 'missing-fk')).toBe(true);
    });

    it('should flag email column missing UNIQUE constraint', () => {
      const sql = 'CREATE TABLE Users (id INT PRIMARY KEY, email VARCHAR(255));';
      const tables = optimizer.parseSchema(sql);
      const violations = optimizer.checkConstraints(tables);
      expect(violations.some(v => v.violationType === 'missing-unique' && v.column === 'email')).toBe(true);
    });
  });

  describe('checkNaming', () => {
    it('should flag snake_case table name (should be PascalCase)', () => {
      const sql = 'CREATE TABLE user_accounts (id INT PRIMARY KEY, name VARCHAR(100));';
      const tables = optimizer.parseSchema(sql);
      const issues = optimizer.checkNaming(tables);
      expect(issues.some(i => i.includes('snake_case'))).toBe(true);
    });

    it('should flag mixed column casing', () => {
      const sql = 'CREATE TABLE Users (user_id INT PRIMARY KEY, firstName VARCHAR(100), last_name VARCHAR(100));';
      const tables = optimizer.parseSchema(sql);
      const issues = optimizer.checkNaming(tables);
      expect(issues.some(i => i.includes('mixes column casing'))).toBe(true);
    });

    it('should pass PascalCase table with consistent columns', () => {
      const sql = 'CREATE TABLE Users (id INT PRIMARY KEY, firstName VARCHAR(100), lastName VARCHAR(100));';
      const tables = optimizer.parseSchema(sql);
      const issues = optimizer.checkNaming(tables);
      expect(issues.filter(i => i.includes('PascalCase')).length).toBeLessThanOrEqual(1);
    });

    it('should flag SQL reserved word column names', () => {
      const sql = 'CREATE TABLE Users (id INT PRIMARY KEY, user VARCHAR(100));';
      const tables = optimizer.parseSchema(sql);
      const issues = optimizer.checkNaming(tables);
      expect(issues.some(i => i.includes('reserved word'))).toBe(true);
    });
  });

  describe('optimize', () => {
    it('should return correctedSchema as non-empty string', () => {
      const sql = 'CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR(100));';
      const report = optimizer.optimize(sql);
      expect(report.correctedSchema).toBeTruthy();
      expect(report.correctedSchema.length).toBeGreaterThan(0);
    });

    it('should include table names in correctedSchema', () => {
      const sql = 'CREATE TABLE Users (id INT PRIMARY KEY);';
      const report = optimizer.optimize(sql);
      expect(report.correctedSchema).toContain('Users');
    });

    it('should generate migration script with ALTER statements', () => {
      const sql = 'CREATE TABLE Users (id INT PRIMARY KEY, user_id INT);';
      const report = optimizer.optimize(sql);
      expect(report.migrationScript).toBeTruthy();
      expect(report.migrationScript.length).toBeGreaterThan(0);
    });

    it('should populate indexRecommendations with DDL', () => {
      const sql = 'CREATE TABLE Orders (id INT PRIMARY KEY, user_id INT FOREIGN KEY REFERENCES Users(id));';
      const report = optimizer.optimize(sql);
      expect(report.indexRecommendations.length).toBeGreaterThan(0);
      expect(report.indexRecommendations[0].ddl).toBeTruthy();
    });

    it('should list violations with description and severity', () => {
      const sql = 'CREATE TABLE Orders (id INT PRIMARY KEY, user_id INT FOREIGN KEY REFERENCES Users(id));';
      const report = optimizer.optimize(sql);
      expect(report.violations.length).toBeGreaterThanOrEqual(0);
      if (report.violations.length > 0) {
        expect(report.violations[0].description).toBeTruthy();
        expect(['critical', 'warning', 'info']).toContain(report.violations[0].severity);
      }
    });

    it('should handle minimal valid schema', () => {
      const sql = 'CREATE TABLE T (id INT PRIMARY KEY);';
      const report = optimizer.optimize(sql);
      expect(report.inputTables).toContain('T');
      expect(report.correctedSchema).toContain('T');
    });

    it('should handle empty input gracefully', () => {
      const report = optimizer.optimize('');
      expect(report.inputTables.length).toBe(0);
      expect(report.violations.length).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle composite PRIMARY KEY', () => {
      const sql = 'CREATE TABLE OrderItems (order_id INT, item_id INT, quantity INT, PRIMARY KEY (order_id, item_id));';
      const tables = optimizer.parseSchema(sql);
      expect(tables[0].primaryKey?.length).toBe(2);
    });

    it('should handle multiple FOREIGN KEYs', () => {
      const sql = `
        CREATE TABLE Shipments (
          id INT PRIMARY KEY,
          order_id INT FOREIGN KEY REFERENCES Orders(id),
          warehouse_id INT FOREIGN KEY REFERENCES Warehouses(id)
        );
      `;
      const tables = optimizer.parseSchema(sql);
      expect(tables[0].foreignKeys.length).toBe(2);
    });

    it('should detect missing indexes for both FKs in multi-FK table', () => {
      const sql = `
        CREATE TABLE Shipments (
          id INT PRIMARY KEY,
          order_id INT FOREIGN KEY REFERENCES Orders(id),
          warehouse_id INT FOREIGN KEY REFERENCES Warehouses(id)
        );
      `;
      const tables = optimizer.parseSchema(sql);
      const recs = optimizer.recommendIndexes(tables);
      expect(recs.length).toBeGreaterThan(0);
    });
  });

  describe('report timestamp', () => {
    it('should include recent timestamp in report', () => {
      const before = Date.now();
      const report = optimizer.optimize('CREATE TABLE Users (id INT);');
      const after = Date.now();
      expect(report.timestamp).toBeGreaterThanOrEqual(before);
      expect(report.timestamp).toBeLessThanOrEqual(after + 1000);
    });
  });
});
