# Introduction

The files `tsconfig.app.json`, `tsconfig.json`, and `tsconfig.spec.json` determines how the typescript code will be
transpiled into JS code, how strict the transpiled code will be, and many more.

`package.json` file has all the necessary packages for the project.

`.editorconfig` file is relevant for all the code editor settings.

`.gitignore` if also relevant if we are using version control for Git

`src/index.html` is loaded when the visitor visits the website, `src/style.css` is the styling file which will
determine the global styling for the project and `src/main.ts` is the code that will be first executed when the
applicaiton loads into the browser.

# Compilation Steps

When we run the project, the angular cli transpiles the code into JS. Hence the reason one sees the `main.js`
into the browser.
