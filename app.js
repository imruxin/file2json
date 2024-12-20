const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3300;

// 定义一个函数来处理请求
const commonFn = (req, res, dir = "data") => {
  // 指定要读取的目录
  const baseDirectoryPath = path.join(__dirname, dir);
  // 获取请求路径的相对部分
  let relativePath = req.params[0]; // 这将获取到/api/后面的所有内容
  // 清理和验证路径
  const normalizedPath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(baseDirectoryPath, normalizedPath);
  // 验证路径是否在允许的目录内
  if (!fullPath.startsWith(baseDirectoryPath)) {
    return res.status(403).send('Access Denied');
  }
  
  // 处理直接的文件请求
  if (relativePath.endsWith(".json")) {
    return res.sendFile(fullPath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(err.status || 500).send('Error sending file');
      }
    });
  }

  const jsFilePath = path.join(baseDirectoryPath, `${normalizedPath}.js`);
  const jsonFilePath = path.join(baseDirectoryPath, `${normalizedPath}.json`);
  const indexJsFilePath = path.join(
    baseDirectoryPath,
    normalizedPath,
    "index.js"
  );
  const indexJsonFilePath = path.join(
    baseDirectoryPath,
    normalizedPath,
    "index.json"
  );

  // 尝试读取/api/name.js
  fs.readFile(jsFilePath, "utf8", (err, fileContent) => {
    if (!err) {
      // 使用require来获取JS文件的导出内容
      try {
        const moduleExports = require(jsFilePath);
        return res.json(moduleExports);
      } catch (requireErr) {
        console.error("Error requiring JS file:", requireErr);
        return res.status(500).send("Internal Server Error");
      }
    }

    // 尝试读取/api/name.json
    fs.readFile(jsonFilePath, "utf8", (err, jsonContent) => {
      if (!err) {
        try {
          const jsonData = JSON.parse(jsonContent);
          return res.json(jsonData);
        } catch (parseErr) {
          console.error("Error parsing JSON file:", parseErr);
          return res.status(500).send("Internal Server Error");
        }
      }

      // 如果/api/name.js和/api/name.json都不存在,尝试读取/api/name/index.js
      fs.readFile(indexJsFilePath, "utf8", (err, fileContent) => {
        if (!err) {
          try {
            const moduleExports = require(indexJsFilePath);
            return res.json(moduleExports);
          } catch (requireErr) {
            console.error("Error requiring index JS file:", requireErr);
            return res.status(500).send("Internal Server Error");
          }
        }

        // 尝试读取/api/name/index.json
        fs.readFile(indexJsonFilePath, "utf8", (err, jsonContent) => {
          if (!err) {
            try {
              const jsonData = JSON.parse(jsonContent);
              return res.json(jsonData);
            } catch (parseErr) {
              console.error("Error parsing index JSON file:", parseErr);
              return res.status(500).send("Internal Server Error");
            }
          }

          // 如果所有文件都找不到,返回404错误
          res.status(404).send("Not found");
        });
      });
    });
  });
}

// 基于路径指定文件夹根目录，api => data
app.get("/api/*", (req, res) => commonFn(req, res, "data"));

// 基于路径指定文件夹根目录 box => box
app.get("/box/*", (req, res) => commonFn(req, res, "box"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
