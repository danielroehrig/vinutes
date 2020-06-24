"use strict";
const {app} = require("electron");
const path = require("path");
const sep = path.sep;
const fs = require("fs");
const JasConfig = require("./JasConfig");
const configFilePath = path.join(sep, app.getPath("userData"), "config.json");

/**
 * Load config file from user data location.
 *
 * @returns {JasConfig}
 */
const loadConfig = () => {
    let jasConfig;
    if (fs.existsSync(configFilePath)) {
        jasConfig = loadConfigFromFile(configFilePath);
    }else{
        jasConfig = new JasConfig(app.getLocaleCountryCode());
        writeConfig();
    }
    return jasConfig;
};

/**
 * Save config to disk
 *
 * @param jasConfig
 */
const writeConfig = (jasConfig) => {
    fs.writeFile(configFilePath, JSON.stringify(jasConfig), (err) => {
        if (err) {
            //TODO: Display a warning that reads "Cannot write in your user directory"
            console.log(err);
            app.exit(1);
        }
    });
};

/**
 * Load config file from path.
 *
 * @param {string} configFilePath
 */
function loadConfigFromFile(configFilePath) {
    const buffer = fs.readFileSync(configFilePath, {encoding: "utf8", flag: "r"});
    const jsonConfigData = JSON.parse(buffer.toString());
    return JasConfig.from(jsonConfigData);
}

exports.loadConfig = loadConfig;
exports.writeConfig = writeConfig;