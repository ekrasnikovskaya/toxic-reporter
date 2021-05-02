const fs = require('fs');

class Report {
    constructor(file) {
        this.file = file;
    }
    getTime() {
        const ts = Date.now();

        const dateString = new Date(ts).toLocaleString('ru', {
             timeZone: 'Europe/Moscow',
        });

        const date = dateString.split(', ')[0];
        const time = dateString.split(', ')[1];

        return [date, time];
    }
    // writes new file 
    addToFile(lines) {
        fs.appendFile(
            this.file, lines,
            function(err) {
              if (err) {
                return console.log(err);
              }
              console.log(`${this.getTime()[1]}  Cannot write to file`);
            },
          );
    }
    startTheReport(title, script, css) {
        this.addToFile(`<!DOCTYPE html>\n
        <html>\n
        <head>\n
        <title>
        ${title}
        </title>\n
        </head>\n
        <body>\n
        <script>${script}</script>
        <link rel="stylesheet" href="${css}">
        <p><h3>Started the testing</h3></p>\n
        <p>${this.getTime()[0]}</p>`);
    }
    // adds an error message to body with displayable stacktrace and optional screenshot
    addError(message, stacktrace, image=undefined) {
        this.addToFile(
            `\n<p><div class="message error">${message}</div></p>\n`);
        this.addToFile(
            `<p><button class="show-error" onclick="hideAndShow('stacktrace')">See stacktrace</button>`);
        if (image !== undefined) {
            this.addToFile(
            `<button class="show-image" onclick="hideAndShow('screenshot')">See screenshot</button></p>`);
        }
        this.addToFile(`<div id="stacktrace" class ="message" style="display: none">
        <p>Here will be a stacktrace for an error</p>
        </div>`);
        if (image ==! undefined) {
            this.addToFile(`<div id="screenshot" style="display: none">
            <p><img src="${image}"></p>
          </div>`)
        }
    }
    addMessage(message) {
        // adds just a line
    }
    addSuccess(message) {
        // says that test passed
    }
    addEnding() {
        // just adds ending
    }
}

export { Report };