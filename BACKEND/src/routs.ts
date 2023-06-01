import { Router } from "express";
import {  AuthenticatedUser, Login, Logout, RefreshToken, Register } from "./controller/auth.controller";
import { ForgotPassword , ResetPassword } from "./controller/forgot.controller";
// Authenticated,

export const routes = (router : Router) => {

    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user',AuthenticatedUser);
    router.post('/api/refresh_token', RefreshToken);
    router.post('/api/logout', Logout);
    router.post('/api/forgot',ForgotPassword);
    router.post('/api/reset/',ResetPassword);
};