exports.handler = async (event) => {
    var response = "Hello from Lambda! ";
    const inputs = event;

    if(Array.isArray(inputs)&&inputs.length>1){
            const addends = inputs.map((a)=>{return parseInt(a)});
            const sum = addends.reduce((acc,val)=>{
                return acc+val;
            },0);
            if (isNaN(sum)){
                return "Parameters must be integers";
            }
            return response + sum;
    }
    else{
        return "Invalid number of parameters";
    }
};