export const loadTimeline = (id) => {
    console.log(`Loading timeline ${id}`);
    return db.prepare("SELECT * FROM timeline WHERE id=$id;").get({id: id});
};

export const getAllTimelines = () => {
    console.log("Get all timelines");
    return db.prepare("SELECT * FROM timeline ORDER BY name ASC;").all();
};