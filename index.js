const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const {User} = require("./models/User");

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://shy_0215:12345@login-temp.g5pfoy1.mongodb.net/?retryWrites=true&w=majority'
).then(()=> console.log('MongoDB connected...'))
 .catch(err => console.log(err))
//bodyparser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 가져오는것

//application/x-www-form-urlencoded <-를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res)=>{
  //회원가입할 때 필요한 정보를 클라이언트에서 가져오면 DB에 넣어줌
  const user = new User(req.body)
  
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})