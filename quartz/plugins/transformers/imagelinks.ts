import { QuartzTransformerPlugin } from "../types";
import { Root } from "hast";
import { visit } from "unist-util-visit";
import { Element, Properties } from "hast";

interface Options {
  /** Open links in a new tab */
  openLinksInNewTab: boolean;
}

const defaultOptions: Options = {
  openLinksInNewTab: false,
};

export const LinkImagesToOriginal: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };

  return {
    name: "LinkImagesToOriginal",
    htmlPlugins() {
      return [
        () => {
          return (tree: Root) => {
            visit(tree, "element", (node, index, parent) => {
              if (node.tagName === "img" && node.properties && typeof node.properties.src === "string") {
                
                const originalSrc = node.properties.src;

                // Create the anchor node
                const anchorNode: Element = {
                  type: "element",
                  tagName: "a",
                  properties: {
                    href: originalSrc,
                    ...(opts.openLinksInNewTab ? { target: "_blank" } : {}),
                  },
                  children: [node],
                };

                // Ensure parent and parent.children are defined
                if (parent && Array.isArray(parent.children)) {
                  parent.children[index as number] = anchorNode;
                }
              }
            });
          };
        },
      ];
    },
  };
};
