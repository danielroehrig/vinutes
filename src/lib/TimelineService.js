export const loadTimeline = (id) => {
    console.log(`Loading timeline ${id}`);
    return db.prepare("SELECT * FROM timeline WHERE id=$id;").get({id: id});
};

export const getAllTimelines = () => {
    console.log("Get all timelines");
    return db.prepare("SELECT * FROM timeline ORDER BY name ASC;").all();
};

/**
 * Create a new timeline with the given name.
 * @param {string} name
 */
export const createNewTimeline = (name)=>{
    //TODO: Handle Exceptions like non-unique names
    let timeline = db.prepare("INSERT INTO timeline (name) VALUES ($name);").run({name: name});
    console.log(timeline);
    return timeline;
}