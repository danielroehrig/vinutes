export const loadTimeline = (id) => {
    console.log(`Loading timeline ${id}`);
    return db.prepare("SELECT * FROM timeline WHERE id=$id;").get({id: id});
};

export const getAllTimelines = () => {
    console.log("Get all timelines");
    return db.prepare("SELECT * FROM timeline ORDER BY name ASC;").all();
};

/**
 * Create a new timeline with the given name and return the id.
 * @param {string} name
 * @return {int}
 */
export const createNewTimeline = (name)=>{
    //TODO: Handle Exceptions like non-unique names
    let insertResult = db.prepare("INSERT INTO timeline (name) VALUES ($name);").run({name: name});
    return insertResult.lastInsertRowid;
}