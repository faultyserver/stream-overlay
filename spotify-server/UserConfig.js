import fs from "fs";

export function readUserConfig(configPath) {
  if (!fs.existsSync(configPath)) return undefined;

  return JSON.parse(fs.readFileSync(configPath));
}

export function writeUserConfig(configPath, config) {
  console.log(`Updating config at: ${configPath}`);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
