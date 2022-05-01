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