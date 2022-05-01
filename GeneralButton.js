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