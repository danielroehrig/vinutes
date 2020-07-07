export const initDBStructure = () => {
    db.prepare("CREATE TABLE IF NOT EXISTS timeline (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);").run();
    db.prepare("CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY, language TEXT, lastTimeline INTEGER, FOREIGN KEY(lastTimeLine) REFERENCES timeline (id));").run();
    db.prepare("INSERT INTO state(id, language, lastTimeline) VALUES(1, 'en', null) ON CONFLICT(id) DO NOTHING").run();
}

export const loadLastState = () => {
    console.log("Loading last State");
    return db.prepare("SELECT * FROM state WHERE id = 1;").get();
};



//TODO make Async
export const handleStoreMutation = (mutation, state) => {
    console.log("Handling store mutation: " + JSON.stringify(mutation) + " " + JSON.stringify(state));
    let updateStatement;
    switch (mutation.type) {
        case "changeLanguage":
            updateStatement = db.prepare("UPDATE state set language=$payload;");
            break;
        default:
            console.log("Unknown mutation");
            return;
    }
    updateStatement.run({payload: mutation.payload});
};



