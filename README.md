# dmdoc-comment-generator

**dmdoc-comment-generator** is an extension for Visual Studio Code that allows to generate comments that are readable by [dmdoc](https://github.com/SpaceManiac/SpacemanDMM/tree/master/src/dmdoc) for procs.

## Building

1. Install [Node and NPM][node].
2. Download dependencies: `npm install`
3. If installing VSCE globally:
   1. `npm install -g vsce`
   2. `vsce package`
4. If installing VSCE locally:
   1. `npm install vsce`
   2. `./node_modules/vsce/out/vsce package`
5. Install produced `.vsix` into Visual Studio Code.

[node]: https://nodejs.org/en/