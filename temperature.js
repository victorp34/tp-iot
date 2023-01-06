import axios from 'axios';
import utils from './utils.js';

// ------------ CONFIGURATION -------------
const DELAY = 2000; // Delay between frames in ms

const TEMP_MIN = 150; // Minimum temperature °C x 10
const TEMP_MAX = 300; // Maximum temperature °C x 10
const THRESHOLD = 250; // Threshold to send an alert to your middleware

const ENDPOINT = 'http://localhost:8000/api/temperature'; //Middleware Endpoint ex: http//localhost:8000/api/temperature

// ---------------- END -------------------

function sendData(data) {
	if (ENDPOINT != null && ENDPOINT != '') {
		console.log('Sending frame...');
		axios
			.post(ENDPOINT, {
				data: data,
			})
			.then((res) => {
				console.log(res.data);
			});
	} else {
		console.log('ENDPOINT is not configured.');
	}
}

function start() {
	//Generate random value and convert it into hexadecimal
	const temperature = utils.randomNumber(TEMP_MIN, TEMP_MAX);
	let code, value, frame;
	if (temperature > THRESHOLD) {
		code = utils.toByte((30).toString(16), 1);
		//Create frame
		value = utils.toByte(temperature.toString(16), 2);
		value = value + utils.toByte(THRESHOLD.toString(16), 2);
		frame = code + value;
		sendData(frame);
	}
	value = utils.toByte(temperature.toString(16), 2);
	//Add Frame
	code = utils.toByte((40).toString(16), 1);

	//Create frame
	frame = code + value;
	sendData(frame);
}

setInterval(() => start(), DELAY);
