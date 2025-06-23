import User from  '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export const registerUser  = async (req,res)=>{
    const {name, email, password }= req.body

    try{
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({error:"Email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({ name, email, password: hashedPassword });
    
        res.status(201).json({message: "User registered successfully"});
    }
    catch(error){
        res.status(500).json({error: "Registration error"});
    }
}




// Login user

export const loginUser = async (req,res)=>{

    const {email, password} = req.body;
    // console.log(email, password);

    try{
        const user = await User.findOne({email})
        // console.log("User:",user);
        if(!user){
            return res.status(400).json({error: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // console.log("Password Match:", isMatch);
        if(!isMatch){
            return res.status(400).json({error: "Invalid credentials"});
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });        
        res.json({token, user:{ id: user._id, name: user.name, email: user.email, bio: user.bio, department: user.department, profileImage: user.profileImage }});
    }
    catch(e){
        res.status(500).json({error: "Login Failed"});
    }
}