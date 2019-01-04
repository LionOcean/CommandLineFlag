const args = process.argv.slice(2)
const exePath = process.argv[0]
const programPath = process.argv[1]

/**
 * @author Alan Chen
 * @since 2019/1/4
 * @version 0.0.1
 * @description 解析命令行参数的类，内置的方法均支持链式调用。匹配之后函数的执行顺序以链式调用顺序作为标准
 * @instance
 *  @method param 解析命令行参数的原始函数。
 *   @param {Object} 包含3个可选key：
 *                  index(参数索引) 可选 
 *                  flag(参数标志位名称) 可选
 *                  action(函数) 可选，有2个参数，第一个key为对象，包含两个key，index表示触发函数的当前参数索引。param表示为具体的参数名称。第二个key为数组，表示所有参数的列表
 *                      函数触发规则： 
 *                          1. 只有index时，只要index对应索引的参数存在，触发
 *                          2. 只有flag时，只要参数列表中存在flag，flag不需要索引匹配，触发
 *                          3. index和flag均存在，必须同时匹配索引和名称，触发
 *  @returns instance
 *  
 *  @method command 专门用于解析命令(索引为0)参数
 *   @param {String} flag 标志位名称，必选
 *   @param {Function} action 匹配flag成功触发的函数，返回参数同上
 *   @returns instance
 *  
 *  @method option 专门用于解析标志位(索引不定，只匹配flag)参数
 *   @param {String} flag 标志位名称，必选
 *   @param {Function} action 匹配flag成功触发的函数，返回参数同上
 *   @returns instance
 * 
 *  @method version 专门用于解析版本号标志位(索引不定，只匹配flag)参数，并输出版本号字符串
 *   @param {String} desc 版本号名称
 *   @param {String} flag 触发版本号标志位名称，可选，用于重写默认的标志位 '-V | --version'
 *   @returns instance
 * 
 *  @method register 全局注册特定解析参数的方法
 *   @param {String} name 需要注册的新方法名称
 *   @param {Function} handler 当使用实例的name方法时触发的函数，一般会使用param方法处理部分逻辑。
 *      例： 
 *          const program = new Flag()
 *          program.register('help', info => {
 *              // 如果想help方法链式调用，只需要返回program.param()或program
 *              program.param({
 *                  flag: '--help',
 *                  action() {
 *                      console.log(info)
 *                  }
 *              })
 *          })
 *          
 *          // 一旦注册成功，任何实例都可以使用help方法。
 *          program.help('你启用了help文档')
 *   @returns instance
 * 
 *  @method run 运行,通过命令行参数列表来匹配执行注册的到实例的action函数
 * 
 * @summary 必须要在program调用run方法，否则命令行不会被解析
 *                                    
 */
class Flag {
    constructor() {
        this._flagList = []
    }

    param({index, flag, action}) {
        this._flagList.push({
            index,
            flag,
            action
        })
        return this
    }

    register(name, handler) { 
        Flag.prototype[name] = handler
        return this
    }

    run() {
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
                return args.some(a => {
                    const FLAGLIST = item.flag.split('|')
                    return FLAGLIST.some(flag => flag.trim() == a)
                })
            }
            // 同时匹配index和flag
            else if(isAllExist) {
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

        targetFlagList.forEach(item => {
            if(item.action) {
                const index = item.index
                const param = item.flag
                item.action({index, param}, args)
            }
        })
    }

    command(flag, action) {
        return this.param({
            index: 0,
            flag,
            action
        })
    }

    option(flag, action) {
        return this.param({
            flag,
            action
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
}

module.exports = Flag