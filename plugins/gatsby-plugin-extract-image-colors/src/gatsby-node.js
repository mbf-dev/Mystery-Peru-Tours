const fs = require("fs");
const Vibrant = require("node-vibrant");
const Color = require("color");

const defaultOptions = {
  extensions: ["svg"],
  exclude: []
};

const getHex = rgb => {
  return Color({
    r: rgb[0],
    g: rgb[1],
    b: rgb[2]
  }).hex();
};

exports.onCreateNode = async ({ node, actions }, pluginOptions) => {
  const options = Object.assign({}, { ...defaultOptions, ...pluginOptions });
  if (
    options &&
    options.extensions &&
    options.exclude &&
    options.extensions.indexOf(node.extension) !== -1 &&
    options.exclude.indexOf(`${node.name}${node.ext}`) === -1
  ) {
    // Transform the new node here and create a new node or
    // create a new node field.
    console.log("SVGGGGGGGGGGGGG  " + node.absolutePath);

    const colors = {
      vibrant: "222222222222222222",
      darkVibrant: "222222222222222222",
      lightVibrant: "222222222222222222",
      muted: "222222222222222222",
      darkMuted: "222222222222222222",
      lightMuted: "222222222222222222"
    };
    node.colors = colors;
  }
};

exports.onPreExtractQueries = async ({ store, getNodesByType }) => {
  const program = store.getState().program;

  // Check if there are any File nodes. If so add fragments for File.
  // The fragment will cause an error if there are no File nodes.
  if (getNodesByType(`File`).length == 0) {
    return;
  }

  // We have File nodes so let's add our fragments to .cache/fragments.
  await fs.copyFile(
    require.resolve(`${__dirname}/src/fragments.js`),
    `${program.directory}/.cache/fragments/extract-image-colors-fragments.js`,
    err => {
      if (err) throw err;
    }
  );
};
