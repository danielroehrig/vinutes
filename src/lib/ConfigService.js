const fs = require('fs');
const JasConfig = require("./JasConfig");

module.exports.loadConfig = (configFilePath) => {
    if (fs.existsSync(configFilePath)) {
        const jsonConfigData = JSON.parse(fs.readFileSync(configFilePath, {encoding: 'utf8', flag: 'r'}));
        return JasConfig.from(jsonConfigData);
    }
    console.log("nothing found");

    return false;
};
