const fs = require('fs');

class Report {
    constructor(directory, file) {
        this.directory = directory;
        this.file = `${directory}/${file}`;
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
    randomID() {
        return Math.random()
        .toString(36)
        .substring(2, 15);
    }
    addLine() {
        this.addToFile('\n<hr>');
    }
    // appends file with new lines
    addToFile(lines) {
        fs.appendFileSync(
            this.file, lines,
            function(err) {
              if (err) {
                return console.log(err);
              }
              console.log('err');
            },
          );
    }
    // writes new file 
    startTheReport(title, script, css) {
        if (!fs.existsSync(this.directory)){
            fs.mkdirSync(this.directory);
            fs.rename('./node_modules/toxic-report/style.css', `${this.directory}/style.css`, function (err) {
                if (err) {
                    if (err.code === 'EXDEV') {
                        copy();
                    } else {
                        callback(err);
                    }
                    return;
                }
                callback();
            });
            fs.rename('./node_modules/toxic-report/button.js', `${this.directory}/button.js`, function (err) {
                if (err) {
                    if (err.code === 'EXDEV') {
                        copy();
                    } else {
                        callback(err);
                    }
                    return;
                }
                callback();
            });
        }
        if (fs.existsSync(this.file)) {
            fs.unlinkSync(this.file); // remove previous file
        }     
        if (this.file)
        this.addToFile(`<!DOCTYPE html>\n
        <html>\n
        <head>\n
        <title>
        ${title}
        </title>\n
        </head>\n
        <body>\n
        <script src="${script}"></script>
        <link rel="stylesheet" href="${css}">
        <p><h3>Started the testing</h3></p>\n
        <p><h3>${this.getTime()[0]}</h3></p><hr>`);
    }
    // adds an error message to body with displayable stacktrace and optional screenshot
    addError(message, stacktrace, image=undefined) {
        const idStacktrace = this.randomID();
        const idScreenshot = this.randomID();
        this.addToFile(
            `\n<p><div class="message error">${this.getTime()[1]} ${message}</div></p>\n`);
        // add buttons and diagnostic stuff, don't touch for God's sake
        if (image !== undefined) {
            this.addToFile(
            `\n<p><button class="show-error" onclick="hideAndShow('${idStacktrace}')">See stacktrace</button>
            <button class="show-image" onclick="hideAndShow('${idScreenshot}')">See screenshot</button></p>
            \n<div id="${idStacktrace}" class ="message" style="display: none">
                <p>${stacktrace}</p>
                </div>
                \n<div id="${idScreenshot}" style="display: none">
                 <p><img src="${image}"></p>
                 </div>`);
        } else {
            this.addToFile(
                `\n<button class="show-error" onclick="hideAndShow('${idStacktrace}')">See stacktrace</button>
                \n<div id="${idStacktrace}" class ="message" style="display: none">
                <p>${stacktrace}</p>
                </div>`);
        }
    }
     // says that test passed
    addSuccess(message) {
        this.addToFile(`\n<p><div class="message success">${this.getTime()[1]} 
        ${message} &#9989;</div></p>`)
    }
    // add a line with no coloring
    addMessage(message) {
        this.addToFile(`\n<p><div class="message">${this.getTime()[1]} 
        ${message}</div></p>`)
    }
    // just adds ending
    addEnding() {
        this.addToFile('\n</body>\n</html>');
    }
}

module.exports = { Report };