import { Command } from '@oclif/core';
import chalk from 'chalk';
import { existsSync, readFileSync } from 'node:fs';
import { Project, PropertyAssignment } from 'ts-morph';
import ts from 'typescript';

const project = new Project();

type HooknamesAndDuplicates = {
  all: string[];
  duplicate: string[];
  ignoredDuplicate: string[];
  origins: Record<string, string>;
};

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

const getIgnoreList = (): string[] => {
  const ignoreListPath = './.drepignore';
  const existsIgnoreList = existsSync(ignoreListPath);
  if (!existsIgnoreList) {
    return [];
  }
  const ignoreListContent = readFileSync(ignoreListPath, 'utf8');
  return ignoreListContent.split('\n').filter(line => !line.startsWith('#'));
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
  project.addSourceFileAtPath(configPath);
  const sourceFile1 = project.getSourceFileOrThrow(configPath);

  const configVar = sourceFile1?.getVariableDeclarationOrThrow('config');
  const outputFiles = configVar
    ?.getInitializerIfKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression)
    .getProperties()
    .find(prop => (prop as PropertyAssignment).getName() === 'outputFiles');

  const outputFilesObject = (outputFiles as PropertyAssignment).getInitializerIfKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);
  const outputFileNames = outputFilesObject.getProperties().map(outputFileEntry => {
    return (outputFileEntry as PropertyAssignment).getName().slice(1, -1);
  });

  return outputFileNames;
};

export const checkDuplicateRtkqNames = async ({ log }: { log: Command['log']; logToStderr: Command['logToStderr'] }) => {
  const generatedFiles = getOutputFiles();

  const hooknamesByFileName = generatedFiles.map(getHookNamesForFileName);

  const hooknamesAndDuplicates = hooknamesByFileName.reduce<HooknamesAndDuplicates>(reduceDuplicates, {
    all: [],
    duplicate: [],
    ignoredDuplicate: [],
    origins: {},
  });

  if (hooknamesAndDuplicates.ignoredDuplicate.length > 0) {
    log(
      `${chalk.yellow(`WARNING: ${hooknamesAndDuplicates.ignoredDuplicate.length} ignored duplicate endpoint name(s) found!`)}
${hooknamesAndDuplicates.ignoredDuplicate.join('\n')}`
    );
  }

  if (hooknamesAndDuplicates.duplicate.length > 0) {
    log(
      `${chalk.red(`ERROR: ${hooknamesAndDuplicates.duplicate.length} duplicate endpoint name(s) found!`)}
${hooknamesAndDuplicates.duplicate.join('\n')}`
    );
    process.exit(1);
  }
};
