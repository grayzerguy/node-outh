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
    const accessToken = sign({ id: user.id} ,  process.env.ACCESS_SECRET || "", { expiresIn: "1d" }); 
    const refreshToken = sign({ id: user.id} , process.env.ACCESS_REFRESH || "" , { expiresIn: "1w" }); 

    res.cookie("access_token", 
    accessToken, { 
        httpOnly: true,
        maxAge : 24 * 60 * 60 * 1000 });  // 1 day
        console.log(accessToken);

    res.cookie("refresh_token",
     refreshToken, {
       httpOnly: true,
       maxAge : 24 * 60 * 60 * 1000 * 7 });  // 1 week
         console.log(refreshToken);

      

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
  //find the user
       const user = await getRepository(User).findOne({
        where: {
            id: payload.id
        }
    });

    console.log(user);
   
    if (!user) {
        return res.status(401).send({
            message: "Unauthenticated(user)"
        });
    }
   
    const {password, ...data} = user;

    res.send(data)
   
} catch (err) {
    return res.status(401).send({
        message: "Unauthenticated try again"
    });
    
}

    
}

