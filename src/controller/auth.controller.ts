import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import * as bcryptjs from "bcryptjs";



export const Register= async  (req: Request, res: Response) => {

    const body = req.body;


    if (body.password !== body.password_confirm) {
        res.status(400).send({
            message : "Passwords do not match",
        });
       
    }
    const user = await getRepository(User).save({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: await bcryptjs.hash(body.password,  12),
    }
    )
    res.send(body);
}