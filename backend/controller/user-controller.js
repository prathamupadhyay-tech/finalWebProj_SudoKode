import user from "../models/user";
import emailValidator from "deep-email-validator";
import axios from 'axios';
import { request, GraphQLClient, gql } from "graphql-request";

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await user.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No Users found" });
  } else {
    return res.status(200).json({ users });
  }
};
export const signup = async (req, res, next) => {
  const {
    name,
    email,
    password,
    leetcodeId,
    phoneNumber,
    hackerRankId,
    codeNinjaId,
  } = req.body;
  let userExists;
  let newUser;
  try {
    userExists = await user.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (userExists) {
    return res.status(400).json({ message: "User Already Exists" });
  } else {
    async function isEmailValid(email) {
      return emailValidator.validate({email:email , sender : 'stanish.mi@gmail.com'});
    }
    
    if (true) {
       newUser = new user({
        name,
        email,
        password,
        leetcodeId,
        phoneNumber,
        hackerRankId,
        codeNinjaId,
        reminders: [],
        userBlog: [],
      });

      try {
        await newUser.save();
      } catch (err) {
        return console.log(err);
      }
    } else {
      return res.status(400).send({
        message: "Please provide a valid email address.",
        reason: validators[reason].reason,
      });
    }

    return res.status(201).json({ newUser , message: "User Created" });
  }
};

export const login = async (req, res, next) => {
  const { email, password, leetcodeId } = req.body;
  let newUser;
  try {
    newUser = await user.findOne({ email }).populate("userBlog");
    if (!newUser) {
      return res.status(400).json({ message: "User Not Found" });
    }
    if (newUser && newUser.password === password) {
      return res.status(201).json({ newUser });
    } else {
      return res.status(400).json({ message: "Wrong Password" });
    }
  } catch (err) {
    return console.log(err);
  }
};

const getData= gql`
query userProblemSolved($username:String!){
     matchedUser(username:$username) {
           problemsSolvedBeatsStats
           {

               difficulty
                   percentage
                         }
                         submitStatsGlobal {
                               acSubmissionNum {
                                   difficulty 
                                   count
                                       }
                                      }
                                    }
                                 }`;
 export const leetcodeData =async(req,res,next) =>{
  const username = req.params.leetcodeId;
  let allLeet;
  try{
  const graphQLClient = new GraphQLClient('https://leetcode.com/graphql') 
  await graphQLClient.request(getData,{username : username}).then((results) => {
  allLeet =results.matchedUser.submitStatsGlobal.acSubmissionNum;
})}
catch(e){
  return res.status(400).json({message:"Enter Correct Leetcode Id"})
}
 return res.status(200).json({allLeet});
 }
export const hackerrankData = async (req,res) => {
  let res1;
  let cursor="";
  let allQues = [];
  const username = req.params.hackerrankId;
  do{
  try{
      res1 = await axios.get(`https://www.hackerrank.com/rest/hackers/${username}/recent_challenges?limit=100?&cursor=${cursor}` ,{ headers:{
         'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
      }
     });
     
     }catch(err){
      console.log(err)
          return res.status(400).json({err : err.response})
     }
     cursor = res1.data.cursor;
    //  res1.data.models.forEach(ques => {
    //   const {name,url} = ques; 
    //   allQues = [...allQues ,{name,url}];
    //  })
    allQues = [...allQues,res1.data.models];
  }while(!res1.data.last_page);
  return res.status(200).json({allQues, totalQues : allQues.length});
} 



export const codeforcesData = async(req,res)=>{
  const handle = req.params.codeforcesId;
  let easy = 0 , medium = 0 , hard = 0;
  const data = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`)
  .catch(err => {
    res.status(404).json({message : "Please Try Again"})
  });
  if(data.status = "FAILED") res.status(400).json({message:"Please Enter Valid Handle"});
 
}