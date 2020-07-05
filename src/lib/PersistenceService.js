export const initDBStructure = () => {
        db.serialize(() => {
            db.exec("CREATE TABLE IF NOT EXISTS timeline (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);");
            db.exec("CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY, language TEXT, lastTimeline INTEGER, FOREIGN KEY(lastTimeLine) REFERENCES timeline (id));");
            db.exec("INSERT INTO state(id, language, lastTimeline) VALUES(1, 'en', null) ON CONFLICT(id) DO NOTHING");
        });
}

export const loadLastState = (callback) => {
    console.log("Loading last State");
    return db.get("SELECT * FROM state WHERE id = 1;");
};



//TODO make Async
export const handleStoreMutation = (mutation, state) => {
    console.log("Handling store mutation: " + JSON.stringify(mutation) + " " + JSON.stringify(state));
    switch (mutation.type) {
        case "changeLanguage":
            db.run("UPDATE state set language=?;", mutation.payload);
            break;
        default:
            console.log("Unknown mutation");
    }
};



