import express from 'express';
import usercontroller from '../controller/user.controller.js';
 import {check} from 'express-validator';

const router =express.Router();
///////////////////////////////////USER API ROUTES ////////////////////////////////////////
router.post('/SignUp', [
    check("name", "Name is required").notEmpty(),
    check("name", "Only alphabets are allowed").isAlpha(),
    check("email", "Email is required").notEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "Password is required").notEmpty(),
    check("contect", "Contact is required").notEmpty(),
    check("contect", "Only digits are allowed").isNumeric()
], usercontroller.SignUp);


router.post('/login',usercontroller.login);
router.post('/verification',usercontroller.verifyAcount)
router.get('/all',usercontroller.getData);
router.get("/find/:id",usercontroller.findbyid);
router.delete('/del/:id',usercontroller.deletbyid);
router.get("/logout",usercontroller.logout);
router.put("/update/:id",usercontroller.update);



export default router;
