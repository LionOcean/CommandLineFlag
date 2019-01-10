const Output = require('./output')
const args = process.argv.slice(2)
const exePath = process.argv[0]
const programPath = process.argv[1]

/**
 * @function 判断参数是否为函数(包括异步函数)
 * @param {*} fn
 * @returns {Boolean}  
 */
const checkTypeFitFunction = fn => {
    return Object.prototype.toString.call(fn) == '[object Function]'
        || Object.prototype.toString.call(fn) == '[object AsyncFunction]'
}
/**
 * @module Flag
 * @version 0.0.2
 * @description 解析命令行参数的类，内置的方法均支持链式调用。匹配之后函数的执行顺序以链式调用顺序作为标准
 * @author Alan Chen
 * @since 2019/1/9
 * @instance
 *  @method param 解析命令行参数的原始函数。
 *   @param {Object} 包含3个可选key：
 *                  index(参数索引) 可选 
 *                  flag(参数标志位名称) 可选
 *                  action(函数) 可选，有2个参数，第一个参数为对象，包含两个key，index表示触发函数的当前参数索引。param表示为具体的参数名称。第二个参数为数组，表示所有参数的列表
 *                      函数触发规则： 
 *                          1. 只有index时，只要index对应索引的参数存在，触发
 *                          2. 只有flag时，只要参数列表中存在flag，flag不需要索引匹配，触发
 *                          3. index和flag均存在，必须同时匹配索引和名称，触发
 *   @returns instance
 *  
 *  @method command 专门用于解析命令(索引为0)参数，如果只有两个参数，第二个参数必须为action，如果有三个参数，则第二个参数为desc，第三个参数为action
 *   @param {String} flag 标志位名称，必选
 *   @param {String} desc 帮助文档信息
 *   @param {Function} action 匹配flag成功触发的函数，返回参数同上
 *   @returns instance
 *  
 *  @method option 专门用于解析标志位(索引不定，只匹配flag)参数，如果只有两个参数，第二个参数必须为action，如果有三个参数，则第二个参数为desc，第三个参数为action
 *   @param {String} flag 标志位名称，必选
 *   @param {String} desc 帮助文档信息
 *   @param {Function} action 匹配flag成功触发的函数，返回参数同上
 *   @returns instance
 * 
 *  @method version 专门用于解析版本号标志位(索引不定，只匹配flag)参数，并输出版本号字符串
 *   @param {String} desc 版本号名称
 *   @param {String} flag 触发版本号标志位名称，可选，用于重写默认的标志位 '-V | --version'
 *   @returns instance
 * 
 *  @method register 全局注册实例方法，用于自定义某个方法来频繁使用，例如command、option和version方法均是register实现
 *   @param {String} name 需要注册的新方法名称
 *   @param {Function} handler 当使用实例的name方法时触发的函数，一般会使用param方法处理部分逻辑。
 *      例： 
 *          const program = new Flag()
 *          program.register('help', info => {
 *              // 如果需要help方法链式调用，只需要返回program.param()或program
 *              return program.param({
 *                  flag: '--help',
 *                  action() {
 *                      console.log(info)
 *                  }
 *              })
 *          })
 *          
 *          // 一旦注册成功，任何Flag实例都可以使用help方法。
 *          program.help('你启用了help文档')
 *   @returns instance
 * 
 *  @method inject 注入Output实例，并且在run的过程中根据命令参数来输出文档信息
 *   @param {Object} OutputInstancen 需要注册的Output实例
 *   @returns instance
 * 
 *  @method run 运行,通过命令行参数列表来匹配执行注册到实例的action函数
 * 
 * @summary 必须调用run方法，否则命令行不会被解析 
 *                                 
 */
class Flag {
    constructor() {
        this._outputIns = null
        this._flagList = []
    }

    param({index, flag, desc, action}) {
        this._flagList.push({
            index,
            flag,
            action,
            desc
        })
        return this
    }

    register(name, handler) { 
        Flag.prototype[name] = handler
        return this
    }

    command(flag, ...rest) {
        let desc, action
        if(rest.length == 1) {
            if(checkTypeFitFunction(rest[0])) {
                action = rest[0]
            }
            else {
                throw new Error('if there are only two arguments, the second one must be function')
            }
        }
        else if(rest.length == 2) {
            desc = rest[0]
            if(checkTypeFitFunction(rest[1])) {
                action = rest[1]
            }
            else {
                throw new Error('if there are three arguments, the third one must be function')
            }
        }

        return this.param({
            index: 0,
            flag,
            action,
            desc
        })
    }

    option(flag, ...rest) {
        let desc, action
        if(rest.length == 1) {
            if(checkTypeFitFunction(rest[0])) {
                action = rest[0]
            }
            else {
                throw new Error('if there are only two arguments, the second one must be function')
            }
        }
        else if(rest.length == 2) {
            desc = rest[0]
            if(checkTypeFitFunction(rest[1])) {
                action = rest[1]
            }
            else {
                throw new Error('if there are three arguments, the third one must be function')
            }
        }

        return this.param({
            flag,
            action,
            desc
        })
    }

    version(desc, flag='-V | --version') {
        return this.param({
            index: 0,
            flag,
            action() {
                console.log(desc)
            }
        })
    }

    inject(ins=null) {
        if(Boolean(ins) && Object.getPrototypeOf(ins) == Output.prototype && ins.constructor == Output) {
            this._outputIns = ins
            return this
        }
        else {
            throw new Error('you can only inject an Output instance to Flag instance')
        }
    }

    async run() {
        // 过滤得到匹配flag的操作，如果注入了Output实例，则补全实例中的command文档或option文档
        let targetFlagList = this._flagList.filter(item => {
            const isOnlyIndexExist = typeof item.index == 'number' && !Boolean(item.flag)
            const isOnlyFlagExist = typeof item.index != 'number' && Boolean(item.flag)
            const isAllExist = typeof item.index == 'number' && Boolean(item.flag)

            // 只匹配index
            if(isOnlyIndexExist) {
                return args.some((a, i) => {
                    return i == item.index
                })
            }
            // 只匹配flag
            else if(isOnlyFlagExist) {
                // 补全Output实例中的option文档
                if(this._outputIns && item.desc) {
                    this._outputIns.writeOptions(item.flag, item.desc)
                }

                return args.some(a => {
                    const FLAGLIST = item.flag.split('|')
                    return FLAGLIST.some(flag => flag.trim() == a)
                })
            }
            // 同时匹配index和flag
            else if(isAllExist) {
                // 补全Output实例中的command文档
                if(this._outputIns && item.desc) {
                    this._outputIns.writeCommands(item.flag, item.desc)
                }

                return args.some((a, i) => {
                    const FLAGLIST = item.flag.split('|')
                    return FLAGLIST.some(flag => flag.trim() == a) && i == item.index
                })
            }
        })

        // 补全匹配的index或flag信息
        targetFlagList = targetFlagList.map(item => {
            let index, flag
            if(item.index == undefined) {
                const FLAGLIST = item.flag.split('|')
                index = args.findIndex(a => FLAGLIST.some(f => f.trim() == a))
                return {...item, index}
            }
            else if(item.flag == undefined) {
                flag = args[item.index]
                return {...item, flag}
            }
            else {
                return item
            }
        })

        this._flagList = targetFlagList

        // 执行匹配项中的action逻辑, 需要考虑到每个action是异步操作，所以run函数必须是async
        for(let item of targetFlagList) {
            if(item.action) {
                const index = item.index
                const param = item.flag
                await item.action({index, param}, args)
            }
        }

        // 如果注入了Output实例，则在没有任何参数的情况下，render实例，输出帮助文档
        if(this._outputIns && args.length == 0) {
            this._outputIns.render()
        }
    }
}

module.exports = Flag