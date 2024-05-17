import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// import config from './openapi-config.js';

type HooknamesAndDuplicates = {
  all: string[];
  duplicate: string[];
  ignoredDuplicate: string[];
  origins: Record<string, string>;
};

const isDefined = <T>(item: T | undefined): item is T => typeof item !== 'undefined';

const isApiExportNode = (n: ts.Node): n is ts.VariableStatement =>
  n.kind === ts.SyntaxKind.VariableStatement && n.getText().includes(' injectedRtkApi;');

const getDestructuredHookNamesNode = (n: ts.Node): ts.SyntaxList => {
  const deepNode = n.getChildAt(1).getChildAt(1).getChildAt(0).getChildAt(0).getChildAt(1);
  if (deepNode.kind !== ts.SyntaxKind.SyntaxList) {
    throw new Error(`Unexpected kind for destructuredHookNamesNode`);
  }

  return deepNode as ts.SyntaxList;
};

const getHookNamesForSourceFile = (label: string, sourceFile: ts.SourceFile): [string, string[]] => {
  const apiExportNode = sourceFile.getChildAt(0).getChildren().find(isApiExportNode);

  if (!apiExportNode) {
    const msg = `Can't find apiExportNode in ${label}`;
    throw new Error(msg);
  }

  const destructuredHookNamesNode = getDestructuredHookNamesNode(apiExportNode);

  const hookNames = destructuredHookNamesNode
    .getChildren()
    .filter(item => item.kind === ts.SyntaxKind.BindingElement)
    .map(item => item.getText());
  return [label, hookNames];
};

const getHookNamesForFileName = (fileName: string): [string, string[]] => {
  const sourceFile = ts.createSourceFile(fileName, readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, /* setParentNodes */ true);
  return getHookNamesForSourceFile(fileName, sourceFile);
};

const getIgnoreList = () => {
  // TODO make .drepignore optional
  // const ignoreListContent = readFileSync(`${__dirname}/check-duplicate-rtkq-names-ignore`, 'utf8');
  const ignoreListContent = readFileSync(`./.drepignore`, 'utf8');
  return ignoreListContent.split('\n');
};

const ignoreList = getIgnoreList();

const reduceDuplicates = (acc: HooknamesAndDuplicates, next: [string, string[]]): HooknamesAndDuplicates => {
  const [fileName, nextEndpointNames] = next;

  const alreadyInAll = nextEndpointNames
    .filter(endpointName => acc.all.includes(endpointName))
    .filter(endpointName => !ignoreList.includes(endpointName))
    .map(endpointName => `- ${endpointName} in: \n    ${acc.origins[endpointName]} \n    ${fileName}`);

  const ignoredDuplicate = nextEndpointNames
    .filter(endpointName => acc.all.includes(endpointName))
    .filter(endpointName => ignoreList.includes(endpointName))
    .map(endpointName => `- ${chalk.bold.yellow('IGNORED')} ${endpointName} in: \n    ${acc.origins[endpointName]} \n    ${fileName}`);

  return {
    ...acc,
    all: acc.all.concat(nextEndpointNames),
    duplicate: acc.duplicate.concat(alreadyInAll),
    ignoredDuplicate: acc.ignoredDuplicate.concat(ignoredDuplicate),
    origins: {
      ...acc.origins,
      ...Object.fromEntries(nextEndpointNames.map(name => [name, fileName])),
    },
  };
};

const getOutputFiles = () => {
  const configPath = './openapi-config.ts';
  const sourceFile = ts.createSourceFile(
    configPath,
    readFileSync(configPath, 'utf8').toString(),
    ts.ScriptTarget.ES2015,
    /* setParentNodes */ true
  );

  // TODO instead of finding by fixed indexes, traverse and look for config.outputFiles
  const configNode = sourceFile.getChildAt(0).getChildAt(0).getChildAt(0).getChildAt(1).getChildAt(0);
  const outputFilesNode = configNode.getChildAt(2).getChildAt(1).getChildAt(6);
  const outputFilesValueNode = outputFilesNode.getChildAt(2).getChildAt(1);
  // const x = outputFilesNode.getChildCount();
  // console.log('x:', x);

  return outputFilesValueNode
    .getChildren()
    .map(node => {
      if (ts.isVariableStatement(node)) {
        // console.log('x', x.getChildAt(0).getChildAt(0).getText());
      }
      // console.log(x.getChildren().map(n => n.getChildAt(0)?.getText()));
      return node.getChildAt(0)?.getText();
    })
    .filter(isDefined)
    .map(name => name.slice(1, -1));
};

// TODO downpass log instead of using console.log
export const checkDuplicateRtkqNames = async () => {
  // const config = (await import(`../../openapi-config.ts${''}`));
  // const outputFiles = config.default.outputFiles;

  // const ignoreListContent = readFileSync(`./.drepignore`, 'utf8');

  // const program = ts.createProgram([sourceFile.fileName], {});
  // const x = program.emit();
  // x.
  // console.log(program.emit());

  const outputFiles = getOutputFiles();
  console.log(outputFiles);

  const generatedFiles = Object.entries(outputFiles).map(([outputFileName]) => outputFileName);
  console.log(generatedFiles);

  // const hooknamesByFileName = generatedFiles.map(getHookNamesForFileName);

  // const hooknamesAndDuplicates = hooknamesByFileName.reduce<HooknamesAndDuplicates>(reduceDuplicates, {
  //   all: [],
  //   duplicate: [],
  //   ignoredDuplicate: [],
  //   origins: {},
  // });

  // if (hooknamesAndDuplicates.ignoredDuplicate.length > 0) {
  //   console.error(
  //     `${chalk.yellow(`WARNING: ${hooknamesAndDuplicates.duplicate.length} ignored duplicate endpoint name(s) found!`)}
  //   ${hooknamesAndDuplicates.ignoredDuplicate.join('\n')}`
  //   );
  // }

  // if (hooknamesAndDuplicates.duplicate.length > 0) {
  //   console.error(
  //     `${chalk.red(`ERROR: ${hooknamesAndDuplicates.duplicate.length} duplicate endpoint name(s) found!`)}
  // ${hooknamesAndDuplicates.duplicate.join('\n')}`
  //   );
  //   process.exit(1);
  // }
};
