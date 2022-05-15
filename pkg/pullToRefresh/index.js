const { readFile, copyFile }  = require('fs');
const { promisify } = require('util');
const { join } = require('path');

const readFilePromisify = promisify(readFile);
const copyFilePromisify = promisify(copyFile);

const readJson = function(path, options) {
  return readFilePromisify(path, options).then(stringifidData => JSON.parse(stringifidData));
}

const MODULE_NAME = 'Replaced Pull To Refreshing';
const LIB_FILE_PATH = '/lib/PullToRefresh.js';
const ES_FILE_PATH = '/es/PullToRefresh.js';
const PATCH_VERSION = '1.0.13';
const ANTD_MOBL_VERSION_PREFIX = '~2.2';
const DEFAULT_ANTD_MBOL_PATH = 'node_modules/antd-mobile';
const DEFAULT_PULL_TO_REFREAHING_PATH_SHORT = 'node_modules/rmc-pull-to-refresh';
const DEFAULT_PULL_TO_REFREAHING_PATH_LONG = (version) => (`node_modules/_antd-mobile@${version}@antd-mobile/node_modules/rmc-pull-to-refresh`);
exports.patchPullRereshing = async ()=> {
  try {
    let DEFAULT_PULL_TO_REFREAHING_PATH = '';
    const rootDir = join(__dirname, '../../');
    const rootPkgJson = await readJson(join(rootDir, 'package.json'), 'utf-8');
    if (rootPkgJson.dependencies && rootPkgJson.dependencies['antd-mobile'].startsWith(ANTD_MOBL_VERSION_PREFIX)) {
      DEFAULT_PULL_TO_REFREAHING_PATH = DEFAULT_PULL_TO_REFREAHING_PATH_SHORT;
    } else {
      const antdMbolPkgJson = await readJson(join(rootDir, DEFAULT_ANTD_MBOL_PATH, 'package.json'), 'utf-8');
      DEFAULT_PULL_TO_REFREAHING_PATH = DEFAULT_PULL_TO_REFREAHING_PATH_LONG(antdMbolPkgJson.version);
    }
    await copyFilePromisify(join(__dirname, ES_FILE_PATH), join(rootDir, DEFAULT_PULL_TO_REFREAHING_PATH, ES_FILE_PATH));
    await copyFilePromisify(join(__dirname, LIB_FILE_PATH), join(rootDir, DEFAULT_PULL_TO_REFREAHING_PATH, LIB_FILE_PATH));
    console.log(`${MODULE_NAME} at ${DEFAULT_PULL_TO_REFREAHING_PATH}.`)
    console.log(`${MODULE_NAME} successfully.`)
    // const pullToRefresingJson = await readJson(join(rootDir, DEFAULT_PULL_TO_REFREAHING_PATH, 'package.json'), 'utf-8');
    // const ptrVersion_1_0_13 = pullToRefresingJson.version === PATCH_VERSION;
    // if (ptrVersion_1_0_13) {
    // } else {
    //   console.log(`${MODULE_NAME} Error: Fixing Versiong is not ${PATCH_VERSION}`);
    // }
  } catch (error) {
    console.log(`${MODULE_NAME} Error: ${error} \n`);
    process.exit(1);
  }
};

