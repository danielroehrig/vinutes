export const loadLastState = (callback) => {
    console.log("Loading last State");
    let stateValues;
    try{
        db.serialize(()=>{
            db.exec("CREATE TABLE IF NOT EXISTS key_value_store (key TEXT NOT NULL PRIMARY KEY, value TEXT);")
            stateValues = db.all("SELECT SUBSTR(key,7) AS 'key', value FROM key_value_store WHERE key LIKE 'state.%'", callback);
        });
    }catch (e) {
        console.log(e.message+" "+e.toString());
    }
    return stateValues;
}

//TODO make Async
export const handleStoreMutation = (mutation, state) => {
    console.log("Handling store mutation: "+JSON.stringify(mutation) + " " + JSON.stringify(state));
    switch (mutation.type) {
        case 'changeLanguage':
            db.run("INSERT INTO key_value_store (key, value) VALUES ('state.language', $language) ON CONFLICT(key) DO UPDATE SET value=$language;",{$language: mutation.payload})
            break;
        default:
            console.log("Unknown mutation");
    }
}



