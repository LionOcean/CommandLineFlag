const { flag, output } = require('../src/index')
const program = flag()
const doc = output()

doc
  .writeUsage('flag <command> [options]', 'cli test')
  .write('test', '\nflag plugin')

const commandlist = [
    'create',
    '--help',
    '-h',
    '--version',
    '-V'
]

program.register('name', (info) => {
    return program.param({
        flag: 'name',
        action() {
            console.log('match name flag successfully', info)
        }
    })
})

program
    .inject(doc)
    .name('hello flag!')
    .param({
        index: 0,
        action({index, param}, args) {
            if(!commandlist.some(a => a == param)) {
                console.log(`the first argument must be create | -h | --help | --version | -V`)
            }
        }
    })
    .command('init','init tset', ({index, param}, args) => {
        console.log(`init: ${args[index+1]}`)
    })
    .command('build', 'build tset', ({index, param}, args) => {
        console.log(`build: ${args[index-1]}`)
    })
    .option('--load', 'watch file but hot-reload anohter file', ({index, param}, args) => {
        console.log(`load: ${args[index+1]}`)
    })
    .option('--cmd', 'watch file but hot-reload a cmd', ({index, param}, args) => {
        console.log(`cmd: ${args[index+1]}`)
    })
    .version('0.0.3')
    .run()

// console.log(program)
// console.log(doc)