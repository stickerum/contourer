# Development

Run your local copy of Contourer for development

## Install

Clone repository

```sh
$ git clone https://github.com/stickerum/contourer
$ cd contourer
```

Install Node.js dependencies

```sh
$ npm i
```

## Run Contourer

To process image with Contourer pass path to this image

```sh
$ npm start <path-to-file>
```

## Pack binaries

Create binary files to use Contourer on production by the following script.

```sh
$ npm run pack
```

Binaries for Linux, macOS and Windows will be created in `build` directory.
