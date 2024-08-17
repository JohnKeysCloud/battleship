export default {
  moduleFileExtensions: ["ts" ,"js", "json"],
  rootDir: '../',
  testEnvironment: 'node',
  testMatch: ["<rootDir>/src/tests/**/*.test.{js,ts}"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.ts$": "ts-jest" 
  },
  verbose: true, // optional to get more detailed output
};

// 💭 --------------------------------------------------------------

// * moduleFileExtentions
//   Purpose: This rray specifies the file extensions that Jest will recognize and process. 
//   Components: 
//    - `js`: Recognizes JavaScript files.
//    - `json`: Recognizes JSON files.

// * testEnvironment
//   Purpose: Specifies the environment in which Jest will run your tests.
//   Component:
//    - `node`: Indicates that the tests will run in a Node.js environemnt. This is useful for server-side testing or when your code relies on Node.js APIs.

// * testMatch
//   Purpose: Determines the glob patterns Jest uses to detect test files.
//   Component: `["**/src/tests/**/*.test.js"]`: Jest will look for test files matching this pattern. Specifically, it will find files with a `.test.js` extension within the `src/tests` directory or any of its subdirectories.
//  `**/`: Matches any text across multiple directory levels. In our case, it's first appearance "any number of directories" before reaching `src/tests`.
//  `*`: Matches any text within a single directory level. In our case, it's appearance means to match any filename that ends with `.test.js`.
//  This isn't regular expression syntax, instead it makes use of glob patterns {1} to match files.

// * transform
//   Purpose: Defines how files should be transformed before running the tests.
//   Component: 
//    - `"^.+\\.js$"`: This is a regular expression that matches all `.js` files.
//    - `"babel-jest"`: Indicates that these files should be transformed using `babel-jest`. This allows Jest to proess JavaScript files with Babel, enabling the use of modern JavaScript syntax and features in your tests.

// 💭 --------------------------------------------------------------

// {1} Glob Patterns:
// Glob patterns are used instead of regular expressions because they are more intuitive for file path matching and are commonly used in Unix - like operating systems for file manipulation commands.They allow you to quickly and easily specify which files to include or exclude without the complexity of regular expressions.

// Glob Pattern Components
// Here are the key components of glob patterns, which you see in the testMatch configuration:

//|  *: Matches any number of characters within a single directory level.
//|  Example: *.js matches foo.js, bar.js, but not foo / bar.js.

//|  **: Matches any number of characters across multiple directory levels.
//|  Example: **/*.js matches foo.js, foo/bar.js, foo/bar/baz.js.

//|  ?: Matches a single character.
//|  Example: file?.js matches file1.js, fileA.js, but not file10.js.

//|  {}: Matches a group of patterns.
//|  Example: {foo,bar}.js matches foo.js and bar.js.

//|  []: Matches any one of the characters within the brackets.
//|  Example: file[1-3].js matches file1.js, file2.js, and file3.js.