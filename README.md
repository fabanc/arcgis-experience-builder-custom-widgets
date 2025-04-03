# arcgis-experience-builder-custom-widgets

# Import in experience builder

Users can add this repository by checking it out in the client app of Experience Builder. Once the repository is cloned your should see a folder `client\arcgis-experience-builder-custom-widgets`.

To add that new folder to the list of folders used to build your client apps, modify the file tsconfig.json.

 * Update the path section to include this folder
 * Update the include section to include this folder

 I usually comment out any reference to the out-of-the-box custom widget folder as well.

```json
{
  "compileOnSave": false,
  "buildOnSave": false,
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "module": "esnext",
    "moduleResolution": "node",
    "target": "es6",
    "skipLibCheck": true,
    "lib": [
      "dom",
      "es6",
      "scripthost",
      "es2015",
      "es2020.Promise"
    ],
    "jsx": "react",
    "noEmitHelpers": false,
    "noUnusedLocals": false,
    "allowUnreachableCode": true,
    "allowJs": true,
    "strictNullChecks": false,
    "baseUrl": ".",
    "paths": {
      "calcite-components": ["jimu-ui/calcite-components"],
      "esri/*": ["./node_modules/@arcgis/core/*"],
      "widgets/*": [
        //"./your-extensions/widgets/*", 
        "arcgis-experience-builder-custom-widgets/*"]
    }
  },
  "include": [
    "dist/widgets",
    //"your-extensions",
    "arcgis-experience-builder-custom-widgets",
    "types",
    "jimu-core/lib/types"
  ],
  "exclude": [
    "node_modules",
    "arcgis-js-api",
    "**/*.js"
  ]
}

```