exports.handler = async (event) => {
    const response = "Hello from Lambda!"  + JSON.stringify(event);
    return response;
};