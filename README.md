# Momentum

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.8.

Ng = Angular | Rb = Ruby on rails

## Aim for this project

To create a program within which helps you keep track of your goal acheivement, health, wealth, research, and time.

![Health Picture](https://peggyosterkamp.com/wp-content/uploads/2014/04/Golden-Proportion-da-Vinci_02.jpg)

- Health 
	- integrates with schedule service (time aspect)
	- create workout / diet plans based on your case / goals, which then the program and you take into consideration how much time you can dedicate working out each day of the week, we can then derive your caloric expenditure
	-we can then feed your caloric expenditure into a diet algorithm (based on percent macro nutrients with diet presets *keto, vegan, etc*)
	-then based on that we can implement that information in your schedule as you see fit

![gamba](https://tenor.com/bU1LK.gif)

- Wealth (FinCalc)
	- You put in income, expenses, and how much you'd like to divy up what's left and it does the rest!
	- I've done this kind of project [many times](https://github.com/wgauss/FinCalc) although I would like a proper implementation of a CRUD system rather than hard coding everything as i've done before out of laziness.


![Goal Picture](https://www.fossilconsulting.com/wp-content/uploads/2021/10/SMART-Graphic.png)

- Goal Acheivement
	- integrates with potentially every service
	- we essentially use the SMART goal template to ensure goal acheivement
	- depending on variables such as the type of goal it is, whether or not it needs time dedicated to acheive it or say we set aside x amount of money every paycheck to get x thing in x amount of time we can set scheduled reminders or goal trackers that we can see how far we've come to acheive said goal or see if we're on track to acheive it. 


![jaxBrain](https://images-ext-1.discordapp.net/external/etlizmJzNqsyLdcL9wRKGQSihAnUd9N08cAIXOj4KEI/https/i.imgur.com/FZFH9m0.png?format=webp&quality=lossless)
*jaxBrain has been a shelved project and I saw fit to revive it as this project is perfect to help spruce up the features of momentum*

- Research (jaxBrain)
	- still in design phase although the goal for this feature is to simplify and help visualize information for research purposes
	- displays information in node trees, as at least to me information can have relationships to others that once reviewed can help simplify review based on the relational nature of information.

In terms of time there will be a timeline like aspect that i'd like to experiment with. of course the calender will still be available although I fancy the idea of handling my time in a horizontal fashion rather than the traditional calendar way.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Rails

Please ensure you have ruby on rails installed on whatever platform you're on

navigat ot the `rails-api/` folder in a seperate terminal and run the `rails server` command while using momentum to ensure proper information flowing in and out of momentum.

May your days be better than yesterday, that's all we can work towards