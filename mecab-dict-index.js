#!/usr/bin/env node
const binary = require("@tignear/node-pre-gyp");
const path = require('path');
const meta = binary.meta(path.resolve(path.join(__dirname, './package.json')));
const path_to_mecab_dict_index = path.resolve(path.join(meta.module_path, 'mecab-dict-index'));

const spawn = require("child_process").spawn;
const mecab = spawn(path_to_mecab_dict_index, process.argv.slice(2));
process.stdin.pipe(mecab.stdin);
mecab.stdout.pipe(process.stdout);
mecab.stderr.pipe(process.stderr);