"use strict";
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

/* Funções de Anti-Spam para mensagens */

// Cria uma Object com o "Set"
const usedCommandRecently = new Set();

// Verifica se a Object tem a pessoa
exports.isFiltered = (from) => usedCommandRecently.has(from);

// Anti Flood
exports.addFilter = (from) => {
	if (usedCommandRecently.has(from)) return;
	usedCommandRecently.add(from);
	setTimeout(() => {
		usedCommandRecently.delete(from);
	}, Number(config.Anti_Flood) * 1000); // * 1000 - Transforma o valor do tempo de aposta em segundos
};

/* Funções de Anti-Spam para mídias */

/* Cria uma Object para filtrar spam de mídia */
const Midia_OBJ = {};
var Last_Media = 0;

/* Verifica se está sendo SPAM */
exports.isSpam = (from) => {
	if (Object.keys(Midia_OBJ).includes(from)) {
		if (Number(Midia_OBJ[from]) > Number(config.Max_Media) && Last_Media > Date.now()) {
			return true;
		} else return false;
	} else return false;
};

// Anti Spam de Mídia
exports.addMidia = (from) => {
	if (Object.keys(Midia_OBJ).includes(from)) {
		Midia_OBJ[from]++;
	} else {
		Midia_OBJ[from] = 1;
	}
	if (Last_Media < Date.now()) {
		Midia_OBJ[from] = 1;
		Last_Media = Number(Date.now())+(Number(config.Anti_Spam) * 1000);
	} else {
		Last_Media = Number(Date.now())+(Number(config.Anti_Spam) * 1000);
	}
};