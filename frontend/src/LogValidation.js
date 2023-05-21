function validation(values){
    let error = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^.{8,}$/;

    if(values.email === ""){
        error.email = "Email should not be Empty!"
    } else if(!emailRegex.test(values.email)){
        error.email = "Invalid Email Format!"
    } else{
        error.email = "";
    }
    
    if(values.password === ""){
        error.password = "Password should not be Empty!"
    } else if(!passwordRegex.test(values.password)){
        error.password = "Atleast 8 characters required!"
    } else{
        error.password = "";
    }

    return error;
}

export default validation;