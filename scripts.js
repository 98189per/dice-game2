var players = []        //this array hold player objects, which in turn hold all the information about a player
var numberOfPlayers     //this variable stores the number of players while the player array is still being filled out
var buttonRef = []      //this array holds references to the two main buttons on the user interface
var gametextRef         //this variable holds a reference to the main textbox where all messages are printed
var URLsearch           //this variable holds a reference to an instance of a class which can find form data in the page's URL
var playerTurn          //this variable stores the index of the player whose turn it currently is 
var dieAndCoin = {      //this Object generates values and stores values for keeping track of the game
    firstDie: 0,        //the value of the first die
    secondDie: 0,       //the value of the second die
    coinFlip: 0,        //the value of the coin flip
    lossTotal: 0,       //the running coint of bust points
    playerRound: 0,     //the player who starts each new round
    gameWon: false,     //whether or not the game has been won (1000+ points)
    sum: function(){return this.firstDie + this.secondDie},                                                                     //  Sum of two dice
    product: function(){return this.firstDie * this.secondDie},                                                                 //  Product of two dice
    maxmin: function(toggle){return toggle ? Math.max(this.firstDie,this.secondDie) : Math.min(this.firstDie,this.secondDie)},  //  Return either max or min of two dice
    identifier: function(){return this.firstDie % 2 + this.secondDie % 2 + 3 * this.coinFlip},                                  //  A function which returns an integer between 0-5
    score: function(){                                                                                                          //  Return one of the cases depending on the value
        switch(this.identifier()){
            case 0: return this.sum()                       //  Even / Even / Heads
            case 1: return 2 * this.sum()                   //  Even / Odd / Heads
            case 2: return 2 * this.maxmin(true)            //  Odd / Odd / Heads               } This works by taking the sum of the parities of the dice rolls e.g.
            case 3: return this.product()                   //  Even / Even / Tails             } die1 % 2 is either 0 | 1 , same for die2 so,
            case 4: return 2 * this.product()               //  Even / Odd / Tails              } 0 | 1 + 0 | 1 = 0 | 1 | 2
            case 5: return 2 * this.maxmin(false)           //  Odd / Odd / Tails               } and then you add 0 or 3 depending on heads(0) or tails(1)
            }
        },
    roll: function(){                                       //  Randomize the values of the dice and coin
        this.firstDie = Math.floor(Math.random() * 6) + 1
        this.secondDie = Math.floor(Math.random() * 6) + 1
        this.coinFlip = Math.floor(Math.random() * 2)
    }
}

function print(message){    //this method prints a message to the main gametext div
    gametextRef.innerHTML += message + "</br>"
    gametextRef.scrollTop = gametextRef.scrollHeight        //  Scroll to bottom of gametext box if there is overflow
}

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
    if(buttonRef[buttonNumber].id=="active"){               //  Check if the button selected is currently active or not
        switch(buttonRef[buttonNumber].innerHTML){          //  Switch statment executes code based on the current text of a button
            case "Yes":     //  Response to "Do you want to play the Dice Game?"
                if(dieAndCoin.gameWon){                     //  If this the game has already been won once, reload the page
                    window.location.reload()
                }
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
                    buttonRef[0].innerHTML = "Bye!"     //  Dead end for the script, need to reload the page to play again
                    buttonRef[1].style.display = "none"     //  Make 2nd button disappear
                break
            case "Bye!":
                window.location.href = './index.html'
                break
            case "Roll Die!":
                dieAndCoin.roll()                                                           //  Call the roll() method 
                players[playerTurn].order = dieAndCoin.sum()                                //  Set their order property to the sum()
                print(players[playerTurn].name + " rolled a " + dieAndCoin.firstDie + " and a " + dieAndCoin.secondDie + "!")
                playerTurn++
                if(playerTurn>=numberOfPlayers)
                    playerOrder()
                else
                    print("Go " + players[playerTurn].name + "!")
                break
            case "Re-roll!":                                                                //  Same as above case
                dieAndCoin.roll()
                players[playerTurn].order = dieAndCoin.sum()
                print(players[playerTurn].name + " rolled a " + dieAndCoin.firstDie + " and a " + dieAndCoin.secondDie + "!")
                playerTurn++
                if(playerTurn>1)
                    playerOrder()
                else
                    print("Go " + players[playerTurn].name + "!")
                break
            case "Roll":                                                                    //  For actual game
                dieAndCoin.roll()
                players[playerTurn].score += dieAndCoin.score()                             //  Calculate score
                print(players[playerTurn].name + " flipped " + (dieAndCoin.coinFlip==0 ? "heads" : "tails") + ", rolled a " + dieAndCoin.firstDie + " and a " + dieAndCoin.secondDie + "!")
                print(players[playerTurn].name + "'s new score: " + players[playerTurn].score)
                checkWinningConditions(players[playerTurn])                                 //  Check if the winning conditions were met, passing the current player as the argument
                break
            case "End Turn":
                players[playerTurn].firstTurn = true                                        //  Reset the player's values
                playerTurn++                                                                //  Increment the player turn
                if(playerTurn==numberOfPlayers)                                             //  Unless the end of the array has been reached
                    playerTurn = 0
                buttonRef[1].id = "inactive"
                print("It's now " + players[playerTurn].name + "'s turn!")
                if(players[playerTurn].type=="computer")                                    //  Will call the AI function it is a computer's turn
                    computerTurn(players[playerTurn])
                break
        }
    }
}

function checkWinningConditions(player){    //this method checks whether a certain player has met the winning conditions for the round
    var returnVal = false
    if(player.firstTurn && player.type!="computer"){    //  If a person has already had their first turn, re-activate the 'End Turn' button
        player.firstTurn = false
        buttonRef[1].id = "active"
    }
    if(player.score>50){                                //  If your score is above 50, you bust
        player.notBusted = false                        //  Update bool
        dieAndCoin.lossTotal += player.score            //  Add your score to the running count
        print("Uh-oh... " + player.name + " busted!")
        returnVal = true
    }else if(player.score==50){                         //  If you have exactly 50
        player.totalScore += numberOfPlayers * 50       //  Add the appropriate points to your total score
        print("WOW! " + player.name + " got exactly 50 and won " + numberOfPlayers * 50 + " points!")
        if(!checkGameWon()){                            //  Check if the overall game has been won yet (1000+ points)
            print("Their total score is now " + player.totalScore)
            resetRound()                                //  Reset the round, go to next round
        }
        returnVal = true
    }
    if(players.filter(player=>player.notBusted).length==1){     //  If there is only one player that has not busted yet
        winner = players.filter(player=>player.notBusted)[0]
        winner.totalScore += dieAndCoin.lossTotal               //  Add the running bust points to their score
        print(winner.name + " is the only player who hasn't busted this round!")
        if(!checkGameWon()){                                    //  Check if the overall game has been won yet (1000+ points)
            print("Their total score is now " + winner.totalScore)
            resetRound()                                        //  Reset the round, go to next round
        }
        returnVal = true
    }
    return returnVal
}

function resetRound(){  //this method resets the properties of each player in preparation for the start of a new round
    dieAndCoin.playerRound++                                        //  Increment the player who starts the round
    if(dieAndCoin.playerRound==numberOfPlayers)                     //  Unless the end of the array has been reached
        dieAndCoin.playerRound = 0
    playerTurn = dieAndCoin.playerRound;                            //  Set the current player's turn to whoever starts the round
    dieAndCoin.lossTotal = 0                                        //  Reset the counter for bust points
    for(var i=0;i<numberOfPlayers;i++){                             //  Loop through each player and reset their values
        players[i].firstTurn = true
        players[i].notBusted = true
        players[i].score = 0
    }
    print("Next round!!!")
    buttonRef[1].id = "inactive"
    print("It's now " + players[playerTurn].name + "'s turn!")
    if(players[playerTurn].type=="computer")
        computerTurn(players[playerTurn])
    else
        buttonRef[0].id = "active"
    buttonRef[1].id = "inactive"
}

function checkGameWon(){    //this method checks if the overall game has been won (1000+ points)
    if(players.filter(player=>player.totalScore>=1000).length>0){           //  If anyone has over 1000 points
        winner = players.filter(player=>player.totalScore>=1000)[0]
        print("Holy smokes! " + winner.name + " has won the game by reaching " + winner.totalScore + " points!")
        print("Congratulations!!!" + "</br>" + "Would you like to play again?")
        buttonRef[0].innerHTML = "Yes"                                      //  Repeat the same question as the start of the game
        buttonRef[0].id = "active"
        buttonRef[1].innerHTML = "No"
        buttonRef[1].id = "active"
        dieAndCoin.gameWon = true                                           //  Toggle value for how page reloading works
        return true
    }
    return false
}

function sleep(ms) {    //this method is an asynchronous wait function because JS doesn't have a synchronous version
    return new Promise(resolve => setTimeout(resolve, ms));
}//*it took me forever to debug this because it caused the while loop to execute even after it was supposed to have been broken out of... -_-

async function computerTurn(computer){  //this method automatically rolls for a computer-type player during their turn
    buttonRef[0].id = "inactive"                        //  Deactivate the buttons so that the player cannot interfere with the computer's turn
    buttonRef[1].id = "inactive"
    var inloop = false
    do {                                                //  Execute at least once, since you cannot end on the first turn
        inloop = true   //I am *this* close to having it work | either computers only breaks or... set a flag for comp v player when comp busts (eg line 203 never happens)
        buttonRef[1].id = "inactive"
        dieAndCoin.roll()                               //  Roll the dice + toss coin
        players[playerTurn].score += dieAndCoin.score() //  Compute and increment score
        print(players[playerTurn].name + " flipped " + (dieAndCoin.coinFlip==0 ? "heads" : "tails") + ", rolled a " + dieAndCoin.firstDie + " and a " + dieAndCoin.secondDie + "!")
        print(players[playerTurn].name + "'s new score: " + players[playerTurn].score)  //  Print result
        var computerWon = checkWinningConditions(players[playerTurn])   //  Check if the winning conditions were met, passing the current player as an argument
        if(!computerWon){                               //  I have no clue whether this is actually necessary or not but when I remove it stuff breaks so I'm leaving it here
            await sleep(1000)                           //  Wait before repeating turn to avoid printing out block text and to give time for the person to read 
            inloop = false
        }//else{inloop = false}
    } while(computer.score<computer.tolerance && !computerWon && players[playerTurn].type=="computer")  //  While the score is below the computer's tolerance continue rolling
    if(players[playerTurn].type=="computer" && !inloop){    //  Again, this method is really messy because of the async/wait, so I don't really know whether or not this if statement is needed
        players[playerTurn].firstTurn = true                //  Reset values for next turn
        playerTurn++
        if(playerTurn==numberOfPlayers)                     //  ...or start of array if we have reached the end
            playerTurn = 0
        buttonRef[0].id = "active"
        buttonRef[1].id = "inactive"                        //  Player cannot end on first turn
        print("It's now " + players[playerTurn].name + "'s turn!")
        if(players[playerTurn].type=="computer")            //  It the next player is also a computer call this method again
            computerTurn(players[playerTurn])
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
    var playerNameArray = []
    var playerTypeArray = []
    for(var i=0;i<numberOfPlayers;i++){                                     //  For loop for number of players
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

function submitForm2(formToSubmit,data){ //this method is like submitForm(), but for the second form
    if(URLsearch.has("playerName0")!=true){
        if(data.filter(playerType=>playerType.checked).length==data.length/2)
            formToSubmit.submit()                               //  Submit the form if exactly half of the radio buttons are checked (at least one for every player)
        else
            alert("Please check every player type")             //  Otherwise alert user to check at least one type for each player
    }
}

function preGameSetup(){ //this method is called after the second form is filled
    for(var i=0;i<numberOfPlayers;i++){                                                 //  Loop through the number of players to assign their data to the Object array
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
    print("Let's roll dice to see who goes first!")
    playerTurn = 0
    print("Go " + players[playerTurn].name + "!")
    buttonRef[0].innerHTML = "Roll Die!"
    buttonRef[0].id = "active"
    buttonRef[1].style.display = "none"
}

function playerOrder(){ //this method rolls two dice for each player and determines the order of playing
    playerTurn = 0
    players.sort((a,b)=>a.order<b.order?1:-1)                                   //  Sort the array by order
    if(players[0].order==players[1].order){                                     //  While two players have high ties, re-roll
        buttonRef[0].innerHTML = "Re-roll!"
        print("Since " + players[0].name + " and " + players[1].name + " rolled the same sum, they must re-roll!")
        print("Go " + players[playerTurn].name + "!")
        return
    }
    handleGameFlow()                                                                //  Call the function that start the actual game
}

function handleGameFlow(){  //this method sets the final variables before the game starts
    print(players[0].name + " goes first, let the game begin!!!")
    buttonRef[0].innerHTML = "Roll"             //  Set the text for the first button
    buttonRef[0].id = "active"
    buttonRef[1].style.display = "inline-block" //  Display the second button (was hidden for the previous function)
    buttonRef[1].innerHTML = "End Turn"         //  Set the text for the second button
    buttonRef[1].id = "inactive"                //  Deactivate it (players can't end on their first roll)
    playerTurn = 0                              //  Keeps track of whose turn it is within a round
    dieAndCoin.lossTotal = 0                    //  A running count of the scores of everyone who has busted
    dieAndCoin.gameWon = false                  //  Checks if the game has been won yet (for resetting purposes)
    dieAndCoin.playerRound = playerTurn         //  Keeps track of whose turn it is at the start of each round
    for(var i=0;i<numberOfPlayers;i++){         //  Loop through all players and set initial values
        players[i].firstTurn = true             //  Each players' first turn (can't end on first turn)
        players[i].notBusted = true             //  Each player has not busted at the start of each round
        players[i].score = 0                    //  Each players' score for each round
        players[i].totalScore = 0               //  Each players' overall score for the game
        if(players[i].type=="computer")         //  Assigns computers a special value that determines when they will stop rolling 
            players[i].tolerance = normalRandom(36,12)  //  Normally distributed random numbers with a mean of 36
    }
    print("It's now " + players[playerTurn].name + "'s turn!")
    if(players[playerTurn].type=="computer")    //  Will call the AI function if it is a computer's turn
        computerTurn(players[playerTurn])
}

function normalRandom(xbar,loops){  //this method generates normally distributed random variables 
    var n = 0
    for(var i=0;i<loops;i++)
        n += Math.floor(Math.random() * xbar * 2) + 1
    return Math.round(n/loops)      //  Take an average of repeated throws from a uniform distribution
}                                   //  I don't fully understand why exactly this works, but experimentally calculated it has a standard deviation of 6
                                    //  This means 68% of numbers generated will be between 30-42, 27% more within 24-48, and 4.5% more within 18-54                                    
                                    //  So yes, there is a ~1% chance that a computer will keep rolling past 50 automatically, but that just makes the game more amusing