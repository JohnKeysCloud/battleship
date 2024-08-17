import path from 'path';
import { fileURLToPath } from 'url'; // `__dirname` is not available in ES modules by default
const __filename = fileURLToPath(import.meta.url); // ! {1}
const __dirname = path.dirname(__filename); // ! {2}

export default {
  entry: {
    index: path.resolve(__dirname, '../../src/app.ts'),
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].bundle.js',
    clean: true, // removes files that aren't in use
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-syntax-import-attributes'],
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.ts?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-syntax-import-attributes'],
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, '../tsconfig.json'),
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|ico)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },  
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

// 💭 --------------------------------------------------------------

// * {1} - import.meta.url
// `import.meta.url` is a special meta-property available in ESM (ECMA Script modules) that provides the URL of the current module's location. Hence its correlation with `__filename` and `__dirname` in CommonJS.

// If your module is located at `/Users/JohnKeysCloud/Desktop/jest-test/src/app.js`, `import.meta.url` will return `file:///Users/JohnKeysCloud/Desktop/jest-test/src/app.js`.

// Since it returns a URL, as mentioned above, we convert it to an absolute file path voa `fileURLToPath` from the `url` module

// For example:

// import { fileURLToPath } from 'url';

// * URL of the module (could be retrieved via `import.meta.url`)
// const fileURL = 'file:///Users/JohnKeysCloud/Desktop/jest-test/src/app.js';

// * Convert the URL to a file path
// const filePath = fileURLToPath(fileURL);

// console.log(filePath); // * Outputs: /Users/JohnKeysCloud/Desktop/jest-test/src/app.js

// 💭 --------------------------------------------------------------

// * {2} - __dirname
// __dirname is a global variable that provides the absolute path of the directory containing the currently executing script. This is useful for constructing file paths relative to the location of the script.

// For example:
// If we have a file at `/path/to/project/src/index.js`, `__dirname` inside `index.js` will be `/path/to/project/src`.

// When converting our Node.js script to use ES6 modules, `__dirname` is no longer available becuase ES6 modules handles file paths differently.

// Instead, we use `import.meta.url` to get the URL of the current module, and then convert this URL to a file path.

// We do this by importing the `fileURLtoPath` and `dirname` functions from the `url` and `path` modules respectively.

// We then convert `import.meta.url` to an absolute file path using `fileURLToPath`/
// Then we extract the directory path from this file path using `path.dirname`.

// 💭 --------------------------------------------------------------