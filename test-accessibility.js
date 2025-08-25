// Test script for accessibility validation
const { generateAccessibilityReport, validateSemanticColors } = require('./lib/accessibility.ts');

console.log('=== Accessibility Report for Color Tokenization System ===\n');

const validation = validateSemanticColors();
console.log('All combinations pass WCAG AA:', validation.allPass);

if (!validation.allPass) {
  console.log('\nIssues found:');
  validation.issues.forEach(issue => {
    console.log(`- ${issue.combination}: ${issue.issue}`);
  });
}

console.log('\nDetailed Report:');
const report = generateAccessibilityReport();
report.forEach(item => {
  console.log(`${item.combination}:`);
  console.log(`  Contrast Ratio: ${item.contrastRatio}:1`);
  console.log(`  WCAG AA: ${item.aaCompliance ? '✓' : '✗'}`);
  console.log(`  WCAG AAA: ${item.aaaCompliance ? '✓' : '✗'}`);
  console.log(`  Recommendation: ${item.recommendation}\n`);
});