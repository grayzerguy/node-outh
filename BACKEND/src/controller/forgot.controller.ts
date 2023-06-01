import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Reset } from '../entity/reset.entity';
import { createTransport } from 'nodemailer';
import { User } from '../entity/user.entity';
import * as bcryptjs from "bcryptjs";





export const ForgotPassword = async ( req : Request , res :Response ) => {

    try {

    const {email} = req.body;
    const token = Math.random().toString(36).substring(2, 15) ;
    await getRepository(Reset).save({email,token});

    const transporter = createTransport({
        host: '0.0.0.0',
        port: 1025,
    });

    const url = `http://localhost:3000/rs/${token}`;

     await transporter.sendMail({

        from : "from@example.com",
        to : email,
        subject : 'Reset Password',
        text : 'Reset Password',
        html : `cLICK <a href = "${url}" >here</a> to reset password`



    });


    res.send({message: 'Email sent'});

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Something went wrong"
        });
    }

}

export const ResetPassword = async ( req : Request , res :Response ) => {

    try {
    
    const { token , password , password_confirm } = req.body;

    
    if (password !== password_confirm) {
        return res.status(400).send({
            message : "Passwords do not match",
        });

        }

        const ResetPassword = await getRepository(Reset).findOne({
            where: {
                token: token
            }

            });

            if (!ResetPassword) {
                return res.status(404).send({
                    message: "invalid link"
                });
        
            }
            
            
            const user = await getRepository(User).findOne({
                where: {
                    email: ResetPassword.email
                }
    
    });

    if (!user) {
        return res.status(404).send({
            message: "User not found"
        });


    
    }

    await getRepository(User).update(user.id, {
        password:await bcryptjs.hashSync(password, 12),
    });

    res.status(200).send({
        message: "Password updated"
    });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Something went wrong"
        });
    }
}

