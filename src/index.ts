#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import { App } from './App';
import { Util } from './util/Util';

program
    .requiredOption('-f, --file <file>', 'The QnA answer file to be parsed')
    .option('-l, --pageLength <length>', 'The length after which a page should stop', '400')
    .option('-a, --pageHeaders', 'Specifies, that every page should contain the question as page header', false)
    .option('-p, --page <page>', 'Show specific page', '1')
    .option('-c, --copy', 'Copy page to clipboard automatically', false)
    .option('-m, --markdown', 'Interpret basic markdown tags', false);

program.parse(process.argv);

Util.errorIf(!fs.existsSync(program.file), 'Input file is missing or not readable.');
Util.errorIf(isNaN(program.pageLength), 'Page length must be numeric.');
Util.errorIf(isNaN(program.page), 'Page must be numeric.');

const fileName: string = program.file;
const pageLength: number = Number(program.pageLength);
const pageHeaders: boolean = program.pageHeaders;
const page: number = Number(program.page) - 1;
const copyAll: boolean = program.copy;
const markdown: boolean = program.markdown;

new App(fileName, pageLength, pageHeaders, page, copyAll, markdown).run();
