import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import App from './app';
// import './style.css'

let clients = {};
// let clients = {
//     Aria: {
//         name: 'Aria',
//         dx_code: 'F01',
//         cpt_code: '001',
//         insurance: 'BCBS',
//         paid: '$5.00',
//         comments: 'stares through door.'
//     },
//     'Ranya Bianchi': {
//         name: 'Ranya Bianchi',
//         dx_code: 'F02',
//         cpt_code: '002',
//         insurance: 'United Healthcare',
//         paid: '$30.00',
//         comments: 'you pay me =('
//     },
//     Ashe: {
//         name: 'Ashe',
//         dx_code: 'F03',
//         cpt_code: '003',
//         insurance: 'Tufts',
//         paid: '$10.00',
//         comments: 'stripe'
//     },
//     'Christopher Bianchi': {
//         name: 'Christopher Bianchi',
//         dx_code: 'F10',
//         cpt_code: '010',
//         insurance: 'self-pay',
//         paid: '$10000.00',
//         comments: 'cash'
//     },
//     foobar: {
//         name: 'foobar',
//         dx_code: 'F042',
//         cpt_code: '042',
//         insurance: 'Beacon',
//         paid: '$',
//         comments: 'no one likes Beacon...'
//     }
// };

// let clients = {
//     'Ranya Bianchi': {
//         name: 'Ranya Bianchi',
//         dx_code: 'F02',
//         cpt_code: '002',
//         insurance: 'United Healthcare',
//         paid: '$30.00',
//         comments: 'you pay me =('
//     },
//     'Christopher Bianchi': {
//         name: 'Christopher Bianchi',
//         dx_code: 'F10',
//         cpt_code: '010',
//         insurance: 'self-pay',
//         paid: '$10000.00',
//         comments: 'cash'
//     }
// };

ReactDOM.render(<App clients={clients}/>, document.querySelector('#root'));
