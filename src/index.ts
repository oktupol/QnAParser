#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import { App } from './App';
import { Util } from './util/Util';
import { SortFunctions, SortFunction } from './util/SortFunctions';

program
    .name('qnaparser')
    .description('Parse a qna file with this program')
    .version('1.0.0')
    .requiredOption('-f, --file <file>', 'The QnA answer file to be parsed')
    .option('-l, --page-length <length>', 'The length after which a page should stop', '400')
    .option('-a, --page-headers', 'Specifies, that every page should contain the question as page header', false)
    .option('-p, --page <page>', 'Show specific page', '1')
    .option('-c, --copy', 'Copy page to clipboard automatically', false)
    .option('-m, --markdown', 'Interpret basic markdown tags', false)
    .option(
        '-s, --sort-function <function>',
        'Specify the sort function to be used for answers. Options are ' +
            SortFunctions.sortFunctionNames.map(f => `"${f}"`).join(', '),
        'length'
    );

program.parse(process.argv);

Util.errorIf(!fs.existsSync(program.file), 'Input file is missing or not readable.');
Util.errorIf(isNaN(program.pageLength), 'Page length must be numeric.');
Util.errorIf(isNaN(program.page), 'Page must be numeric.');
Util.errorIf(
    !SortFunctions.sortFunctionNames.includes(program.sortFunction),
    'Sort function must be one of ' + SortFunctions.sortFunctionNames.map(f => `"${f}"`).join(', ')
);

const fileName: string = program.file;
const pageLength: number = Number(program.pageLength);
const pageHeaders: boolean = program.pageHeaders;
const page: number = Number(program.page) - 1;
const copyAll: boolean = program.copy;
const markdown: boolean = program.markdown;
const sortFunction: SortFunction = SortFunctions.getSortFunction(program.sortFunction);

new App(fileName, pageLength, pageHeaders, page, copyAll, markdown, sortFunction).run();
