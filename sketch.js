

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

//class for roulette table
class RouletteTable
{


    constructor(number)
    {
        //takes number or string as input

        this.value = number;
        this.extraClr = 0;
        this.bet = 0;
        this.betIsActive = false;
        this.w = 40;
        this.payBack;

        //checks for type of input, and assigns color, payback rate and position
        if (typeof this.value == "number")
        {
            this.payBack = 36;
            this.x = ((this.value - 1) % 3) * 40 + 360;
            this.y = Math.ceil(this.value / 3) * 40 + 160; //credit: Tobias Clasen for this line :D
            this.h = 40;

            //value = 0;
            if (this.value == 0)
            {
                this.clr = [0, 255, 0];
                this.x = 360 + 40
            }
            //value = odd
            else if ((this.value % 2) == 1)
            {
                this.clr = [205, 0, 0];
            }
            //value is equal
            else if ((this.value % 2) == 0)
            {
                this.clr = [32, 32, 32];
            }
        }
        //checking for colors
        else if (typeof this.value == "string" && this.value == "red")
        {
            this.clr = [205, 0, 0];
            this.x = 320;
            this.y = 300;
            this.h = 240;
            this.payBack = 2;
        }
        else if (typeof this.value == "string" && this.value == "black")
        {
            this.clr = [32, 32, 32];
            this.x = 320;
            this.y = 540;
            this.h = 240;
            this.payBack = 2;
        }

        //pushing self to static array of class;
        RouletteTable.betArray.push(this);

    }

    calculateBet(number, info)
    {
        //check if cell has active bet;
        if (this.betIsActive)
        {
            //check if value is string
            if (typeof this.value == "string")
            {
                //if the value matches the info given from rollNumber function, the objects bet will be multiplied by the paybackrate
                if (this.value == info)
                {
                    balance += this.bet * this.payBack;
                }
            }
            else if (typeof this.value == "number")
            {
                //check if value is the same as the given number from rollNumber, and multiply the objects bet by paybackrate
                if (this.value == number)
                {
                    balance += this.bet * this.payBack;
                }
            }
        }
        //reset the objects bet;
        this.bet = 0;
        this.betIsActive = false;
    }

    mouseIsOver()
    {
        //checks if the mouse is hovering on the object. It is assumed that rectmode is set to CENTER
        if (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2)
        {
            return true
        }
        else
        {
            return false
        }
    }

    pressed()
    {
        //method is called in mousePressed function

        //check if monuse is hovering on object
        if (this.mouseIsOver() == true)
        {
            if (globalBet != 0 && this.betIsActive == false)
            {
                //assign global bet to objects bet property
                this.bet = globalBet;

                //set global bet to zero to prevent duplication of money, and economic inflation
                globalBet = 0;

                //set betIsActive property to true
                this.betIsActive = true;

            }
            else if (this.betIsActive == true)
            {
                //if the objects bet is active, it should be be added to the global balance, when pressed
                balance += this.bet;
                this.bet = 0;

                this.betIsActive = false;
            }
        }
    }

    display()
    {
        //drawing the object
        push();
        rectMode(CENTER);
        textSize(15);

        //this if else block makes the cells brightness oscillate if the betIsActive property is true, and it makes cell more visible if it has the mouse hovering over it
        if (this.betIsActive)
        {
            this.extraClr = 40 + sin(frameCount / 10) * 40;
        }
        else if (this.mouseIsOver())
        {
            this.extraClr = 60;
        }
        else
        {
            this.extraClr = 0;
        }


        //applying extra brightness to color array of object
        fill(this.clr.map(x => x + this.extraClr));
        rect(this.x, this.y, this.w, this.h);
        fill(255);
        text(this.value, this.x, this.y);

        pop();
    }

    //array to contain all instances. Static does so the array is only defined once
    static betArray = [];
}




function mousePressed()
{
    //calls pressed method of all elemts in the classes' static array
    RouletteTable.betArray.forEach(object => object.pressed());
    GeneralButton.list.forEach(object => object.pressed());
}

class GeneralButton
{

    constructor(x, y, w, h, textIn)
    {
        //takes coordinates, size and textinput
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.msg = textIn;
        this.color = 150;
        this.hasBeenPressed = false;
        this.colorBump = 0;

        //pushing self to array
        GeneralButton.list.push(this);
    }

    display()
    {
        push();

        textAlign(CENTER, CENTER);
        textFont("sans-serif");
        rectMode(CENTER);
        stroke(0);

        //brightens object if mouse is hovering on object
        if (this.mouseIsOver())
        {
            this.colorBump = 30;
        }
        else
        {
            this.colorBump = 0
        }

        fill(this.color + this.colorBump);
        rect(this.x, this.y, this.w, this.h);

        fill(0);
        noStroke();
        textSize(15);
        text(this.msg, this.x, this.y);

        pop();
    }

    mouseIsOver()
    {
        //checks if mouse is over the object
        if (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2)
        {
            return true
        }
        else
        {
            return false
        }
    }

    pressed()
    {
        //method called in mousePressed
        if (this.mouseIsOver())
        {
            this.hasBeenPressed = true
        }
    }

    //same as in other class: array to contain all instances. Static does so the array is only defined once
    static list = []
}