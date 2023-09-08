ts-mix
======

## Idea

Given multiple TS files, emit another file which has an API surface combining the two files together. This output file
re-exports everything from the two files, but handles conflicts gracefully.
- Interface and class properties and methods are merged (for classes with the same name) and re-emitted
- If certain properties from a file need to be exported or renamed, this can be specified in configuration

The emitted file is a "mixture" of the input files, producing a combined API.

## Use cases

- Customization (DPG/RLC) - make small tweaks and additions to generated code without having to edit the code
  - A less convention-driven version of the customization tool that we are using today that minimizes generated code
- Multiversion - mix in features based on whether we are in beta or not
  - Can have one base file and another file which adds in new beta functionality, for example
  - Both the beta and stable functionality can live in the working tree
- Tweaking old-style generated code
  - In old style clients we often want to tweak models (rename x property, change the type of y property, remove z property...)
    - New tool allows tweaks to be made without redefining the whole model
  - If there's a single model we don't want to expose as-is from the generated layer, we can't use `export *` anymor
    - Can choose not to emit certain models based on configuration

## Examples

### Customization

#### Configuration

In the prototype configuration is by YAML file but this could of course be changed.

```yaml
esm: true # signals we are using ES Modules (to ensure emitted imports/exports have a .js extension)
exports:
  # One mixture file is generated per subpath export
  - outputPath: src/index.exports.ts
    sources:
      - path: src/generated/src/index.ts
      - path: src/customizations/index.ts
  - outputPath: src/api.exports.ts
    sources:
      - path: src/generated/src/api/index.ts
      - path: src/customizations/api/index.ts
  - outputPath: src/models.exports.ts
    sources:
      - path: src/generated/src/models/index.ts
      - path: src/customizations/models/index.ts
  - outputPath: src/rest.exports.ts
    sources:
      - path: src/generated/src/rest/index.ts
```

### Output

#### `src/index.exports.ts`

```typescript
export {
  // ...all symbols not exported by the customizations file
} from './generated/src/index.js';

export {
  // ...all symbols not exported by the generated file, plus functions which are declared
  // in the generated file (the function definitions in the customization override the generated;
  // the customized code is free to reference the generated code in the implementation if it wants, too)
} from './customizations/index.js';

// OpenAIClient is declared in both files
export class OpenAIClient {
  // ...merged definition of OpenAIClient
}

// ...other merged and overriding delcarations, as necessary
```


This `index.exports.ts` file forms the public API surface for the primary export of the package. The other
files (`rest.exports.ts`, `models.exports.ts`, `api.exports.ts`) are emitted in a similar way and form the
API surface for their respective subpand form the API surface for their respective subpaths.
