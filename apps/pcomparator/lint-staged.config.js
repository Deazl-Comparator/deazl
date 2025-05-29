
module.exports = {
  "*.{ts,tsx,js,jsx}": ["yarn format:check .", "yarn lint:check", () => "yarn typescript:check --skipLibCheck -p tsconfig.json"],
  "*": "yarn translation:extract"
}
