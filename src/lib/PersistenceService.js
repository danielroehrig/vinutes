export const loadLastState = () => {
    console.log("Loading last State");
}

//TODO make Async
export const handleStoreMutation = (mutation, state) => {
    console.log("Handling store mutation: "+JSON.stringify(mutation) + " " + JSON.stringify(state));
}



