// 1. 모듈 - require
const express = require("express");
const app = express();
const cors = require("cors");

const db = require("./models");
const { User, Product } = db;

// 2. use, set - 등록
app.use(express.static(__dirname + "/public"));
app.use(cors());

app.use(express.json()); // json 형태로 데이터 처리
app.use(express.urlencoded({ extended: true })); // queryString 형식의 데이터 처리

// 3. listen - 포트번호 지정
app.listen(5000, () => {
  console.log("접속 성공! - http://localhost5000 ");
});

// 4. 하위페이지들 - 라우팅

//------------------productList-------------------

app.get("/", async (req, res) => {
  const result = await Product.findAll();

  res.json(result);
});

app.post("/productList/add", (req, res) => {
  Product.create();

  res.redirect("/productList");
});
