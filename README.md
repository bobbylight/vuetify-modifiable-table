# vuetify-modifiable-table
A table control that lets the user edit a collection of arbitrary
objects.

I had this control in an old thick client I had written long time
ago, so I decided it would be a good learning project to "port" it
to vue.  It's still pretty bare-bones but I might flesh it out
some if I use it in some apps.


## Dependencies
This component is a Vue component, and requires Vuetify.


## Useful commands
```
npm install    # Download dependencies
npm run serve  # Compiles and hot-reloads localhost:8080 for development
npm run build  # Builds UMD and commonjs modules for this project
npm run test   # Runs unit tests
```

## Using in an application
Not sure if it's kosher, but for TypeScript projects I just add this library
to my dependencies, then just:

```javascript
import ModifiableTable from 'vuetify-modifiable-table/modifiable-table.vue'
```

This way you don't have to worry about minified builds, type definitions, etc.
The component will just get minified in your consuming project.

For non-TypeScript projects a built version of the component lives in `dist`.
