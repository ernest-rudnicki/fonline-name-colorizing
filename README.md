# Fonline Name Colorizing
A small and portable application written using neutralino.js framework and Preact. Thanks to neutralino.js framework the bundle size of the application is a lot smaller than the typical Electron based application. The application lets you to maintain your NameColorizing files or create new ones for all the servers of Fonline.

![Animation](https://user-images.githubusercontent.com/37155981/170124903-06c5fc01-7857-4cb1-8649-5c199b8940e9.gif)

## Features
- Create NameColorizing file or import an existing one.
- Create color groups and specify colors using intuitive form-like editor that includes a color picker.
- Validate whether your username is arleady added to another colour group.
- Export color groups into NameColorizing text file.

## Running the application in a development mode
Firstly, clone or fork this repository and then run following commands.

```
// install neutralino cli globally
npm install -g @neutralinojs/neu

// inside the root folder of the repository
neu update

// install all the dependencies
npm run setup

// run application in the development mode (after the preact project builds, you need to refresh the neutralino app)
npm run dev:app
```

## Useful commands

*   `npm run test:coverage`: runs tests to show the code coverage

*   `npm run test:watch`: runs tests in watch mode

*   `npm run dev:front`: runs only the Preact project in development mode

*   `npm run dev:app`: runs only the nautrlino.js application in development mode

## Preact and TypeScript
There are a lot of issues when it comes to React types and Preact JSX. Therefore, I have created a function as a workaround that overrides the JSX type of Preact components. For simplicity the test files are written in JSX files not TSX, to avoid calling the function `overrideReactType` in every test case.
```
// This throws an error, that the component is not assignable to children of Form.Item.
              <Form.Item
                name="usernames"
                rules={[{ validator: validateUsernames }]}
              >
                  <UsernameList
                    allUsernames={allUsernames}
                    colors={colors}
                    selectedColorKey={selectedColorKey}
                  />
              </Form.Item>
              
// This does not throw an error because the function overrideReactType returns a ReactNode
              <Form.Item
                name="usernames"
                rules={[{ validator: validateUsernames }]}
              >
                {overrideReactType(
                  <UsernameList
                    allUsernames={allUsernames}
                    colors={colors}
                    selectedColorKey={selectedColorKey}
                  />
                )}
              </Form.Item>
```
