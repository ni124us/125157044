const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;


const WINDOW_SIZE = 10;
let numberWindow = [];


const THIRD_PARTY_API_URL = 'https://mockapi.example.com/numbers?type=';


const mockResponses = {
 p: [[2, 3, 5, 7], [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]],
 f: [[1, 1, 2, 3], [5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597]],
 e: [[2, 4, 6, 8], [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]],
 r: [[1, 7, 3, 8], [6, 2, 9, 5, 4, 11, 13, 15, 17, 19, 23, 21, 25]]
};

const fetchNumbers = async (type) => {
 try {
   
   const response = mockResponses[type].shift();
   if (!response) {
     throw new Error('No more mock responses');
   }
   return response;
 } catch (error) {
   console.error('Error fetching numbers:', error);
   return []; 
 }
};


const calculateAverage = (numbers) => {
 const sum = numbers.reduce((acc, num) => acc + num, 0);
 return (sum / numbers.length) || 0;
};

app.get('/numbers/:numberid', async (req, res) => {
 const numberId = req.params.numberid;
 const validTypes = ['p', 'f', 'e', 'r'];

 if (!validTypes.includes(numberId)) {
   return res.status(400).json({ error: 'Invalid number type' });
 }

 const windowPrevState = [...numberWindow];
 const fetchedNumbers = await fetchNumbers(numberId);

 fetchedNumbers.forEach(num => {
   if (!numberWindow.includes(num)) {
     if (numberWindow.length >= WINDOW_SIZE) {
       numberWindow.shift(); 
     }
     numberWindow.push(num);
   }
 });

 const windowCurrState = [...numberWindow];
 const average = calculateAverage(numberWindow);

 res.json({
   windowPrevState,
   windowCurrState,
   numbers: fetchedNumbers,
   avg: average.toFixed(2)
 });
});


app.listen(port, () => {
 console.log(`Average Calculator microservice running at http://localhost:${port}`);
});