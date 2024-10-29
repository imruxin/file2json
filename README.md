# 将 JS 或 JSON 文件以 JSON 格式返回前端

- 请求地址类似：`/api/xxx/xxx` ，不需要带上`.js|json`后缀
- 运行前自定义调整和修改 `app.js` 中 **基于路径指定文件夹根目录** 处相关的路径和文件夹
- 会自动根据路径查找对应的js|json文件，并返回
- 本地文件有更新，重新请求一下就可以看到更新后的数据了
- 如果路径不存在，则会兜底查找目录下的index.js|json文件，再返回
- 全都不存在就返回404

```js
module.exports = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
};
```

```json
[
  {
    "name": "John Doe json",
    "age": 30,
    "email": "john@example.com"
  },
  {
    "name": "John Doe json2",
    "age": 30,
    "email": "john@example.com"
  }
]
```

## 运行

1. 运行前自定义调整和修改 `app.js` 中 **基于路径指定文件夹根目录** 处相关的路径和文件夹。
2. 需要修改端口的话直接修改 `app.js` 中的 `const port = 3300;` 。
3. 需要域名访问的话，可以利用 nginx 等配置反向代理即可。

```bash
# 1. 安装依赖
npm install
# 2. 直接运行
node app.js
# 或者借助pm2
pm2 start app.js
```

## 其他

需求不复杂，也不需要各种mock数据。本来是想基于 [JSON-SERVER](https://github.com/typicode/json-server) 把自己的一些文件通过接口方式返回给前端页面，但是发现json-server只支持单文件，不支持多文件，所以就自己简单的写了一个。
