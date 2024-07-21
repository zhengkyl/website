import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      (_options) => {
        // This plugin converts frontmatter to an exported object
        // reference https://github.com/omidantilong/remark-mdx-next
        return (tree, _file) => {
          // should be first node if exists, but might come after imports?
          const frontmatter = tree.children.find(
            (node) => node.type === "yaml"
          );

          if (frontmatter == null) return;

          const pairs = frontmatter.value
            .split("\n")
            .map((pair) => pair.split(": "));

          tree.children.unshift({
            type: "mdxjsEsm",
            // value unnecessary, but nice for debug
            value: "export const frontmatter = {};",
            data: {
              estree: {
                type: "Program",
                sourceType: "module",
                body: [
                  {
                    type: "ExportNamedDeclaration",
                    specifiers: [],
                    source: null,
                    declaration: {
                      type: "VariableDeclaration",
                      kind: "const",
                      declarations: [
                        {
                          type: "VariableDeclarator",
                          id: {
                            type: "Identifier",
                            name: "frontmatter",
                          },
                          init: {
                            type: "ObjectExpression",
                            properties: pairs.map(([name, value]) => ({
                              type: "Property",
                              kind: "init",
                              key: { type: "Identifier", name },
                              value: { type: "Literal", value },
                            })),
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          });
        };
      },
    ],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
