const assert = require('assert')
const {execFile} = require('child_process')

/**
 * @description mocha unit tests with node assert module
 */
describe('flag execute cmd params', function() {
    it('command method should match the first param ', function(done) {
        execFile('node', ['./test/flag.demo.js', 'init', 'a.js'], (err, stdout, stderr) => {
            if(err) {
                done(err)
            }
            assert.equal(stdout, 'a.js init successfully\n')
            done()
        })
    })

    it('option method should match any param dependding on flag ', function(done) {
        execFile('node', ['./test/flag.demo.js', '--cmd', 'node', '--version'], (err, stdout, stderr) => {
            if(err) {
                done(err)
            }
            assert.equal(stdout, 'run node --version successfully\n')
            done()
        })
    })

    it('version method should match -V or --version flag and output somme messages ', function(done) {
        execFile('node', ['./test/flag.demo.js', '--version'], (err, stdout, stderr) => {
            if(err) {
                done(err)
            }
            assert.equal(stdout, '0.0.1\n')
            done()
        })
    })
})