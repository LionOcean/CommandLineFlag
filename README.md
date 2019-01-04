# CommandLineFlag
An easy tool for generating CLI and controling command params

> version: 0.0.1

> Date: 2019/1/4

> 模板集成了插件打包，一键配置package.json和mocha测试等功能

## Feature
* 提供完善的webpack打包配置文件，目前支持vue和原生js插件，不支持jsx文件。
* 新增提取vue文件中的css到单独的css文件。
* 提供一键配置包名和具体配置等功能，配置入口在config文件里的lib.config.js。
* 一键配置支持命令行参数操作，有常用的4个命令行参数。
* 支持mocha测试，提供了trasvi-ci配置文件。

## Dictionary tree
``` bash
    ├─config
    ├─dist
    └─src
    └─test
```
1. config文件夹是一键配置package.json的代码，lib.config.js是配置入口，缓存文件也会存在config内。
2. src文件夹内必须要存在index.js，作为webpack打包的入口。
3. dist文件夹内是最终打包生成的js文件，bundle名称在config里配置。
4. test文件夹存放的是测试文件，约定测试文件必须满足`*.test.js`，即必须以`.test.js`后缀名结尾。

## Usage
> 强烈建议通过我仓库内的[alan-cli](https://github.com/alanchenchen/alan-cli)来使用，非常便捷！
* `git clone https://github.com/alanchenchen/library-template.git`
* `yarn` or `npm install` 安装依赖
* `yarn run config` or `npm run config` 一键配置package.json，一般为如下操作顺序：
    1. `yarn run config g` or `npm run config g` 生成package.json缓存文件，注意这只是个临时文件，不会覆盖源package.json，可以通过`yarn run config rm`删除。
    2. `yarn run config d` or `npm run config d` 部署package.json缓存文件，会覆盖package.json，并且删除缓存文件。
* `npm run build` 打包src内的index.js。
* `npm publish` 登陆npm账号，然后发布npm包。

## Unit test
* clone仓库
* 在test目录新增以`.test.js`后缀名结尾的文件，编写符合mocha框架的测试用例，可以编写单元测试用例。
* 可以在travis-ci官网开启github对应仓库的自动化脚本。

## Attentions
1. 一定要善用`yarn run config`命令，不熟悉参数，可以通过`yarn run config`或者`yarn run config h`来查看使用说明。
2. `yarn run config` 命令参数如下
``` 
    Usage:

        g  generate the temporary.json, if there is already one it will be overlapped
        rm  remove the temporary.json
        d  apply the temporary.json to root path
        h  show the config command help
```
3. 最好不要手动更改源package.json，如果一定要修改，只能添加key字段，不要删除。否则一键配置会出错。

