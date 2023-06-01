import { Request, Response } from "express";
import { Any, getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import * as bcryptjs from "bcryptjs";
import {sign, verify} from "jsonwebtoken";




export const Register = async(req: Request, res: Response) => {

    try {

    const body = req.body;
    // console.log(body);

        if (body.password !== body.password_confirm) {
        return res.status(400).send({
            message : "Passwords do not match",
        });

        }
 
     const {password,...user} = await getRepository(User).save({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
                password: await bcryptjs.hash(body.password,  12),
            }
            

    )

    res.send(user); 
} catch (err) {
    console.log(err);
    return res.status(500).send({
        message: "Something went wrong"
    });
}
}

export const Login= async  (req: Request, res: Response) => {

    // console.log(req.body);

   const email : string = req.body.email;
    
    const user = await getRepository(User).findOne({
        where: {
            email: email
        }
    });

    if (!user) {
        return res.status(404).send({
            message: "User not found"
        });

    }
if (!await bcryptjs.compare(req.body.password, user.password)) {
    return res.status(400).send({
        message: "Invalid password"
    });

    }
    const accessToken = sign({ id: user.id} ,  process.env.ACCESS_SECRET || "", { expiresIn: "30s" }); 
    const refreshToken = sign({ id: user.id} , process.env.ACCESS_REFRESH || "" , { expiresIn: "5s" }); 

    res.cookie("access_token", 
    accessToken, { 
        httpOnly: true,
        maxAge : 24 * 60 * 60 * 1000 });  // 1 day
       

    res.cookie("refresh_token",
     refreshToken, {
       httpOnly: true,
       maxAge : 24 * 60 * 60 * 1000 * 7 });  // 1 week
      

      

    res.send({
        message: "Login successful"
       
    });
}


export  const AuthenticatedUser = async (req: Request, res: Response) => {

    try {

    const cookie = req.cookies["access_token"];
 
    const payload : any = verify(cookie, process.env.ACCESS_SECRET || "") 
 
    if (!payload) {
        return res.status(401).send({
            message: "Unauthenticated"
        });
    }
  //find the user from the database whit the paylod id
       const user = await getRepository(User).findOne({
        where: {
            id: payload.id
        }
    });

    // console.log(user);
   
    if (!user) {
        return res.status(401).send({
            message: "Unauthenticated(user)"
        });
    }
   
    const {password, id, ...data} = user;//destructuring the user object to remove the password and id

    res.send(data)
   
} catch (err) {
    return res.status(401).send({
        message: "Unauthenticated try again"
    });
    
}



    
}


//RefreshToken after the access token expires

export const RefreshToken = async (req: Request, res: Response ) => {
    
        try {
    
        const cookie = req.cookies["refresh_token"];
    
        const payload : any = verify(cookie, process.env.ACCESS_REFRESH || "") 
    
        if (!payload) {
            return res.status(401).send({
                message: "Unauthenticated"
            });
        }

        //create a new access token
        const accessToken = sign({ id: payload.id} ,  process.env.ACCESS_SECRET || "", { expiresIn: "30S" }); 
//stor the new access token in the cookie
        res.cookie("access_token", 
        accessToken, { 
            httpOnly: true,
            maxAge : 24 * 60 * 60 * 1000 });  // 1 day
         

    
    res.status(200).send({
        message: "Refresh token successful"
    });
    } catch (err) {
        return res.status(401).send({
            message: "Unauthenticated try again"
        });

    }
}


export const Logout = async (req: Request, res: Response) => {
        
        try {
    
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
       


        res.status(200).send({
            message: "Logout successful"
        });
        }
        catch (err) {
            return res.status(401).send({
                message: "Unauthenticated try again"
            });
    
        }
    }
    



