const { loadImage, applyTransforms, builtins } = require("imagetools-core");

// loadImageFromDisk is a utility function that creates a sharp instances of the specified image
const image = loadImage("../../public/logo.png");

// our image configuration
const config = {
  width: "400",
  height: "300",
  format: "webp",
};

// This function takes our config and an array of transformFactories and creates an array of transforms
// the resulting array of transforms can be cached
const { transforms, warnings } = generateTransforms(config, builtins);

// apply the transforms and transform the given image
const { image: transformedImage, metadata } = await applyTransforms(
  transforms,
  image
);

console.log(transformedImage);

export default 1;
