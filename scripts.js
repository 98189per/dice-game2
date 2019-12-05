function myFunction(a, b){
    return a*b;
}

function doSomething(){
    document.getElementById("gametext").innerHTML += "</br>" + myFunction(2,3);
}