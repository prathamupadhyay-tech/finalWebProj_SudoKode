import user from "../models/user";
 export const getAllUsers = async (req,res,next)=>{
	let users;
	try{
		users = await user.find();
	}catch(err){ 
		console.log(err);}
	if(!users){
		return res.status(404).json({message:"No Users found"});
	}
	else{
		return res.status(200).json({users});
	}
}
  
export const signup = async (req,res,next)=>{
	
	const {name,email,password} = req.body;
	let userExists;
	try{
		userExists = await user.findOne({email});
	}catch(err){
		return console.log(err);
	}
	if(userExists){
		return res.status(400).json({message:"User Already Exists"});
	}
	else{
		const newUser =  new user({name,email,password,userBlog:[]});
		try{
			await newUser.save();
		}catch(err){
			return console.log(err);
		}
		return res.status(201).json({newUser});
	}
  }  

  export const login = async(req,res,next)=>{
	 const {email , password} = req.body;
	 let newUser;
	 try{
		newUser = await user.findOne({email}).populate("userBlog");
		if(!newUser){
			return res.status(400).json({message:"User Not Found"});
		}
		if(newUser && newUser.password  === password){
			return res.status(201).json({newUser});
		} 
		else{
			return res.status(400).json({message:"Wrong Password"});
		}
	 }catch(err){
		return console.log(err);
	 }
  }