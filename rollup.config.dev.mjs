import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import commonjs from "@rollup/plugin-commonjs";
import watchAssets from "rollup-plugin-watch-assets";
import replace from "@rollup/plugin-replace";

export default [
  {
    input: "src/lib/components/editor/editor.tsx",
    output: [
      {
        file: "dist/index.js",
        format: "iife",
        sourceMap: true,
      },
    ],
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      typescript({ compilerOptions: { sourceMap: true } }),
      postcss(),
      copy({
        targets: [
          { src: "src/lib/components/editor/assets/**/*", dest: "dist/assets" },
          { src: "src/lib/components/editor/index.html", dest: "dist" },
        ],
      }),
      watchAssets({ assets: ["src"] }),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),
    ],
  },
];
