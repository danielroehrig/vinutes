export default class JasConfig {
    constructor() {
        this.timelines = [];
    }
    static from(json){
        return Object.assign(new JasConfig(), json);
    }
}