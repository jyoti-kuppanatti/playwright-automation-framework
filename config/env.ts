import dotenv from 'dotenv';

const environment = process.env.ENV || 'qa';

dotenv.config({
    path: `.env.${environment.toLowerCase()}`
});


export const ENV = {

    BASE_URL: process.env.BASE_URL!,
    ENVIRONMENT: process.env.ENV!

};