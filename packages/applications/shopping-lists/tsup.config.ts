import {defineConfig} from "tsup";

export default defineConfig({
  clean: true,
  target: "es2019",
  format: ["cjs", "esm"],
  splitting: true,
  treeshake: true,
  minify: false,
  sourcemap: false,
  entry: ["src/index.ts"],
});