import express, { NextFunction, Request, Response } from "express";
const router = express.Router();


router.get('/',(request: Request, response: Response) => {
    
    response.send('Hello world');
}
);


export default router
