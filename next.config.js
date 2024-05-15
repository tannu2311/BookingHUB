/** @type {import('next').NextConfig} */

const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants')

module.exports = (phase) => {
    
    // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
    const isDev = phase === PHASE_DEVELOPMENT_SERVER
    // when `next build` or `npm run build` is used
    const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'
    // when `next build` or `npm run build` is used
    const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1'

    let AppURLLocal = 'http://localhost:3000';
    let AppURLLive = '';

    let ApiUrlLocal = 'http://localhost:3000/api/';
    let ApiUrlLive = '';

    let dbUrlLocal = ''
    let dbUrlLive = ''
    
    const env = {
        API_URL: (() => {
            if (isDev) {
                return ApiUrlLocal
            } else if (isProd) {
                return ApiUrlLive
            } else if (isStaging) {
                return ApiUrlLive
            } else {
                return 'RESTURL_SPEAKERS:not (isDev,isProd && !isStaging,isProd && isStaging)'
            }
        })(),
        APP_URL: (() => {
            if (isDev) {
                return AppURLLocal
            } else if (isProd) {
                return AppURLLive
            } else if (isStaging) {
                return AppURLLive
            } else {
                return 'RESTURL_SPEAKERS:not (isDev,isProd && !isStaging,isProd && isStaging)'
            }
        })(),
        NEXTAUTH_URL:(() => {
            if (isDev) {
                return AppURLLocal
            } else if (isProd) {
                return AppURLLive
            } else if (isStaging) {
                return AppURLLive
            } else {
                return 'RESTURL_SPEAKERS:not (isDev,isProd && !isStaging,isProd && isStaging)'
            }
        })(),

        db_Url:(() => {
            if (isDev) {
                return dbUrlLocal
            } else if (isProd) {
                return dbUrlLocal
            } else if (isStaging) {
                return dbUrlLocal
            } else {
                return 'RESTURL_SPEAKERS:not (isDev,isProd && !isStaging,isProd && isStaging)'
            }
        })(),

    
        //metadata
        APP_NAME : 'BookingHub',
        LOGO_IMG:'/Logo.png',
        META_KEYWORDS : ['Next.js', 'React', 'JavaScript', 'SAAS', 'Booking','Appointment'],
        APP_DESCRIPTION : 'Your appointment,booking,reservation app for all kind of business',
        META_AUTHOR : [{ name: 'BookingHub', url: '' }],

        //Autoresponder keys
        AWEBER_CLIENT_ID : '',
        AWEBER_CLIENT_SECRET : '',
        
        CONSTANT_CONTACT_CLIENT_ID : '',
        CONSTANT_CONTACT_CLIENT_SECRET : '',

        //jwt token - user session
        NEXTAUTH_SECRET : 'sdfafdffgfsgsgdfvnhjhj',
        
        //payment api url  
        PAYPAL_URL : 'https://api-m.paypal.com',

        //cloud storage 
        CLOUD_SERVICE_NAME : 'aws',
        
        //AWS credentials
        BUCKET_NAME : "",
        ACCESS_KEY_ID : "",
        SECRET_ACCESS_KEY : "",
        REGION : "",

        //Google cloud storage 
        GOOGLE_CLOUD_PROJECT_ID : '',
        GOOGLE_CLOUD_BUCKET_NAME : '',
        GOOGLE_CLOUD_JSON_FILE : '',

        rules: {
            "@next/next/no-img-element": "off",
        },
    }
    const headers = () => {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, 
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            },
        ]
    }
   
    return{
        reactStrictMode: true,
        env: env,
        eslint: {
            ignoreDuringBuilds: true,
        },
        swcMinify: false,
        experimental : {
            serverMinification : false,
        },
        headers : headers,
        rewrites: async () => {
            return [
                {
                  source: '/',
                  destination: '/home/index.html',
                }
              ]
        },
       
    }
};
