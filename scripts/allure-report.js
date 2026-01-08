const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function runSync(cmd, args, opts = {}) {
  return spawnSync(cmd, args, Object.assign({ stdio: 'inherit', shell: false }, opts));
}

function runCapture(cmd, args) {
  return spawnSync(cmd, args, { encoding: 'utf8', shell: false });
}

function exists(p) {
  try { return fs.existsSync(p); } catch (e) { return false; }
}

const resultsDir = path.resolve(process.cwd(), 'allure-results');
const reportDir = path.resolve(process.cwd(), 'allure-report');

console.log('Attempting to generate Allure report using local "npx allure"...');
let res = runCapture('npx', ['allure', 'generate', '--clean', '-o', reportDir]);

if (res.status === 0) {
  console.log('Allure report generated successfully with local "npx allure".');
  serveReport(reportDir);
} else {
  const stderr = (res.stderr || '') + (res.stdout || '');
  const javaMissing = /Unable to locate a Java Runtime|Could not find Java/gi.test(stderr) || /No JVM/gi.test(stderr);
  console.warn('Local generation failed.');
  if (javaMissing) {
    console.warn('Reason: Java runtime seems to be missing.');
  } else {
    console.warn('Output:', stderr.trim().slice(0, 200));
  }

  // Try Docker fallback if available
  const dockerCheck = runCapture('docker', ['--version']);
  if (dockerCheck.status === 0) {
    console.log('Docker detected. Attempting to generate Allure report inside Docker container...');
    // Example uses frankescobar/allure-cli image that provides "allure" binary
    const pwd = process.cwd();
    const dockerArgs = [
      'run', '--rm',
      '-v', `${pwd}/allure-results:/app/allure-results`,
      '-v', `${pwd}/allure-report:/app/allure-report`,
      'frankescobar/allure-cli',
      'allure', 'generate', '/app/allure-results', '--clean', '-o', '/app/allure-report'
    ];
    const dockerRes = runSync('docker', dockerArgs);
    if (dockerRes.status === 0) {
      console.log('Allure report generated successfully via Docker.');
      serveReport(reportDir);
      return;
    } else {
      console.warn('Docker generation failed (see output above).');
    }
  } else {
    console.warn('Docker not found or not usable on this machine.');
  }

  // If we have an existing report directory, serve it
  if (exists(reportDir) && fs.readdirSync(reportDir).length > 0) {
    console.log('Found existing allure-report directory — serving it now.');
    serveReport(reportDir);
    return;
  }

  // Final fallback: instruct user how to install Java or use Docker
  console.error('\nUnable to generate Allure report automatically.\n');
  console.error('Options to proceed:');
  console.error('1) Install Java (JRE 11+). Download: https://adoptopenjdk.net/ or https://www.java.com');
  console.error('   Then run: npx allure generate --clean -o allure-report');
  console.error('2) If you have Docker, you can run (example):');
  console.error(`   docker run --rm -v ${process.cwd()}/allure-results:/app/allure-results -v ${process.cwd()}/allure-report:/app/allure-report frankescobar/allure-cli allure generate /app/allure-results --clean -o /app/allure-report`);
  console.error('3) If you only want to open an existing report directory, run: npx serve -s allure-report -l 8080');
  process.exit(1);
}

function serveReport(dir) {
  if (!exists(dir) || fs.readdirSync(dir).length === 0) {
    console.error('No report to serve at', dir);
    process.exit(1);
  }
  console.log('Serving report at http://localhost:8080 (use Ctrl+C to stop)');
  // Use npx serve so we don't need a global server package
  const proc = spawn('npx', ['serve', '-s', dir, '-l', '8080'], { stdio: 'inherit', shell: false });
  proc.on('close', (code) => {
    process.exit(code);
  });
}
