import sharp from "sharp";

export default {
  plugins: [
    [
      "snowpack-plugin-sharp",
      {
        transformers: [
          {
            fileExt: ".png",
            apply: (file) =>
              sharp(file).png({
                quality: 50,
              }),
          },
        ],
      },
    ],
  ],
};
