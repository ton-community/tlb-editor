# TLB Editor

This is a web editor for working with TON TL-B schema. It allows you to generate Typescript code from TL-B schema using [tlb-codegen](https://github.com/ton-community/tlb-codegen).
Besides generating code, you can also convert your data in serialized format to JSON and vice versa according to the schema. The project is deployed on Github Pages [tlb-editor](https://polyprogrammist.github.io/tlb-editor/). More information about the editor, as well as examples, you can find in it's [about](https://polyprogrammist.github.io/tlb-editor/#/about) page. 

## Installation and Running
The project uses npm, typescript and React. To install:
```
git clone git@github.com:PolyProgrammist/tlb-editor.git
cd tlb-editor
npm install
npm run build
```
To run in a dev environment:
```
npm run dev
```

## License

This package is released under the [MIT License](LICENSE).