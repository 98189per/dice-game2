var players = []        //this array hold player objects, which in turn hold all the information about a player
var numberOfPlayers     //this variable stores the number of players while the player array is still being filled out
var buttonRef = []      //this array holds references to the two main buttons on the user interface
var gametextRef         //this variable holds a reference to the main textbox where all messages are printed
var URLsearch           //this variable holds a reference to an instance of a class which can find form data in the page's URL
var numberOfPlayersForm //this variable holds a reference to the form which collects the number of players
var playerDataForm      //this variable holds a reference to the form which collects player info
var dieAndCoin = {      //this Object generates values for dice roll and coin toss
    firstDie: 0,
    secondDie: 0,
    coinFlip: 0,
    sum: function(){
        return this.firstDie + this.secondDie
    },
    roll: function(){
        this.firstDie = Math.floor(Math.random() * 6) + 1
        this.secondDie = Math.floor(Math.random() * 6) + 1
        this.coinFlip = Math.floor(Math.random() * 6) + 1
    }
}

function print(message){
    gametextRef.innerHTML += message + "</br>"
}       //this method prints a message to the main gametext div

function startGame(){   //this method is run as soon as the page loads
    URLsearch = new URLSearchParams(window.location.search)         //  These lines assign reference variables 
    gametextRef = document.getElementById("gametext")               //  It helps declutter later code
    buttonRef = document.getElementsByClassName("gamebutton")       //  buttonRef is an array containing references
    print("Hello! Would you like to play Dice Game?")
    print("Players take turns rolling dice and flipping coins to see who can get a score as close to 50 without going over.")
    print("Each round, the winner gets a certain number of points added to their total score.")
    print("The first player to reach a total score of 1000 wins the game!")           //Prints the first intro messages
    buttonRef[0].innerHTML = "Yes"      //  These lines change the text on the main buttons
    buttonRef[1].innerHTML = "No"       //  It is very important, as the text on the buttons decides what they will do

    fillInData()                        //  Call another function to check if the page is reloaded
}

function buttonClicked(buttonNumber){   //this method is run whenever a button is clicked
    gametextRef.scrollTop = gametextRef.scrollHeight    //  Scroll to bottom of gametext box if there is overflow
    if(buttonRef[buttonNumber].id=="active"){           //  Check if the button selected is currently active or not
        switch(buttonRef[buttonNumber].innerHTML){      //  Switch statment executes code based on the current text of a button
            case "Yes":     //  Response to "Do you want to play the Dice Game?"
                print("Okay let's get started! How many players are there?")
                buttonRef[0].id = "inactive"                            //  Set the state of both buttons to inactive
                buttonRef[1].id = "inactive"                            //  Player information will be entered through a form
                if(URLsearch.has('numberOfPlayers'))                    //  Check if the form has already been filled
                    return getNumberOfPlayersForm().childNodes          //  Return form to fillInData()
                else
                    gametextRef.appendChild(getNumberOfPlayersForm())   //  Create and add the form to the main game text area to be filled
                break
            case "No":      //  Response to "Do you want to play the Dice Game?"
                print("Too bad... Maybe another time?")
                buttonRef[0].innerHTML = "Okay bye..."  //  Dead end for the script, need to reload the page to play again
                buttonRef[1].style.display = "none"     //  Make 2nd button disappear
                break
        }
    }
}

function getNumberOfPlayersForm(){  //this method creates the form asking for the number of players
    numberOfPlayersForm = document.createElement("FORM")    //  Create the FORM element to query the number of players
    Object.assign(numberOfPlayersForm, {
        method: 'get',                                      //  GET means the data collected will be sent to the URL
        onkeydown: function(){
            return event.key != 'Enter'                     //  Prevents the Enter key from accidentally submitting the form
        }
    })                                                      //  Assign attributes to the form element
    var textfield = document.createElement("INPUT")         //  Create INPUT element (the textfield)
    Object.assign(textfield, {
        type: 'text',                                       //  Specify that it is a text field
        name: 'numberOfPlayers'                             //  The name of the value the form will append to the URL
    })                                                      //  Assign attributes to the input element
    var submitbutton = document.createElement("INPUT")      //  Create INPUT element (the button)
    Object.assign(submitbutton, {
        type: 'button',                                     //  Specify that it is a button
        value: 'Enter',                                     //  The text displayed on the button
        onclick: function(){
            submitForm(numberOfPlayersForm)                 //  When pressed, calls a function to check the form before submitting it
        }
    })                                                      //  Assign attributes to the input element
    numberOfPlayersForm.appendChild(document.createTextNode("No. of Players: "))    //  Add text to the form
    numberOfPlayersForm.append(textfield, submitbutton)                             //  Add the text field and submit button to the form
    return numberOfPlayersForm                                                      //  Return the completed form to be appended elsewhere
}

function submitForm(formToSubmit){  //this method is called to check the form before it is submitted
        data = formToSubmit.childNodes[1]                       //  Store a reference to the textfield in the first form
        if(data.value==parseInt(data.value,10) && data.value>1) //  Validate the data the user entered
            formToSubmit.submit()                               //  Either submit the form...
        else
            alert("Please enter a valid number of players!")    //  ...or ask the user to enter valid numbers
}

function fillInData(){  //this method is called after the form is submitted and the page is reloaded
    if(URLsearch.has("numberOfPlayers")){                       //  Check if the first form was submitted
        numberOfPlayers = URLsearch.get('numberOfPlayers')      //  Store the response to the form
        getPlayerInfo()                                         //  Call the function to get player info
        if(URLsearch.has("playerName0"))                        //  Check if the second form was submitted
            preGameSetup()                                      //  Proceed to the next stage of game preparation
    }
}

function getPlayerInfo(){   //this method is called after the first form is filled to gather more info on players
    playerDataForm = document.createElement("FORM")         //  Create the second form (using data from the first)
    Object.assign(playerDataForm, {
        method: 'get'                                       //  GET means the data collected will be sent to the URL
    })                                                      //  Assign attributes to the form element
    var formdata = buttonClicked(0)                         //  Re-execute the steps needed to get here (answer 'yes' to the first question)
    while(formdata.length>0){
        playerDataForm.appendChild(formdata[0])             //  Store the data from the first form to the second form (so it doesn't get lost when the second form is submitted)
    }
    playerDataForm.childNodes[1].setAttribute("value",numberOfPlayers)  //  Fill in the textfield so it appears as if it has already been filled
    playerDataForm.childNodes[2].removeAttribute("onclick")             //  Remove the onlick attribute of the first enter button so it cannot be clicked again
    playerDataForm.appendChild(document.createElement("BR"))            //  Add a newline element
    var i;
    var playerNameArray = []
    var playerTypeArray = []
    for(i=0;i<numberOfPlayers;i++){                                     //  For loop for number of players
        playerNameArray[i] = document.createElement("INPUT")            //  Create INPUT element (textfield)
        Object.assign(playerNameArray[i], {
            type: 'text',                                               //  Specify that it is a textfield
            name: 'playerName' + i                                      //  The name of the value the form will append to the URL
        })                                                              //  Assign attributes to the input element
        playerTypeArray[2*i] = document.createElement("INPUT")        //  Create INPUT element (radio button)
        Object.assign(playerTypeArray[2*i], {
            type: 'radio',                                              //  Specify that it is a radio button
            name: 'type' + i,                                           //  The name of the value the form will append to the URL
            value: 'person'                                             //  The value that this button holds
        })                                                              //  Assign attributes to the input element
        playerTypeArray[2*i+1] = document.createElement("INPUT")        //  Create INPUT element (radio button)
        Object.assign(playerTypeArray[2*i+1], {
            type: 'radio',                                              //  Specify that it is a radio button
            name: 'type' + i,                                           //  The name of the value the form will append to the URL
            value: 'computer'                                           //  The value that this button holds
        })                                                              //  Assign attributes to the input element
        playerDataForm.append(document.createTextNode("Player name: "), playerNameArray[i])     //  Add the text field to the form
        playerDataForm.append(playerTypeArray[2*i], document.createTextNode(" Person"))       //  Add the first button to the form
        playerDataForm.append(playerTypeArray[2*i+1], document.createTextNode(" Computer"))     //  Add the second button to the form
        playerDataForm.appendChild(document.createElement("BR"))                                //  Add a newline to the form
    }                                                                   //  Repeat until all players have data entry spaces
    var submitbutton = document.createElement("INPUT")      //  Create INPUT element (the button)
    Object.assign(submitbutton, {
        type: 'button',                                     //  Specify that it is a button
        value: 'Done',                                      //  The text displayed on the button
        onclick: function(){
            submitForm2(playerDataForm, playerTypeArray)     //  When pressed, calls a function to check the form before submitting it
        }
    })                                                      //  Assign attributes to the input element
    playerDataForm.appendChild(submitbutton)                //  Add the submit button to the form
    gametextRef.appendChild(playerDataForm)                 //  Add the form to the main game text area
}

function submitForm2(formToSubmit,data){ //this method is an overload instance of the first submitForm(), but for the second form
    if(URLsearch.has("playerName0")!=true){
        if(data.filter(playerType=>playerType.checked).length==data.length/2)
            formToSubmit.submit()                               //  Submit the form if exactly half of the radio buttons are checked (at least one for every player)
        else
            alert("Please check every player type")             //  Otherwise alert user to check at least one type for each player
    }
}

function preGameSetup(){    //this method is called after the second form is filled
    var i;
    for(i=0;i<numberOfPlayers;i++){                                                 //  Loop through the number of players to assign their data to the Object array
        players[i] = new Object()                                                   //  Initialize each element as a new Object
        players[i].name = URLsearch.get("playerName" + i)                           //  Set the name property
        playerDataForm.childNodes[7*i+5].setAttribute("value",players[i].name)      //  Fill in the textfield so it appears as if it has already been filled
        if(URLsearch.get("type"+i)=="person"){                                      //  If the 'person' radio button was selected...
            playerDataForm.childNodes[7*i+6].setAttribute("checked","checked")      //  Set the radio button back to 'person'
            players[i].type = "person"                                              //  Set the type property
        }else{
            playerDataForm.childNodes[7*i+8].setAttribute("checked","checked")      //  Set the radio button back to 'computer'
            players[i].type = "computer"                                            //  Set the type property
        }
    }
    print("Time to play the game!")
    playerOrder()                                                                   //  Call the function that determines player order
}

function playerOrder(){ //this method rolls two dice for each player and determines the order of playing
    print("Let's roll dice to see who goes first!")
    var i
    for(i=0;i<numberOfPlayers;i++){                                                 //  Loop through each player and roll dice
        dieAndCoin.roll()                                                           //  Call the roll() method 
        players[i].order = dieAndCoin.sum()                                         //  Set their order property to the sum()
        print(players[i].name + " rolled a " + dieAndCoin.firstDie + " and a " + dieAndCoin.secondDie + "!")
    }
    players.sort((a,b)=>a.order<b.order?1:-1)                                       //  Sort the array by order
    while(players[0].order==players[1].order){                                      //  While two players have high ties, re-roll
        print("Since " + players[0].name + " and " + players[1].name + " rolled the same sum, they must re-roll!")
        for(i=0;i<2;i++){
            dieAndCoin.roll()
            players[i].order = dieAndCoin.sum()
            print(players[i].name + " rolled a " + dieAndCoin.firstDie + " and a " + dieAndCoin.secondDie + "!")
        }
        players.sort((a,b)=>a.order<b.order?1:-1)
    }
    print(players[0].name + " goes first, let the game begin!!!")
    handleGameFlow()                                                                //  Call the function that start the actual game
}

function handleGameFlow(){

}