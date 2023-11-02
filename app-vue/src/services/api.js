import axios from 'axios';

const enabled = true

export async function test() {
    console.log('test in API');
    if(enabled) return await axios.get('/api/info');
    else return 'NoServer'
}

export async function registration(formData) {
    if(enabled) return await axios.post('/api/registration', formData);
    else return 'NoServer'
}

export async function login(formData) {
    if(enabled) return await axios.post('/api/login', formData);
    else return 'NoServer'
}

export async function checkLogin(token) {
    if(enabled) return await axios.post('/api/check-login', token);
    else return 'NoServer'
}

export async function newAdvertisement(formData) {
    if(enabled) return await axios.post('/api/new-advertisement', formData);
    else return 'NoServer'
}
export async function deleteAdvertisement(form) {
    if(enabled) return await axios.post(`/api/delete-advertisement`, form);
    else return 'NoServer'
}


// ПОЛУЧЕНИЕ ДАННЫХ
export async function getResidentialBuy() {
    if(enabled) return await axios.get('/api/getData/residential/buy');
    else return 'NoServer'
}
export async function getResidentialLongRent() {
    if(enabled) return await axios.get('/api/getData/residential/longRent');
    else return 'NoServer'
}
export async function getResidentialDailyRent() {
    if(enabled) return await axios.get('/api/getData/residential/dailyRent');
    else return 'NoServer'
}
export async function getCommerceBuy() {
    if(enabled) return await axios.get('/api/getData/commerce/buy');
    else return 'NoServer'
}
export async function getCommerceRent() {
    if(enabled) return await axios.get('/api/getData/commerce/rent');
    else return 'NoServer'
}
export async function getMyAdvertisement(number) {
    if(enabled) return await axios.get(`/api/getData/my-advertisement/${number}`);
    else return 'NoServer'
}




