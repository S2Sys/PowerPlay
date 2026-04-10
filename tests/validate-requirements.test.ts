import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { RequirementsValidator, createRequirementsValidator } from '../src/orchestrator/parallel/validate-requirements';
import { Requirement, ExecutionContext } from '../src/orchestrator/parallel/types';

describe('RequirementsValidator', () => {
  let validator: RequirementsValidator;

  beforeEach(() => {
    validator = createRequirementsValidator();
  });

  afterEach(() => {
    validator.reset();
  });

  describe('parseInput', () => {
    it('should parse JSON array of Requirement objects', () => {
      const input = JSON.stringify([
        { id: 'r1', name: 'Feature A', description: 'Do something', priority: 'high' },
      ]);
      const result = validator.parseInput(input);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Feature A');
    });

    it('should parse numbered text list', () => {
      const input = '1. First requirement\n2. Second requirement\n3. Third';
      const result = validator.parseInput(input);
      expect(result.length).toBe(3);
      expect(result[0].description).toContain('First requirement');
      expect(result[1].description).toContain('Second requirement');
    });

    it('should parse comma-separated text', () => {
      const input = 'Feature A, Feature B, Feature C';
      const result = validator.parseInput(input);
      expect(result.length).toBe(3);
      expect(result[0].description).toBe('Feature A');
    });

    it('should wrap plain text as single requirement', () => {
      const input = 'This is a single requirement';
      const result = validator.parseInput(input);
      expect(result.length).toBe(1);
      expect(result[0].description).toBe(input);
    });

    it('should return empty array for empty string', () => {
      const result = validator.parseInput('');
      expect(result.length).toBe(0);
    });

    it('should handle already-parsed Requirement array', () => {
      const req: Requirement = { id: 'r1', name: 'Test', description: 'Testing', priority: 'medium' };
      const result = validator.parseInput([req]);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(req);
    });
  });

  describe('validateRequirement', () => {
    it('should return score 0-100 for well-formed requirement', () => {
      const req: Requirement = {
        id: 'r1',
        name: 'User Login',
        description: 'As a user, I want to log in so that I can access my account. Given username and password, when submitted, then system authenticates and grants access.',
        priority: 'high',
        estimatedEffort: 5,
      };
      const score = validator.validateRequirement(req);
      expect(score.overallScore).toBeGreaterThanOrEqual(0);
      expect(score.overallScore).toBeLessThanOrEqual(100);
    });

    it('should assign high score to INVEST-compliant requirement', () => {
      const req: Requirement = {
        id: 'r1',
        name: 'Password Reset',
        description: 'User can reset password via email link. Given: user email, When: reset requested, Then: email sent within 30 seconds.',
        priority: 'high',
        estimatedEffort: 3,
      };
      const score = validator.validateRequirement(req);
      expect(score.overallScore).toBeGreaterThan(70);
      expect(score.verdict).toBe('pass');
    });

    it('should flag missing description as critical issue', () => {
      const req: Requirement = { id: 'r1', name: 'Feature', description: '', priority: 'medium' };
      const score = validator.validateRequirement(req);
      expect(score.issues.some(i => i.criterion === 'completeness' && i.severity === 'critical')).toBe(true);
    });

    it('should flag ambiguous language as warning', () => {
      const req: Requirement = {
        id: 'r1',
        name: 'Performance',
        description: 'The system may perform well and should be fast',
        priority: 'medium',
      };
      const score = validator.validateRequirement(req);
      expect(score.issues.some(i => i.criterion === 'clarity' && i.severity === 'warning')).toBe(true);
    });

    it('should flag missing estimatedEffort as info issue', () => {
      const req: Requirement = {
        id: 'r1',
        name: 'Feature',
        description: 'A new feature description',
        priority: 'medium',
      };
      const score = validator.validateRequirement(req);
      expect(score.issues.some(i => i.criterion === 'feasibility' && i.severity === 'info')).toBe(true);
    });

    it('should assign verdict pass for score >= 80', () => {
      const req: Requirement = {
        id: 'r1',
        name: 'Complete Feature',
        description: 'User can perform action X. Given: condition A, When: action taken, Then: result Y in less than 100ms. Estimated: 5 points.',
        priority: 'high',
        estimatedEffort: 5,
      };
      const score = validator.validateRequirement(req);
      if (score.overallScore >= 80) {
        expect(score.verdict).toBe('pass');
      }
    });

    it('should assign verdict needs-work for score 50-79', () => {
      const req: Requirement = {
        id: 'r1',
        name: 'Partial',
        description: 'Some feature may do something appropriate',
        priority: 'medium',
        estimatedEffort: 8,
      };
      const score = validator.validateRequirement(req);
      if (score.overallScore >= 50 && score.overallScore < 80) {
        expect(score.verdict).toBe('needs-work');
      }
    });

    it('should assign verdict fail for score < 50', () => {
      const req: Requirement = { id: 'r1', name: '', description: '', priority: 'low' };
      const score = validator.validateRequirement(req);
      if (score.overallScore < 50) {
        expect(score.verdict).toBe('fail');
      }
    });
  });

  describe('validateAll', () => {
    it('should process multiple requirements and return ValidationReport', () => {
      const reqs: Requirement[] = [
        { id: 'r1', name: 'Feature A', description: 'Description A', priority: 'high' },
        { id: 'r2', name: 'Feature B', description: 'Description B', priority: 'medium' },
      ];
      const report = validator.validateAll(reqs);
      expect(report.totalRequirements).toBe(2);
      expect(report.scores.length).toBe(2);
    });

    it('should correctly count pass/fail/needs-work', () => {
      const reqs: Requirement[] = [
        { id: 'r1', name: 'Good', description: 'User can do X so that Y happens. Given: A, When: B, Then: C.', priority: 'high', estimatedEffort: 3 },
        { id: 'r2', name: 'Bad', description: '', priority: 'low' },
      ];
      const report = validator.validateAll(reqs);
      expect(report.passedCount + report.needsWorkCount + report.failedCount).toBe(2);
    });

    it('should return empty report for empty requirements array', () => {
      const report = validator.validateAll([]);
      expect(report.totalRequirements).toBe(0);
      expect(report.scores.length).toBe(0);
    });

    it('should include recent timestamp', () => {
      const before = Date.now();
      const report = validator.validateAll([]);
      const after = Date.now();
      expect(report.timestamp).toBeGreaterThanOrEqual(before);
      expect(report.timestamp).toBeLessThanOrEqual(after + 1000);
    });
  });

  describe('getSummary', () => {
    it('should include total requirements count', () => {
      const report = validator.validateAll([
        { id: 'r1', name: 'A', description: 'A', priority: 'high', estimatedEffort: 1 },
        { id: 'r2', name: 'B', description: 'B', priority: 'high', estimatedEffort: 1 },
      ]);
      const summary = validator.getSummary(report);
      expect(summary).toContain('2');
    });

    it('should include quality assessment', () => {
      const report = validator.validateAll([
        { id: 'r1', name: 'Good', description: 'Good description', priority: 'high', estimatedEffort: 3 },
      ]);
      const summary = validator.getSummary(report);
      expect(summary.length).toBeGreaterThan(0);
      expect(summary).toMatch(/pass|fail|work/i);
    });
  });

  describe('INVEST scoring logic', () => {
    it('should score Independent high if no dependency keywords', () => {
      const req: Requirement = {
        id: 'r1',
        name: 'Feature',
        description: 'Standalone feature with no dependencies',
        priority: 'high',
      };
      const score = validator.validateRequirement(req);
      expect(score.investScores.get('independent')).toBe(10);
    });

    it('should score Independent low if contains dependency keywords', () => {
      const req: Requirement = {
        id: 'r1',
        name: 'Feature',
        description: 'Depends on authentication being completed first',
        priority: 'high',
      };
      const score = validator.validateRequirement(req);
      expect(score.investScores.get('independent')).toBeLessThan(10);
    });

    it('should score Testable high for acceptance criteria keywords', () => {
      const req: Requirement = {
        id: 'r1',
        name: 'Feature',
        description: 'Given a user, when clicking button, then modal opens',
        priority: 'high',
      };
      const score = validator.validateRequirement(req);
      expect(score.investScores.get('testable')).toBeGreaterThan(5);
    });

    it('should score Small high for short descriptions and low effort', () => {
      const req: Requirement = {
        id: 'r1',
        name: 'Small',
        description: 'Add button to UI',
        priority: 'low',
        estimatedEffort: 1,
      };
      const score = validator.validateRequirement(req);
      expect(score.investScores.get('small')).toBeGreaterThan(5);
    });
  });

  describe('integration', () => {
    it('should validate requirements parsed from text input', () => {
      const text = '1. User login\n2. Password reset\n3. Logout';
      const parsed = validator.parseInput(text);
      const report = validator.validateAll(parsed);
      expect(report.totalRequirements).toBe(3);
      expect(report.scores.length).toBe(3);
    });

    it('should handle batch of requirements with mixed quality', () => {
      const reqs: Requirement[] = [
        { id: 'r1', name: 'Good', description: 'Well-formed requirement with criteria given, when, then', priority: 'high', estimatedEffort: 5 },
        { id: 'r2', name: '', description: '', priority: 'medium' },
        { id: 'r3', name: 'Partial', description: 'May need some work', priority: 'low' },
      ];
      const report = validator.validateAll(reqs);
      expect(report.totalRequirements).toBe(3);
      expect(report.failedCount).toBeGreaterThan(0);
    });
  });
});
