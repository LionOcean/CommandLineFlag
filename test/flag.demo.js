const program = require('../src/index').flag()

program
    .command('init', ({index, param}, args) => {
        console.log(`${args[index+1]} init successfully`)
    })
    .option('--cmd', ({index, param}, args) => {
        console.log(`run ${args[index+1]} ${args[index+2]} successfully`)
    })
    .version('0.0.1')
    .run()