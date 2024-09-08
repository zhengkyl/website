import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
  redirects: () => [
    {
      source: "/posts/illegal_qr_codes",
      destination: "/posts/crafting_qr_codes",
      permanent: true,
    },
  ],
};

const withMDX = createMDX({
  options: {
    remarkRehypeOptions: { clobberPrefix: "" },
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      () => {
        // This plugin appends the post folder path to img srcs
        // ex image.png -> /posts/crafting_qr_codes/image.png
        return (tree, file) => {
          const dirs = file.history[0].split("/");
          const parent = dirs[dirs.length - 2];
          if (parent !== "posts") return;

          const slug = dirs[dirs.length - 1].slice(0, -4);

          const visit = (node) => {
            if (node.type !== "JSXElement") return;

            for (const child of node.children) {
              visit(child);
            }

            if (node.openingElement.name.name !== "img") return;

            for (const attr of node.openingElement.attributes) {
              if (attr.name.name !== "src") continue;
              attr.value.value = `/posts/${slug}/${attr.value.value}`;
            }
          };

          for (const node of tree.children) {
            if (node.type === "mdxFlowExpression") {
              visit(node.data.estree.body[0].expression);
            } else if (node.type === "paragraph") {
              for (const child of node.children) {
                if (child.type !== "image") continue;
                child.url = `/posts/${slug}/${child.url}`;
              }
            }
          }
        };
      },
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
