import express from 'express';
import allRouter from './router/connect.router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}))


// read cookies from the request

app.use(cookieParser());

app.use(cors({

  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: true,
  optionsSuccessStatus: 204,

  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Origin",
    "Access-Control-Expose-Headers",
    "Access-Control-Max-Age",
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
  ],
  exposedHeaders: [
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
    "Access-Control-Expose-Headers",
    "Access-Control-Max-Age",
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
  ],
  maxAge: 86400,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",


}));


/*  
    preflight requests allow to all access to the server

**/

app.options('*', cors());

app.use(morgan("dev"))



app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use("/api", allRouter);



app.use("*", (req, res) => {

  return res.status(404).json({
    success: false,
    message: "this path is not available in our servers ",
    
  })

})



export default app;