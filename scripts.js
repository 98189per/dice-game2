var noplayers;
var players = [];
var gametext;
var playerdatasubmit;
var playerdatainput = [];
var playertypeinput = [];

function startGame(){
    var paramString = window.location.search;
    var searchParams = new URLSearchParams(paramString);
    gametext = document.getElementById("gametext");
    if(searchParams.has("noplayers")){
        noplayers = searchParams.get("noplayers");
        gametext.innerHTML += "Hello! Would you like to play dice game?";
        document.getElementsByClassName("gamebutton")[0].innerHTML = "Yes";
        document.getElementsByClassName("gamebutton")[1].innerHTML = "No";
        gametext.innerHTML += "</br>" + "Okay! Let's get started, how many players are there?";
        document.getElementsByClassName("gamebutton")[0].id = "nctive";
        document.getElementsByClassName("gamebutton")[1].id = "nctive";
        getPlayerData(noplayers);
        if(searchParams.has("playerdata0")){
            playerdatasubmit.setAttribute("type","button");
            var i;
            for(i=0;i<noplayers;i++){
                players[i] = new Object();
                playerdatainput[i].setAttribute("value",searchParams.get("playerdata"+i));
                players[i].name = searchParams.get("playerdata"+i);
                if(searchParams.get("type"+i)=="person"){
                    playertypeinput[2*i-1].setAttribute("checked","checked");
                    players[i].type = "person";
                }
                else{
                    playertypeinput[2*i].setAttribute("checked","checked");
                    players[i].type = "computer";
                }
            }
            gametext.innerHTML += "okay!";
            for(i=0;i<noplayers;i++){
                gametext.innerHTML += "</br>" + players[i].name + " - " + players[i].type;
            }
            /*
            this is where I left off, (got player info, etc.)
            now connect back into actual game
            */
        }
    }else{
        gametext.innerHTML += "Hello! Would you like to play dice game?";
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
        playertypeinput[2*i-1] = document.createElement("INPUT");
        playertypeinput[2*i-1].setAttribute("type","radio");
        playertypeinput[2*i-1].setAttribute("name","type"+i);
        playertypeinput[2*i-1].setAttribute("value","person");
        playertypeinput[2*i] = document.createElement("INPUT");
        playertypeinput[2*i].setAttribute("type","radio");
        playertypeinput[2*i].setAttribute("name","type"+i);
        playertypeinput[2*i].setAttribute("value","computer");
        playerdataform.appendChild(document.createTextNode("Player name: "));
        playerdataform.appendChild(playerdatainput[i]);
        playerdataform.appendChild(playertypeinput[2*i-1]);
        playerdataform.appendChild(document.createTextNode("Person "));
        playerdataform.appendChild(playertypeinput[2*i]);
        playerdataform.appendChild(document.createTextNode("Computer "));
        playerdataform.appendChild(document.createElement("BR"));
    }
    playerdatasubmit = document.createElement("INPUT");
    playerdatasubmit.setAttribute("type","submit");
    playerdatasubmit.setAttribute("value","Done");
    playerdataform.appendChild(playerdatasubmit);
    gametext.appendChild(playerdataform);
}

function getNoPlayers(){
    var playerform = document.createElement("FORM");
    playerform.setAttribute("method","get");
    var askplayertext = document.createTextNode("No. of players: ");
    askplayerinput = document.createElement("INPUT");
    askplayerinput.setAttribute("type","text");
    askplayerinput.setAttribute("name","noplayers");
    askplayersubmit = document.createElement("INPUT");
    askplayersubmit.setAttribute("type","submit");
    askplayersubmit.setAttribute("value","Enter");
    playerform.appendChild(askplayertext);
    playerform.appendChild(askplayerinput);
    playerform.appendChild(askplayersubmit);
    gametext.appendChild(playerform);
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
            case "First":
                gametext.innerHTML += "</br>" + "Play the game by rolling dice until you choose to stop" + "</br>" + "The first player to go over 50 loses" + "</br>" + "If you get exactly 50 you win!";
                document.getElementsByClassName("gamebutton")[0].innerHTML = "Roll";
                document.getElementsByClassName("gamebutton")[1].innerHTML = "End";
                break;
            case "Second":
                break;
            case "Roll":
                gametext.innerHTML += "</br>" + "You rolled a " + rollDice("player") + ", your score is now " + player.score + "</br>" + "Would you like to roll again or end your turn?";
                break;
            case "End":
                gametext.innerHTML += "</br>" + "Now it's my turn!";
                break;
        }
    }
}

function rollDice(obj){
    var num = Math.floor(Math.random() * 6) + 1;
    if(obj == "player")
        player.score += num;
    else{
        computer.turnscores.push(num);
        computer.score += num;
    }
   return num;
}

function computerRoll(tolerance){
    computer.turnscores = [];
    while(computer.score < tolerance)
        rollDice();
}

function winningConditions(){
    if(player.score>50){
        gametext.innerHTML += "</br>" + "You rolled over 50 and lost! The current standings are now, ";
    }else if(computer.score>50){

    }else if(player.score==50){

    }else if(computer.score==50){

    }
}