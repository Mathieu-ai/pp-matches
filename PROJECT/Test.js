const inquirer = require("inquirer");
const lodash = require("lodash");

class Ailumette {
  Pyramide = [
    [" ", " ", " ", "|", " ", " ", " "],
    [" ", " ", "|", "|", "|", " ", " "],
    [" ", "|", "|", "|", "|", "|", " "],
    ["|", "|", "|", "|", "|", "|", "|"],
  ];
  line = 0;
  pipes = 0;
  turn = 1;
  qLine = [
    {
      type: "input",
      name: "line",
      message: "Quelle Ligne ? :",
    },
  ];
  qpipes = [
    {
      type: "input",
      name: "pipes",
      message: "Combien ? :",
    },
  ];

  displayPyramide() {
    console.log(" ********* ");
    lodash.each(this.Pyramide, (y) => {
      console.log("* " + y.join("") + " *");
    });
    console.log(" ********* ");
  }

  begin() {
    this.displayPyramide();
    console.log("\n" + (this.turn ? "A toi : " : "A moi ..."));
    this.tour();
  }

  async tour() {
    if (this.turn) {
      while (this.line === 0) {
        const line = await this.lineOrpipes("line");
        if (this.checkSaisi(line, "line")) {
          this.line = line;
        }
      }

      while (this.pipes === 0) {
        const pipes = await this.lineOrpipes("pipes");
        if (this.checkSaisi(pipes, "pipes")) {
          this.pipes = pipes;
        }
      }

      this.updatePyramide();
    } else {
      this.dumbAI();
    }
  }

  lineOrpipes(type) {
    return new Promise((resolve) => {
      inquirer
        .prompt(type === "line" ? this.qLine : this.qpipes)
        .then((answer) => {
          resolve(parseInt(type === "line" ? answer.line : answer.pipes));
        });
    });
  }

  dumbAI() {
    setTimeout(() => {
      const pipesLeftInGame = [];

      lodash.each(this.Pyramide, (line, i) => {
        if (lodash.countBy(line)["|"] > 0) {
          pipesLeftInGame.push(i + 1);
        }
      });

      this.line =
        pipesLeftInGame[Math.floor(Math.random() * pipesLeftInGame.length)];

      const calculateNbPipes = lodash.countBy(this.Pyramide[this.line - 1])[
        "|"
      ];
      this.pipes = Math.floor(
        Math.random() * (calculateNbPipes > 1 ? 2 : calculateNbPipes) + 1
      );

      this.updatePyramide();
    }, 1500);
  }

  checkSaisi(value, type) {
    if (type === "line" || type === "pipes") {
      const checkPipes =
        type === "line"
          ? lodash.countBy(this.Pyramide[value - 1])["|"] || 0
          : lodash.countBy(this.Pyramide[this.line - 1])["|"] || 0;

      if (value < 0 || typeof value !== "number") {
        console.log("Il faut marquer un nombre postif ( ͠❛ ͜ʖ͠❛ )");
        return false;
      } else if (type === "line") {
        if (value === 0 || value > 4) {
          console.log("La saisi est hors de portée ¯_( ͠❛ ͜ʖ͠❛ )_/¯");
          return false;
        } else if (checkPipes === 0) {
          console.log("il n'y a pas de '|' disponible ¯_( ͠─ ͜ʖ͠─ )_/¯");
          return false;
        }
      } else if (type === "pipes") {
        if (value === 0) {
          console.log("Il faut au moins en enlever une (っ ͠─ ͜ʖ͠─ )っ");
          return false;
        } else if (value > 2) {
          console.log("le maximum que vous pouvez enlever est de 2  ͠─ ₃͠─ ");
          return false;
        } else if (value > checkPipes) {
          console.log("Il n'y a pas assez de '|' dans cette ligne ( ͡' 𝆒 ͡')");
          return false;
        }
      }
    }
    return true;
  }

  updatePyramide() {
    this.Pyramide[this.line - 1] = this.Pyramide[this.line - 1].fill(
      " ",
      this.Pyramide[this.line - 1].lastIndexOf("|") + 1 - this.pipes
    );

    let pipesCount = 0;
    lodash.each(this.Pyramide, (line) => {
      pipesCount += lodash.countBy(line)["|"] || 0;
    });

    console.log(
      `${this.turn ? "Humain" : "AI"} a enlevé ${this.pipes} ${
        this.pipes > 1 ? "'|'" : "'|'"
      } de la ligne ${this.line}`
    );

    this.displayPyramide();

    this.line = this.pipes = 0;

    if (pipesCount === 0) {
      console.log(
        "\n" +
          (this.turn
            ? "tu as perdu ☜(ˆ▿ˆc)"
            : "Tu as gagné ! Bravo (╯ ͡' 益 ͡')╯┻━┻")
      );
    } else {
      this.turn = this.turn ? 0 : 1;
      console.log("\n" + (this.turn ? "A toi :" : "A moi..."));
      this.tour();
    }
  }
}

const GameOfAlumette = new Ailumette();

GameOfAlumette.begin();
