/**
 * @description 包入口
 */
const Flag = require('./core/flag')
const Output = require('./core/output')

module.exports = {
    flag() {
        return new Flag()
    },
    output() {
        return new Output()
    }
}