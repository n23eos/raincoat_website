'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateGate } = require('../assets/cases.js');

const baseline = {
  baselineObjective: 80,
  baselineTokens: 10000
};

test('accepts a candidate exactly on every gate boundary', () => {
  const result = evaluateGate({
    ...baseline,
    candidateWinRate: 0.55,
    candidateObjective: 72,
    candidateTokens: 15000
  });

  assert.equal(result.accepted, true);
  assert.deepEqual(result.reasons, []);
  assert.equal(result.objectiveRegression, 10);
  assert.equal(result.tokenRatio, 1.5);
});

test('rejects a candidate below the minimum win rate', () => {
  const result = evaluateGate({
    ...baseline,
    candidateWinRate: 0.549,
    candidateObjective: 80,
    candidateTokens: 10000
  });

  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['win_rate']);
});

test('rejects a candidate beyond the objective regression limit', () => {
  const result = evaluateGate({
    ...baseline,
    candidateWinRate: 0.7,
    candidateObjective: 71.99,
    candidateTokens: 10000
  });

  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['objective_regression']);
});

test('rejects a candidate beyond the token cost limit', () => {
  const result = evaluateGate({
    ...baseline,
    candidateWinRate: 0.7,
    candidateObjective: 80,
    candidateTokens: 15001
  });

  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['token_cost']);
});
