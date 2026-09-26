import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint' //导入包
import { resolve } from 'path'

const config = () => {
  return {
    base: './',
    build: {
      lib: {
        entry: resolve(__dirname, './index.ts'),
        name: 'Editor',
        fileName: 'index'
      },
      outDir: resolve(__dirname, '../../dist')
    },
    plugins: [
      // 增加下面的配置项,这样在运行时就能检查eslint规范
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
      })
    ]
  }
}

export default defineConfig(config)
