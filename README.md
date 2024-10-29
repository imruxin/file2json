# 将 JS 或 JSON 文件以 JSON 格式返回前端

请求地址：`/api/xxx/xxx` ，不需要带上`.js|json`后缀。

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

```bash
node app.js
# 或者借助pm2
pm2 start app.js
```
