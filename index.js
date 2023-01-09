const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {User} = require("./models/User");
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

mongoose.connect(config.mongoURI
).then(()=> console.log('MongoDB connected...'))
 .catch(err => console.log(err))
//bodyparser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 가져오는것

//application/x-www-form-urlencoded <-를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

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

//로그인 라우트 만들기
app.post('/login', (req,res) => {
  //요청된 이메일을 DB에서 있는지 찾기
  User.findOne({email: req.body.email}, (err, user)=>{ 
    if(!user){
      return res.json({
        loginSuccess: false,
        message:"존재하지 않는 이메일 입니다."
      })
    }
    //요청된 이메일이 있으면 PW가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})
      //PW가 맞다면 token 생성
      user.generateToken((err, user)=>{
        if(err) return res.status(400).send(err);
        //토큰저장 (쿠키, 로컬스토리지 등등..에 가능)
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess:true, userId: user._id})

      })
    })
  })
})
