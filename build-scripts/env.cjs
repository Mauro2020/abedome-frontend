const fs = require("fs");
const path = require("path");
const paths = require("./paths.cjs");

const isTrue = (value) => value === "1" || value?.toLowerCase() === "true";
const VERSION_PATTERN = /^version\s*=\s*"(\d+(?:\.\d+)+(?:\.dev\d*)?)"\s*$/m;

module.exports = {
  isProdBuild() {
    return (
      process.env.NODE_ENV === "production" || module.exports.isStatsBuild()
    );
  },
  isStatsBuild() {
    return isTrue(process.env.STATS);
  },
  isTestBuild() {
    return isTrue(process.env.IS_TEST);
  },
  isNetlify() {
    return isTrue(process.env.NETLIFY);
  },
  version() {
    const version = fs
      .readFileSync(path.resolve(paths.root_dir, "pyproject.toml"), "utf8")
      .match(VERSION_PATTERN);
    if (!version) {
      throw Error("Version not found");
    }
    return version[1];
  },
  isDevVersion() {
    return /\.dev\d*$/.test(module.exports.version());
  },
  isDevContainer() {
    return isTrue(process.env.DEV_CONTAINER);
  },
};
