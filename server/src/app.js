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

const allowedOrigins = [
  "*",
  '*'
];

app.use(cors({
  origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD", "CONNECT"],

  allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
      "content" // Add custom header 'content' or any other you're using
  ],
  exposedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers"
  ],



  preflightContinue: true,
  optionsSuccessStatus: 200
}));


// Handle preflight requests for all routes
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