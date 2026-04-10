import {
  Requirement,
  RequirementValidationIssue,
  RequirementValidationScore,
  ValidationReport,
  ValidationSeverity,
  InvestCriterion,
} from './types';

/**
 * RequirementsValidator — validates requirements against INVEST criteria,
 * completeness, clarity, and feasibility.
 * Scores each requirement 0-100 and assigns verdict: pass (≥80), needs-work (50-79), fail (<50).
 */
export class RequirementsValidator {
  private readonly ambiguousWords = [
    'may', 'might', 'should', 'could', 'some', 'several',
    'appropriate', 'as necessary', 'etc', 'and/or'
  ];

  /**
   * Parse input into Requirement[] from JSON array, numbered list, or plain text.
   */
  parseInput(input: string | Requirement[]): Requirement[] {
    if (Array.isArray(input)) {
      return input;
    }

    if (!input || typeof input !== 'string') {
      return [];
    }

    const text = input.trim();
    if (text.length === 0) {
      return [];
    }

    // Try JSON parse first
    if (text.startsWith('[')) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Fallback to text parsing
      }
    }

    // Parse numbered list: "1. First req\n2. Second req" or comma-separated
    const requirements: Requirement[] = [];
    let reqId = 1;

    if (text.includes('\n') || text.match(/^\d+\./)) {
      // Numbered list
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      for (const line of lines) {
        const match = line.match(/^\d+\.\s*(.+)$/);
        if (match) {
          requirements.push({
            id: `req-${reqId}`,
            name: match[1].substring(0, 50),
            description: match[1],
            priority: 'medium',
          });
          reqId++;
        }
      }
    } else if (text.includes(',')) {
      // Comma-separated
      const items = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
      for (const item of items) {
        requirements.push({
          id: `req-${reqId}`,
          name: item.substring(0, 50),
          description: item,
          priority: 'medium',
        });
        reqId++;
      }
    } else {
      // Single requirement as plain text
      requirements.push({
        id: 'req-1',
        name: text.substring(0, 50),
        description: text,
        priority: 'medium',
      });
    }

    return requirements;
  }

  /**
   * Score a single requirement against INVEST criteria + completeness/clarity/feasibility.
   */
  validateRequirement(req: Requirement): RequirementValidationScore {
    const issues: RequirementValidationIssue[] = [];
    const investScores = this.scoreInvest(req);

    // Check completeness
    issues.push(...this.checkCompleteness(req));

    // Check clarity
    issues.push(...this.checkClarity(req));

    // Check feasibility
    issues.push(...this.checkFeasibility(req));

    // Calculate INVEST average (0-10 scale → 0-100)
    const investValues = Array.from(investScores.values());
    const investAverage = investValues.length > 0
      ? investValues.reduce((a, b) => a + b, 0) / investValues.length
      : 50;

    // Completeness + Clarity + Feasibility check (0-10 per category, simplified to pass/warning/fail)
    const completenessScore = issues.filter(i => i.criterion === 'completeness').length === 0 ? 10 : 5;
    const clarityScore = issues.filter(i => i.criterion === 'clarity').length === 0 ? 10 : 5;
    const feasibilityScore = issues.filter(i => i.criterion === 'feasibility').length === 0 ? 10 : 5;

    // Overall: 60% INVEST, 40% completeness/clarity/feasibility
    const otherScore = (completenessScore + clarityScore + feasibilityScore) / 3;
    const overallScore = Math.round((investAverage * 0.6 + otherScore * 10 * 0.4));

    // Verdict
    let verdict: 'pass' | 'needs-work' | 'fail' = 'pass';
    if (overallScore < 50) {
      verdict = 'fail';
    } else if (overallScore < 80) {
      verdict = 'needs-work';
    }

    return {
      requirementId: req.id || `req-${Date.now()}`,
      requirementName: req.name,
      overallScore: Math.min(100, Math.max(0, overallScore)),
      investScores,
      issues,
      verdict,
    };
  }

  /**
   * Validate all requirements and return a report.
   */
  validateAll(requirements: Requirement[]): ValidationReport {
    const scores = requirements.map(req => this.validateRequirement(req));

    const passedCount = scores.filter(s => s.verdict === 'pass').length;
    const needsWorkCount = scores.filter(s => s.verdict === 'needs-work').length;
    const failedCount = scores.filter(s => s.verdict === 'fail').length;

    const summary = this.generateSummary(scores, passedCount, needsWorkCount, failedCount);

    return {
      totalRequirements: requirements.length,
      passedCount,
      needsWorkCount,
      failedCount,
      scores,
      summary,
      timestamp: Date.now(),
    };
  }

  /**
   * Generate a human-readable summary string for the report.
   */
  getSummary(report: ValidationReport): string {
    return report.summary;
  }

  /**
   * Score INVEST criteria for a single requirement (0-10 each).
   */
  private scoreInvest(req: Requirement): Map<InvestCriterion, number> {
    const description = (req.description || '').toLowerCase();
    const name = (req.name || '').toLowerCase();
    const text = `${name} ${description}`;

    const scores = new Map<InvestCriterion, number>();

    // Independent: no "depends on", "requires X first", "after Y"
    const independenceKeywords = ['depends on', 'requires', 'after', 'before', 'prerequisite'];
    const isIndependent = !independenceKeywords.some(kw => text.includes(kw));
    scores.set('independent', isIndependent ? 10 : 3);

    // Negotiable: not too specific, no hardcoded tech names
    const negotiableKeywords = ['must use', 'only with', 'specifically'];
    const isNegotiable = !negotiableKeywords.some(kw => text.includes(kw));
    scores.set('negotiable', isNegotiable ? 9 : 4);

    // Valuable: has business outcome language
    const valuableKeywords = ['so that', 'in order to', 'enables', 'allows', 'improve', 'reduce'];
    const isValuable = valuableKeywords.some(kw => text.includes(kw));
    scores.set('valuable', isValuable ? 10 : 6);

    // Estimable: has estimatedEffort or description indicates scope
    const hasEstimate = req.estimatedEffort !== undefined && req.estimatedEffort !== null;
    const textLength = description.length;
    const isEstimable = hasEstimate || textLength > 20;
    scores.set('estimable', isEstimable ? 9 : 5);

    // Small: description < 200 chars and effort ≤ 5
    const isSmall = textLength < 200 && (req.estimatedEffort === undefined || req.estimatedEffort <= 5);
    scores.set('small', isSmall ? 9 : 6);

    // Testable: contains acceptance criteria signals
    const testableKeywords = ['given', 'when', 'then', 'should', 'must', 'accept', 'criteria', 'verify'];
    const isTestable = testableKeywords.some(kw => text.includes(kw));
    scores.set('testable', isTestable ? 9 : 5);

    return scores;
  }

  /**
   * Check completeness: has name, non-empty description, acceptance criteria signals, priority.
   */
  private checkCompleteness(req: Requirement): RequirementValidationIssue[] {
    const issues: RequirementValidationIssue[] = [];

    if (!req.name || req.name.trim().length === 0) {
      issues.push({
        criterion: 'completeness',
        issue: 'Missing requirement name',
        severity: 'critical',
        recommendation: 'Assign a clear, short name to the requirement',
      });
    }

    if (!req.description || req.description.trim().length === 0) {
      issues.push({
        criterion: 'completeness',
        issue: 'Missing or empty description',
        severity: 'critical',
        recommendation: 'Provide a detailed description of what this requirement is about',
      });
    }

    const description = (req.description || '').toLowerCase();
    const hasAcceptanceCriteria = ['given', 'when', 'then', 'should', 'must', 'scenario'].some(
      kw => description.includes(kw)
    );
    if (!hasAcceptanceCriteria) {
      issues.push({
        criterion: 'completeness',
        issue: 'No explicit acceptance criteria',
        severity: 'warning',
        recommendation: 'Add acceptance criteria using Given/When/Then or Should/Must format',
      });
    }

    if (!req.priority) {
      issues.push({
        criterion: 'completeness',
        issue: 'Priority not assigned',
        severity: 'info',
        recommendation: 'Assign priority: low, medium, or high',
      });
    }

    return issues;
  }

  /**
   * Check clarity: no ambiguous words, specific measurable language.
   */
  private checkClarity(req: Requirement): RequirementValidationIssue[] {
    const issues: RequirementValidationIssue[] = [];
    const text = `${req.name || ''} ${req.description || ''}`.toLowerCase();

    for (const word of this.ambiguousWords) {
      if (text.includes(word)) {
        issues.push({
          criterion: 'clarity',
          issue: `Ambiguous word: "${word}"`,
          severity: 'warning',
          recommendation: `Replace "${word}" with specific measurable language`,
        });
      }
    }

    // Check for vague metrics
    if (text.includes('fast') || text.includes('slow') || text.includes('big') || text.includes('small')) {
      issues.push({
        criterion: 'clarity',
        issue: 'Vague performance/size language (fast, slow, big, small)',
        severity: 'warning',
        recommendation: 'Use specific metrics: "< 100ms", "< 10MB", etc.',
      });
    }

    return issues;
  }

  /**
   * Check feasibility: estimated effort present, no contradictory constraints.
   */
  private checkFeasibility(req: Requirement): RequirementValidationIssue[] {
    const issues: RequirementValidationIssue[] = [];

    if (req.estimatedEffort === undefined || req.estimatedEffort === null) {
      issues.push({
        criterion: 'feasibility',
        issue: 'No estimated effort provided',
        severity: 'info',
        recommendation: 'Estimate effort (1-13 points, or story points)',
      });
    } else if (req.estimatedEffort > 13) {
      issues.push({
        criterion: 'feasibility',
        issue: `Estimated effort too high: ${req.estimatedEffort} (exceeds 13-point scale)`,
        severity: 'warning',
        recommendation: 'Break this requirement into smaller stories (≤ 13 points each)',
      });
    }

    // Check for contradictory constraints
    const text = `${req.name || ''} ${req.description || ''}`.toLowerCase();
    if ((text.includes('fast') && text.includes('slow')) ||
        (text.includes('maximum') && text.includes('unlimited'))) {
      issues.push({
        criterion: 'feasibility',
        issue: 'Contradictory constraints detected',
        severity: 'critical',
        recommendation: 'Clarify conflicting requirements and choose one direction',
      });
    }

    return issues;
  }

  /**
   * Generate summary string.
   */
  private generateSummary(
    scores: RequirementValidationScore[],
    passed: number,
    needsWork: number,
    failed: number
  ): string {
    const total = scores.length;
    const passPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

    if (passPercentage === 100) {
      return `✓ All ${total} requirements pass quality validation. Ready for implementation.`;
    } else if (passPercentage >= 80) {
      return `◐ ${passed}/${total} requirements pass (${passPercentage}%). Address ${needsWork} warnings before proceeding.`;
    } else if (passPercentage >= 50) {
      return `◕ ${passed}/${total} pass, ${needsWork} need work, ${failed} fail. Significant quality issues detected.`;
    } else {
      return `✗ ${failed}/${total} requirements fail validation. Major revisions needed.`;
    }
  }

  reset(): void {
    // No internal state to reset
  }
}

export function createRequirementsValidator(): RequirementsValidator {
  return new RequirementsValidator();
}
