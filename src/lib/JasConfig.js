"use strict";
const {app} = require("electron");
const internal = {};

module.exports = internal.JasConfig = class {
    /**
     * @param {string} language Language of the ui
     */
    constructor(language) {
        this.language = language;
    }

    //TODO: Lese Verzeichnisse der timelines ein, erstelle timelines aus den gefundenen Dateien.
    //Name der Datei ist nicht wichtig, nur das was drin steht
    //MediaFiles sind in den timelines gespeichert
    //Wenn in JasConfig eine timeline angegeben ist, versuche die zu finden
    //Wenn sie nicht gefunden wurde, lade die erste aus dem array

    static from(json) {
        const language = json.language ? json.language : app.getLocaleCountryCode();
        return new internal.JasConfig(language);
    }
};
