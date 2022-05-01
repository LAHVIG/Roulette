

function setup()
{

    createCanvas(800, 800);

    //creating button objects, with set values
    startButton = new GeneralButton(width / 2, height / 2, 50, 50, "start");
    plusButton = new GeneralButton(2 * width / 3, 7 * height / 8, 50, 50, "plus");
    minusButton = new GeneralButton(width / 3, 7 * height / 8, 50, 50, "minus");
    rollButton = new GeneralButton(560, 340, 120, 40, "ROLL");

    //creating the roulette cells
    for (let i = 0; i < 37; i++)
    {
        new RouletteTable(i);
    }
    new RouletteTable("red");
    new RouletteTable("black");
}

function preload()
{

    //loading font
    headFont = loadFont('impact.ttf');
}

function draw()
{

    //switch statement for 
    switch (showScreen)
    {
        case "start":
            startMenu();
            break;
        case "game":
            gameWindow();
            break;
    }

    //resetting all objects from this class
    GeneralButton.list.forEach(object => object.hasBeenPressed = false);

}

function rollNumber()
{

    rollButton.display();
    //checking if the roll button has been activated
    if (rollButton.hasBeenPressed)
    {
        //making local variables
        let numberDraw;
        let rollInfo;

        //picking random number and ceiling it, so that 0 is also included in roll
        numberDraw = Math.ceil(random(-0.9, 36));

        //sending number to number display
        displayNumber = numberDraw

        //assigning displaycolors and rollinfo
        if (numberDraw == 0)
        {
            numberColor = [0, 255, 0];
            rollInfo = "green";
        }
        else if ((numberDraw % 2) == 1)
        {
            numberColor = [205, 0, 0];
            rollInfo = "red";
        }
        else if ((numberDraw % 2) == 0)
        {
            numberColor = [32, 32, 32];
            rollInfo = "black";
        }
        //calculating bets for each element in the array
        RouletteTable.betArray.forEach(element => element.calculateBet(numberDraw, rollInfo))
    }
}

function startMenu()
{
    //just a simple start menu, not much interesting going on here
    background(tableColor);
    push();
    textFont(headFont);
    textAlign(CENTER, CENTER);
    textSize(40);
    text('Start Menu', width / 2, 50);
    pop();

    startButton.display();
    if (startButton.hasBeenPressed)
    {
        //switching to game view
        showScreen = "game"
    }
}

function gameWindow()
{
    //drawing of the game view
    background(tableColor);
    push();

    rectMode(CENTER);
    textFont(headFont);
    textAlign(CENTER, CENTER);
    textSize(40);
    text('Game Menu', width / 2, 50);

    push();

    noFill();
    strokeWeight(5);
    rect(width / 2, height / 2, 2 * width / 3, 2 * height / 3);

    pop();

    push();

    fill(220);
    rect(560, 240, 3 * 40);
    rollNumber();
    fill(numberColor);
    text(displayNumber, 560, 240);
    pop();

    //displaying all cells
    RouletteTable.betArray.forEach(element => element.display());


    pop();
    //running game controls function
    gameControls();
}

function gameControls()
{
    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    //displaying minus and plus buttons
    minusButton.display();
    plusButton.display();
    //checking if they have been pressed, and affecting the active bet
    if (minusButton.hasBeenPressed)
    {
        if (globalBet > 0)
        {
            globalBet -= 50
            balance += 50
        }
    }

    if (plusButton.hasBeenPressed)
    {
        if (balance != 0 || balance > 50)
        {
            balance -= 50
            globalBet += 50
        }
    }
    //drawing balance box;
    rect(width / 2, 7 * height / 8, (width / 3) - 70, 50);
    fill(0);
    text("bet: " + globalBet + "\n" + "balance: " + balance, width / 2, 7 * height / 8);
    pop();
}


function mousePressed()
{
    //calls pressed method of all elemts in the classes' static array
    RouletteTable.betArray.forEach(object => object.pressed());
    GeneralButton.list.forEach(object => object.pressed());
}
