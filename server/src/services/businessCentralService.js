import axios from 'axios';
import { clientCredentials } from 'axios-oauth-client';
import credentials from '../credentials/credentials.json' with { type: "json" };;
import jwt from 'jsonwebtoken';
import { dataLayer } from '../utils/dataUtils.js';

const appState = { initComplete: false };
const dataHeap = { tables: [], entities: [] };

const baseUrl = credentials.baseUrl;
const company = credentials.company;
const getClientCredentials = clientCredentials(
    axios.create(),
    credentials.oAuth.token_url,
    credentials.oAuth.client_ID,
    credentials.oAuth.client_secret
);

export const initApp = async () => {
    console.log('Init Started.');
    [dataHeap.tables, dataHeap.entities] = await Promise.all(
        [bcOperation('Tables', {
            "pTableFilter": "",
            "withFields": true
        }),
        bcOperation('Entities', {
            "entityCode": "",
            "withFields": true
        })]);
}

export const routeHandler = async (func, body, ctx, operationType = 'get') => {
    try {
        ctx.type = 'application/json';
        const response = await bcOperation(func, body);
        if (operationType === 'get') {
            ctx.body = dataLayer(response, func, body);
        } else {
            if (func === 'LoginUser' && response.value) {
                ctx.set('x-auth-token', token);
                axios.defaults.headers.common['x-auth-token'] = token;
            }
            ctx.body = response;
        }
    } catch (error) {
        ctx.status = error.response?.status || 500;
        ctx.type = 'application/json';
        ctx.body = createErrorResponse(error);
        console.log(ctx.body);
    }
}

const createErrorResponse = (error) => {
    let code = 500;
    let message = 'Internal Server Error';

    if (error.response?.data.error.code && error.response?.data.error.message) {
        code = error.response?.data.error.code;
        message = error.response?.data.error.message;
    } 
    else if (error.response?.data.error) {
        code = error.response?.status;
        message = error.response?.data.error;
    } 
    else if (error.code && error.message) {
        code = error.code;
        message = error.message;
    }

    return { code, message };
}

export const bcOperation = async (func, body) => {

    if (func === 'LoadUser') {
        const user = verifyJWT(body.pToken);
        if (!user) {
            throw new Error('Invalid or expired token.  Please login again to continue');
        }
        return user.userid;
    }

    const auth = await getClientCredentials('https://api.businesscentral.dynamics.com/.default');
    const response = await axios.post(`${baseUrl}_${func}?company=${company}`, body, {
        headers: { 'Authorization': 'Bearer ' + auth.access_token }
    });

    const responseData = JSON.parse(response.data.value);

    // Token generation logic for 'LoginUser'
    if (func === 'LoginUser' && responseData) {
        const userData = responseData;
        const token = generateJWT(userData);

        // Include token in the response data
        return { ...userData, token };
    }

    return responseData;
}

const generateJWT = (userId) => {
    return jwt.sign({ userid: userId }, credentials.jwtSecret, { expiresIn: 1800 });
}

const verifyJWT = (token) => {
    try {
        return jwt.verify(token, credentials.jwtSecret);
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}


// Export dataHeap and appState
export { dataHeap, appState };
