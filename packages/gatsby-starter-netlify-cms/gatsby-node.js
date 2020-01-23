const _ = require("lodash");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()));
      return Promise.reject(result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;
    console.log("fgdfg");
    posts.forEach(edge => {
      const id = edge.node.id;
      console.log("Plantilla  " + edge.node.frontmatter.templateKey);
      if (String(edge.node.frontmatter.templateKey) != "null") {
        createPage({
          path: edge.node.fields.slug,
          tags: edge.node.frontmatter.tags,

          component: path.resolve(
            `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
          ),
          // additional data can be passed via context
          context: {
            id
          }
        });
      }
    });

    // Tag pages:
    let tags = [];
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach(edge => {
      if (_.get(edge, `node.frontmatter.tags`)) {
        tags = tags.concat(edge.node.frontmatter.tags);
      }
    });
    // Eliminate duplicate tags
    tags = _.uniq(tags);

    // Make tag pages
    tags.forEach(tag => {
      const tagPath = `/tags/${_.kebabCase(tag)}/`;

      createPage({
        path: tagPath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag
        }
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  fmImagesToRelative(node); // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value
    });
  }
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    "type MarkdownRemark implements Node { frontmatter: Frontmatter }",
    schema.buildObjectType({
      name: "Frontmatter",
      fields: {
        tags: {
          type: "[String!]",
          resolve(source, args, context, info) {
            // For a more generic solution, you could pick the field value from
            // `source[info.fieldName]`

            const { tags } = source;

            if (
              source.tags == null ||
              source.tags == undefined ||
              (Array.isArray(tags) && tags.length === 1 && tags[0] === "")
            ) {
              console.log("Locasooooo---");

              return ["<p>uncategor<strong>ized</strong></p>"];
            }
            return tags;
          }
        },
        description: {
          type: "[String!]",
          resolve(source, args, context, info) {
            // For a more generic solution, you could pick the field value from
            // `source[info.fieldName]`

            const { description } = source;

            console.log("queeeeeee------ " + description);

            return [
              `<svg viewBox="0 0 109 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:figma="http://www.figma.com/figma/ns"><title>Logo</title><g transform="translate(-1470)" figma:type="canvas"><g style="mix-blend-mode:normal" figma:type="vector" transform="translate(1470)" fill="#f40"><use xlink:href="#b" style="mix-blend-mode:normal"/><use xlink:href="#c" style="mix-blend-mode:normal"/><use xlink:href="#d" style="mix-blend-mode:normal"/><use xlink:href="#e" style="mix-blend-mode:normal"/><use xlink:href="#f" style="mix-blend-mode:normal"/></g></g><defs><path id="b" d="M22.735 23.171c.283.323.053.829-.376.829h-5.907c-.285 0-.556-.121-.745-.333l-9.414-10.526v10.36c0 .276-.224.5-.5.5h-5.293c-.276 0-.5-.224-.5-.5v-23c0-.276.224-.5.5-.5h5.293c.276 0 .5.224.5.5v9.815l9.141-9.99c.19-.207.457-.325.738-.325h5.762c.437 0 .664.521.366.841l-9.851 10.563 10.287 11.767z"/><path id="c" d="M45.991 24c-.199 0-.38-.118-.459-.301l-2.024-4.669h-10.67l-2.024 4.669c-.079.183-.259.301-.459.301h-5.212c-.366 0-.608-.381-.453-.712l10.782-23c.082-.176.259-.288.453-.288h4.358c.194 0 .37.112.453.287l10.815 23c.156.332-.086.713-.452.713h-5.108zm-11.135-9.668h6.635l-3.317-7.694-3.317 7.694z"/><path id="d" d="M55.525 24c-.276 0-.5-.224-.5-.5v-23c0-.276.224-.5.5-.5h5.293c.276 0 .5.224.5.5v18.428h9.759c.276 0 .5.224.5.5v4.072c0 .276-.224.5-.5.5h-15.552z"/><path id="e" d="M75.279.5c0-.276.224-.5.5-.5h9.315c2.667 0 4.959.477 6.874 1.43 1.938.953 3.42 2.338 4.446 4.153 1.026 1.793 1.539 3.926 1.539 6.4 0 2.496-.513 4.652-1.539 6.468-1.003 1.793-2.474 3.166-4.412 4.119-1.915.953-4.218 1.43-6.908 1.43h-9.315c-.276 0-.5-.224-.5-.5v-23zm9.37 18.462c2.371 0 4.138-.579 5.301-1.736 1.163-1.157 1.744-2.905 1.744-5.242 0-2.338-.581-4.074-1.744-5.209-1.163-1.157-2.93-1.736-5.301-1.736h-3.078v13.923h3.078z"/><path id="f" d="M102.913 24c-.276 0-.5-.224-.5-.5v-23c0-.276.224-.5.5-.5h5.293c.276 0 .5.224.5.5v23c0 .276-.224.5-.5.5h-5.293z"/></defs></svg>`
            ];
          }
        }
      }
    })
  ];
  createTypes(typeDefs);
};
