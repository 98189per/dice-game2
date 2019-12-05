var player = new Object();
var computer = new Object();

function startGame(){
    document.getElementById("gametext").innerHTML += "Hello! Would you like to play dice game?";
    document.getElementsByClassName("gamebutton")[0].innerHTML = "Yes";
    document.getElementsByClassName("gamebutton")[1].innerHTML = "No";
    player.score = 0;
    computer.score = 0;
}

function switchFunction(button){
    switch(document.getElementsByClassName("gamebutton")[button].innerHTML){
        case "Yes":
            document.getElementById("gametext").innerHTML += "</br>" + "Okay! Let's get started, would you like to go first or second?";
            document.getElementsByClassName("gamebutton")[0].innerHTML = "First";
            document.getElementsByClassName("gamebutton")[1].innerHTML = "Second";
            break;
        case "No":
            document.getElementById("gametext").innerHTML += "</br>" + "Too bad... Maybe another time?";
            document.getElementsByClassName("gamebutton")[0].innerHTML = "Okay bye...";
            document.getElementsByClassName("gamebutton")[0].id = "nctive";
            document.getElementsByClassName("gamebutton")[1].style.display = "none";
            break;
        case "First":
            document.getElementById("gametext").innerHTML += "</br>" + "Play the game by rolling dice until you choose to stop" + "</br>" + "The first player to go over 50 loses" + "</br>" + "If you get exactly 50 you win!";
            document.getElementsByClassName("gamebutton")[0].innerHTML = "Roll";
            document.getElementsByClassName("gamebutton")[1].innerHTML = "End";
            break;
        case "Second":
            break;
        case "Roll":
            document.getElementById("gametext").innerHTML += "</br>" + "You rolled a " + rollDice("player") + ", your score is now " + player.score + "</br>" + "Would you like to roll again or end your turn?";
            break;
        case "End":
            break;
    }
}

function rollDice(obj){
    var num = Math.floor(Math.random() * 6) + 1;
    if(obj == "player")
        player.score += num;
    else
        computer.score += num;
    return num;
}