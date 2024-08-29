const { execSync } = require('child_process');

function runCommand(command) {
  console.log(`Executing: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

function main() {
  console.log('Running migration');

  // Install Prisma Client
  runCommand('npm install prisma --save-dev');
  runCommand('npm i --save-dev prisma');
  runCommand('npm i @prisma/client');

  // Generate Prisma Migrations
  runCommand(
    'npx prisma migrate dev --schema ./prisma/schema.prisma --name initial-state'
  );

  // Generate Prisma Migrations for mongoDB
  // runCommand('npx prisma db push --force-reset');

  console.log('Migration complete');
}

main();
