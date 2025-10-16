const fs = require('fs');

const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
const lines = schema.split('\n');

const models = [];
const modelsWithBranchId = [];
const modelsWithoutBranchId = [];

for (let i = 0; i < lines.length; i++) {
  const modelMatch = lines[i].match(/^model\s+(\w+)/);
  if (modelMatch) {
    const modelName = modelMatch[1];
    models.push(modelName);

    let j = i + 1;
    let hasBranchId = false;
    let modelEndFound = false;

    while (j < lines.length && !modelEndFound) {
      if (lines[j].match(/^}/)) {
        modelEndFound = true;
      } else if (lines[j].includes('branch_id')) {
        hasBranchId = true;
      }
      j++;
    }

    if (hasBranchId) {
      modelsWithBranchId.push(modelName);
    } else {
      modelsWithoutBranchId.push(modelName);
    }
  }
}

console.log('='.repeat(60));
console.log('MODELS TANPA branch_id:');
console.log('='.repeat(60));
modelsWithoutBranchId.forEach((m) => console.log(`- ${m}`));

console.log('\n' + '='.repeat(60));
console.log('SUMMARY:');
console.log('='.repeat(60));
console.log(`Total Models: ${models.length}`);
console.log(`Models DENGAN branch_id: ${modelsWithBranchId.length}`);
console.log(`Models TANPA branch_id: ${modelsWithoutBranchId.length}`);

// Save to file for reference
fs.writeFileSync(
  'models-without-branch-id.txt',
  modelsWithoutBranchId.join('\n'),
);
console.log('\n✓ List saved to: models-without-branch-id.txt');



