Hero is a [hexo][2]-based command line tool that use [xsd2json][3] to generate json schema from xml schema files.

## Prerequisite

You need to install [swi-prolog][1]

## Workflow

1. you need to create a empty directory, and run the following command to initialize it in the created directory.

    ```
    $ mkdir hero-test && cd hero-test
    $ hero init
    [info] Copying data
    [info] You are almost done! Don't forget to run `npm install` before you start!
    ```
2. install dependency packages

    ```
    $ npm install
    npm http GET https://registry.npmjs.org/interpreted
    npm http GET https://registry.npmjs.org/nomnom
    npm http GET https://registry.npmjs.org/async
    ....
    ```
3. place your xsd files to `xsd` directory, and run `hero schema` to generate json schema files in `json` directory.

    ```
    $ hero schema
    [info] Generating json schema ...
    [info] Json schema models generated.
    ```

## Conclution

If there are any xml schema document instances could not be converted to json schema correctly, please consult the [xsd2json][3] project.

  [1]: http://www.swi-prolog.org/download/stable
  [2]: http://hexo.io
  [3]: https://github.com/fnogatz/xsd2json
