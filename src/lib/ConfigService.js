import Ajv from "ajv";

const configSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "JasConfig",
    "description": "All config params for Just-A-Sec",
    "type": "object",
    "properties": {
        "locale": {
            "description": "The two char country code",
            "type": "string",
            "minLength": 2,
            "maxLength": 2,
        },
        "currentTimeline": {
            "description": "The current timeline id",
            "type": "integer",
            "minimum": 1,
        },
    },
    "required": [],
};

const ajv = new Ajv();

/**
 *
 * @param {object} config
 * @param {Store} store
 */
export const applyConfig = (config, store) => {

}

export const configValidate = ajv.compile(configSchema);

