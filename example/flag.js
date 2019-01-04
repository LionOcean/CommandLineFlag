const { flag } = require('../src/index')
const program = flag()

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
    .name('自定义信息')
    .param({
        index: 0,
        action({index, param}, args) {
            if(!commandlist.some(a => a == param)) {
                console.log(`第一个参数必须是create或-h或--help或--version或或-V`)
            }
        }
    })
    .option('--help | -h', ({index, param}, args) => {
        console.log(`help for: ${args[index-1]}`)
    })
    .command('create',({index, param}, args) => {
        console.log(`create: ${args[index+1]}`)
    })
    .version('0.0.3')
    .run()

// console.log(program)
