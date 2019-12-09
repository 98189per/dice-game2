var searchParams;
var noplayers;
var players = [];
var gametext;
var playerdatainput = [];
var playertypeinput = [];
var typebuffer;
var turn;
var roll = new Object();

function startGame(){
    var paramString = window.location.search;
    searchParams = new URLSearchParams(paramString);
    gametext = document.getElementById("gametext");
    if(searchParams.has("noplayers")){
        noplayers = searchParams.get("noplayers");
        gametext.innerHTML += "Hello! Would you like to play dice game?";
        gametext.innerHTML += "</br>" + "Players take turns rolling dice and flipping a coin to try to get a score as close to 50 without going over.";
        gametext.innerHTML += "</br>" + "Each round, the winner gets a certain number of points added to their overall score.";
        gametext.innerHTML += "</br>" + "The first player to reach a total score of 1000 wins the game!";
        document.getElementsByClassName("gamebutton")[0].innerHTML = "Yes";
        document.getElementsByClassName("gamebutton")[1].innerHTML = "No";
        gametext.innerHTML += "</br>" + "Okay! Let's get started, how many players are there?";
        document.getElementsByClassName("gamebutton")[0].id = "nctive";
        document.getElementsByClassName("gamebutton")[1].id = "nctive";
        getPlayerData(noplayers);
        if(searchParams.has("playerdata0")){
            var i;
            for(i=0;i<noplayers;i++){
                players[i] = new Object();
                playerdatainput[i].setAttribute("value",searchParams.get("playerdata"+i));
                players[i].name = searchParams.get("playerdata"+i);
                if(searchParams.get("type"+i)=="person"){
                    playertypeinput[2*i+1].setAttribute("checked","checked");
                    players[i].type = "person";
                }
                else{
                    playertypeinput[2*i+2].setAttribute("checked","checked");
                    players[i].type = "computer";
                }
            }
            gametext.innerHTML += "Time to play the game!";
            playerOrder();
        }
    }else{
        gametext.innerHTML += "Hello! Would you like to play dice game?";
        gametext.innerHTML += "</br>" + "Players take turns rolling dice and flipping a coin to try to get a score as close to 50 without going over.";
        gametext.innerHTML += "</br>" + "Each round, the winner gets a certain number of points added to their overall score.";
        gametext.innerHTML += "</br>" + "The first player to reach a total score of 1000 wins the game!";
        document.getElementsByClassName("gamebutton")[0].innerHTML = "Yes";
        document.getElementsByClassName("gamebutton")[1].innerHTML = "No";
    }
}

function updateScroll(){
    var element = gametext;
    element.scrollTop = 10000;
}

function getPlayerData(noplayers){
    var playerdataform = document.createElement("FORM");
    playerdataform.setAttribute("method","get");
    playerdataform.setAttribute("id","playerdataform");
    var askplayertext = document.createTextNode("No. of players: ");
    askplayerinput = document.createElement("INPUT");
    askplayerinput.setAttribute("type","text");
    askplayerinput.setAttribute("name","noplayers");
    askplayerinput.setAttribute("value",noplayers);
    askplayersubmit = document.createElement("INPUT");
    askplayersubmit.setAttribute("type","button");
    askplayersubmit.setAttribute("value","Enter");
    playerdataform.appendChild(askplayertext);
    playerdataform.appendChild(askplayerinput);
    playerdataform.appendChild(askplayersubmit);
    playerdataform.appendChild(document.createElement("BR"));
    var i;
    for(i=0;i<noplayers;i++){
        playerdatainput[i] = document.createElement("INPUT");
        playerdatainput[i].setAttribute("type","text");
        playerdatainput[i].setAttribute("name","playerdata"+i);
        playertypeinput[2*i+1] = document.createElement("INPUT");
        playertypeinput[2*i+1].setAttribute("type","radio");
        playertypeinput[2*i+1].setAttribute("name","type"+i);
        playertypeinput[2*i+1].setAttribute("value","person");
        playertypeinput[2*i+2] = document.createElement("INPUT");
        playertypeinput[2*i+2].setAttribute("type","radio");
        playertypeinput[2*i+2].setAttribute("name","type"+i);
        playertypeinput[2*i+2].setAttribute("value","computer");
        playerdataform.appendChild(document.createTextNode("Player name: "));
        playerdataform.appendChild(playerdatainput[i]);
        playerdataform.appendChild(playertypeinput[2*i+1]);
        playerdataform.appendChild(document.createTextNode("Person "));
        playerdataform.appendChild(playertypeinput[2*i+2]);
        playerdataform.appendChild(document.createTextNode("Computer "));
        playerdataform.appendChild(document.createElement("BR"));
    }
    playerdatasubmit = document.createElement("INPUT");
    playerdatasubmit.setAttribute("type","button");
    playerdatasubmit.setAttribute("onclick","submitForm(playerdataform,playertypeinput)");
    playerdatasubmit.setAttribute("value","Done");
    playerdataform.appendChild(playerdatasubmit);
    gametext.appendChild(playerdataform);
}

function isFormComplete(radiobutton){
    if(radiobutton.value=="person"){
        typebuffer=radiobutton;
        return true;
    }
    else
        return typebuffer.checked || radiobutton.checked;
}

function getNoPlayers(){
    var playerform = document.createElement("FORM");
    playerform.setAttribute("method","get");
    playerform.setAttribute("id","playerform");
    playerform.setAttribute("onkeydown","return event.key != 'Enter';");
    var askplayertext = document.createTextNode("No. of players: ");
    askplayerinput = document.createElement("INPUT");
    askplayerinput.setAttribute("type","text");
    askplayerinput.setAttribute("name","noplayers");
    askplayersubmit = document.createElement("INPUT");
    askplayersubmit.setAttribute("type","button");
    askplayersubmit.setAttribute("onclick","submitForm(playerform,askplayerinput)");
    askplayersubmit.setAttribute("value","Enter");
    playerform.appendChild(askplayertext);
    playerform.appendChild(askplayerinput);
    playerform.appendChild(askplayersubmit);
    gametext.appendChild(playerform);
}

function submitForm(formToSubmit,dataToValidate){
    if(dataToValidate.name=="noplayers"){
        if(dataToValidate.value==parseInt(dataToValidate.value,10) && dataToValidate.value>1)
            formToSubmit.submit();
        else
            alert("Please enter a valid no. of players");
    }else if(searchParams.has("playerdata0")!=true){
        if(dataToValidate.every(isFormComplete))
            formToSubmit.submit();
        else
            alert("Please check every player type");
    }
}

function playerOrder(){
    gametext.innerHTML += "</br>" + "Let's roll dice to see who goes first!";
    var i;
    for(i=0;i<noplayers;i++){
        rollDice();
        players[i].order = roll.a + roll.b;
        gametext.innerHTML += "</br>" + players[i].name + " rolled a " + roll.a + " and a " + roll.b + "!";
    }
    players.sort(function(a,b){return (a.order<b.order ? 1 : -1);});
    while(players[0].order==players[1].order){
        gametext.innerHTML += "</br>" + "Since " + players[0].name + " and " + players[1].name + " rolled the same sum, they must re-roll!";
        rollDice();
        players[0].order = roll.a + roll.b;
        gametext.innerHTML += "</br>" + players[0].name + " rolled a " + roll.a + " and a " + roll.b + "!";
        rollDice();
        players[1].order = roll.a + roll.b;
        gametext.innerHTML += "</br>" + players[1].name + " rolled a " + roll.a + " and a " + roll.b + "!";
        players.sort(function(a,b){return (a.order<b.order ? 1 : -1);});
    }
    gametext.innerHTML += "</br>" + players[0].name + " goes first, let the game begin!!!";
    handleGameFlow();
}

function handleGameFlow(){

}

function rollDice(){
    roll.a = Math.floor(Math.random() * 6) + 1;
    roll.b = Math.floor(Math.random() * 6) + 1;
    return roll;
}

function switchFunction(button){
    updateScroll();
    if(document.getElementsByClassName("gamebutton")[button].id == "active"){
        switch(document.getElementsByClassName("gamebutton")[button].innerHTML){
            case "Yes":
                gametext.innerHTML += "</br>" + "Okay! Let's get started, how many players are there?";
                document.getElementsByClassName("gamebutton")[0].id = "nctive";
                document.getElementsByClassName("gamebutton")[1].id = "nctive";
                getNoPlayers();
                break;
            case "No":
                gametext.innerHTML += "</br>" + "Too bad... Maybe another time?";
                document.getElementsByClassName("gamebutton")[0].innerHTML = "Okay bye...";
                document.getElementsByClassName("gamebutton")[0].id = "nctive";
                document.getElementsByClassName("gamebutton")[1].style.display = "none";
                break;
            case "Roll":
                gametext.innerHTML += "</br>" + "You rolled a ";
                break;
            case "End":
                gametext.innerHTML += "</br>" + "Now it's my turn!";
                break;
        }
    }
}
