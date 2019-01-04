/**
 * @description 包入口
 */
const Flag = require('./core/flag')

module.exports = {
    flag() {
        return new Flag()
    }
}