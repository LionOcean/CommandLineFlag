/**@module Output
 * @version 0.0.1
 * @description 输出cli文档的工具，内置的方法均支持链式调用。
 * @author Alan Chen
 * @since 2019/1/7
 * @instance
 *  @method writeUsage 输出usage信息
 *   @param {String} usageInfo usage直接打印出来的信息
 *   @param {String} description usage下方换行显示的cli的说明信息
 *   @returns instance
 *  
 *  @method writeCommands 输出command命令的信息
 *   @param {String | Array} info 
 *          当只有一个参数时，必须是数组，数组项包含2个key: title(左侧的command名称)和desc(右侧的描述)
 *          当有两个参数时，参数均为字符串，参数一是command名称，参数二是描述
 *   @returns instance
 *  
 *  @method writeOptions 输出option标志位的信息
 *   @param {String | Array} info 
 *          当只有一个参数时，必须是数组，数组项包含2个key: title(左侧的option名称)和desc(右侧的描述)
 *          当有两个参数时，参数均为字符串，参数一是option名称，参数二是描述
 *   @returns instance
 * 
 *  @method write 插入文档尾部的信息，可以自定义文档信息，可以多次调用，多次调用会叠加而不会覆盖
 *   @param {String} desc 信息，支持多个参数
 *   @returns instance
 * 
 *  @method render 渲染文档并输出到stdout，同时返回文档的字符串
 * 
 * @summary 必须调用render方法，否则文档不会被输出
 *                                    
 */
class Output {
    constructor(opt) {
        this.configs = {
            stringIndent: {
                command: opt && opt.indent.command || 8,
                option: opt && opt.indent.command || 3
            }
        }

        this._content = {
            usage: '',
            commands: [],
            options: [],
            custom: ''
        }
    }

    write(...rest) {
        rest.forEach(item => {
            this._content.custom += item
        })
        return this
    }

    writeUsage(...rest) {
        if(rest.length == 1) {
            this._content.usage = rest[0]
        }
        else if(rest.length == 2) {
            this._content.usage = `${rest[0]}

    ${rest[1]}`
        }
        return this
    }

    writeCommands(...rest) {
        if(rest.length == 2){
            this._content.commands.push({
                title: rest[0], 
                desc: rest[1]
            })
        }
        else if(rest.length == 1 && Array.isArray(rest[0])) {
            rest[0].forEach(item => {
                this._content.commands.push({
                    title: item['title'], 
                    desc: item['desc']
                })
            })
        }
        return this
    }

    writeOptions(...rest) {
        if(rest.length == 2){
            this._content.options.push({
                title: rest[0], 
                desc: rest[1]
            })
        }
        else if(rest.length == 1 && Array.isArray(rest[0])) {
            rest[0].forEach(item => {
                this._content.options.push({
                    title: item['title'], 
                    desc: item['desc']
                })
            })
        }
        return this
    }

    _formatString(source, indent) {
        const seperator = `
    `
        return '  ' + source.map((item, i, current) => {
            if(i == 0) {
                const commandRegExpFlag = ' '.repeat(indent)
                return item.title + commandRegExpFlag + item.desc
            }
            else {
                const gap = current[0].title.length + indent
                const repeatNum = gap - item.title.length
                const commandRegExpFlag = ' '.repeat(repeatNum)
                return item.title + commandRegExpFlag + item.desc
            }
        })
        .join(seperator)
    }

    render() {
        let usageStr = `
  Usage: `
        usageStr += this._content.usage

        let commandStr = `
  
  Commands: 
  
  `
        commandStr += this._formatString(this._content.commands, this.configs.stringIndent.command)

        let optionStr = `
  
  Options:
  
  `
        optionStr += this._formatString(this._content.options, this.configs.stringIndent.option)

        const customStr = this._content.custom

        let outputStr = usageStr
       
        if(this._content.commands.length > 0) {
            outputStr += commandStr
        }
        if(this._content.options.length > 0) {
            outputStr += optionStr
        }
        outputStr += `

${customStr}`
        console.log(outputStr)
        return outputStr
    }
}

module.exports = Output