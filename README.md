# Contourer

Tool to make svg contours for stickers images.

## Example

| **Original image**            | **Contour with margin 0**       | **Contour with margin 10**       |
|-------------------------------|---------------------------------|----------------------------------|
| ![](assets/examples/phil.png) | ![](assets/examples/phil_0.svg) | ![](assets/examples/phil_10.svg) |

As an original image you should use png pic with a transparent background.

## How it works

| Get an image | Create a shade | Find a contour | Extend the shade |
|-----|----|----|-----|
| ![](assets/how-it-works/step-0.svg) | ![](assets/how-it-works/step-1.svg) | ![](assets/how-it-works/step-2.svg) | ![](assets/how-it-works/step-3.svg) |


| Color it black | Trace a shade | Remove filling | Сombine with image |
|----------------|---------------|----------------|--------------------|
| ![](assets/how-it-works/step-4.svg) | ![](assets/how-it-works/step-5.svg) | ![](assets/how-it-works/step-6.svg) | ![](assets/how-it-works/step-7.svg)

<!-- ## Usage

...

## Development

To run your local copy of Contourer for development follow these steps

### Install

```sh

```

```sh
$ npm i
```

### Run Contourer

To process image with Contourer pass path to this image

```sh
$ npm start <path-to-file>
```

### Pack binaries

Create a single binary file to use Contourer on production by the following script.

```sh
$ npm run pack
```

Binaries for Linux, macOS and Windows will be created in `build` directory. -->

## License

GPL-2.0
