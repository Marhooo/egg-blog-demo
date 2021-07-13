const os = require('os');
const child_process = require('child_process');

const cores = os.cpus().length;
// 当核心数只有 1 的时候，启动两个 worker 进程，其他情况根据 cpu 核心数启动 worker 进程
const workers = cores === 1 ? 2: cores;

const command = 'npm';
const argv = ['start', '--', `--workers=${workers}`];

const child = child_process.spawn(command, argv);
child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});