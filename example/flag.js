const { flag, output } = require('../src/index')
const program = flag()
const doc = output()

doc
  .writeUsage('flag <command> [options]', 'cli test')
  .write('测试测试测试', '\nflag plugin')

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
            console.log('你匹配了name标志位', info)
        }
    })
})

program
    .inject(doc)
    .name('自定义信息')
    .param({
        index: 0,
        action({index, param}, args) {
            if(!commandlist.some(a => a == param)) {
                console.log(`第一个参数必须是create或-h或--help或--version或或-V`)
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