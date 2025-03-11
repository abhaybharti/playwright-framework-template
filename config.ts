import * as dotenv from "dotenv"
import Joi from "joi"
import {z} from "zod"

//Load enviornment variables from .env
dotenv.config()


//Define the schema for validation
// const envSchema = Joi.object({
//     //Enironment
//     BASE_URL : Joi.string().uri().required(),
//     USER_NAME: Joi.string().required(),
//     PASSWORD: Joi.string().required(),

//     //Playwright settings
//     WORKERS : Joi.number().integer().min(1).required(),
//     RETRY_FAILED : Joi.number().integer().min(0).required(),
//     MAX_TEST_RUNTIME : Joi.number().integer().min(1000).required(),
//     HEADLESS_BROWSER : Joi.boolean().required()
// }).unknown(true) //Allow other unknow enviornment variables

// Define the schema for validation using Zod
// const envSchema = z.object({
//     // Environment
//     BASE_URL: z.string().url().nonempty(),
//     USER_NAME: z.string().nonempty(),
//     PASSWORD: z.string().nonempty(),

//     // Playwright settings
//     WORKERS: z.number().int().min(1),
//     RETRY_FAILED: z.number().int().min(0),
//     MAX_TEST_RUNTIME: z.number().int().min(1000),
//     HEADLESS_BROWSER: z.boolean()
// }).passthrough(); //Allow unknonn environment variables

//.strict() //Allow only known environment variables

//To Do - Convert above validation schema in zod


//Validate environment variables
// const envVars = envSchema.validate(process.env,{allowUnknown:true,abortEarly:false})
// const envVars = envSchema.safeParse(process.env)

// if (envVars.error){
//     throw new Error(`Enviornment validation error : ${envVars.error.message}`)
// }

//Config class with validate enviornment variables
export  class Config{

    static readonly BASE_URL :string = process.env.BASE_URL || '';
    static readonly USER_NAME :string = process.env.USER_NAME || '';
    static readonly PASSWORD :string = process.env.PASSWORD || '';

    static readonly WORKERS :number = parseInt(process.env.WORKERS || '1');
    static readonly RETRY_FAILED :number = parseInt(process.env.RETRY_FAILED || '0');
    static readonly MAX_TEST_RUNTIME :number = parseInt(process.env.MAX_TEST_RUNTIME || '1000');
    static readonly HEADLESS_BROWSER :boolean = process.env.HEADLESS_BROWSER === 'true';
}