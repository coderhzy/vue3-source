// 这个文件会帮我打包package.json下的模块,最终会打包出js文件
// node dev.js 要打包的名字 -f 打包的格式    === args.slice(2)

import minimist from "minimist";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";
import { createRequire } from "module";

// node中命令行参数通过process.argv获取
const args = minimist(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url); // 获取文件的绝对路径 file: -> /usr
const __dirname = dirname(__filename); // 获取文件的目录
const require = createRequire(import.meta.url); // 获取require方法
const target = args._[0] || 'reactivity';
const format = args.f || "iife"; // 打包后的格式化规范

// 入口文件,根据命令行提供的路径来进行解析
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const pkg = require(`../packages/${target}/package.json`);

// 根据需要进行打包
esbuild.context({
    entryPoints: [entry], // 入口
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`), // 出口
    bundle: true, // reactivity -> shared 会打包到一起
    platform: 'browser', // 打包给浏览器使用
    sourcemap: true, // 可以调试源码
    format, // 打包格式 module-export ->cjs,  立即执行函数 ->  iife ,  import-export -> esm
    globalName: pkg.buildOptions?.name, // iife格式下的全局变量名
}).then((ctx) => {
    console.log(`🎉 ${target} 打包成功`);

    return ctx.watch() // 监听入口文件 持续打包处理
})