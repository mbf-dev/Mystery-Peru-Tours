import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Img from "gatsby-image";

const query = graphql`
  {
    file(extension: { eq: "jpg" }) {
      relativeDirectory
      name
      id
      publicURL
      extension
      publicURL
      colors {
        ...GatsbyImageColors
      }
      childImageSharp {
        fluid(maxWidth: 2500) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;

const ImageWithBackground = () => {
  const data = useStaticQuery(query);
  return (
    <div style={{ backgroundColor: data.file.colors.vibrant, height: "100vh" }}>
      <Img fluid={data.file.childImageSharp.fluid} />
    </div>
  );
};

export default ImageWithBackground;
