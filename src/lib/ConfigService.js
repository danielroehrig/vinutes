"use strict";
const fs = require('fs');
const JasConfig = require ("./JasConfig");

const loadConfig = (configFilePath) => {
    if (fs.existsSync(configFilePath)) {
        const jsonConfigData = JSON.parse(fs.readFileSync(configFilePath, {encoding: 'utf8', flag: 'r'}));
        return JasConfig.from(jsonConfigData);
    }
    let jasConfig = new JasConfig();
    writeConfig(jasConfig, configFilePath);
    return jasConfig;
};

const writeConfig = (jasConfig, configFilePath) => {
    fs.writeFile(configFilePath, JSON.stringify(jasConfig), (err) => {
        if (err)
            console.log(err)
    })
}

exports.loadConfig = loadConfig;
exports.writeConfig = writeConfig;