import chalk from 'chalk';
import { readFileSync, existsSync } from 'node:fs';
import ts from 'typescript';
import { Project, ScriptTarget, ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';

const project = new Project();

// const project = new Project({
//   compilerOptions: {
//     // rootDir: '.',
//     target: ScriptTarget.ES2015,
//   },
// });

// const project = new Project({
//   resolutionHost: (moduleResolutionHost, getCompilerOptions) => {
//     return {
//       resolveModuleNames: (moduleNames, containingFile) => {
//         console.log(moduleNames);
//         const compilerOptions = getCompilerOptions();
//         const resolvedModules: ts.ResolvedModule[] = [];

//         for (const moduleName of moduleNames.map(removeTsExtension)) {
//           const result = ts.resolveModuleName(moduleName, containingFile, compilerOptions, moduleResolutionHost);
//           if (result.resolvedModule) resolvedModules.push(result.resolvedModule);
//         }

//         return resolvedModules;
//       },
//     };

//     function removeTsExtension(moduleName: string) {
//       if (moduleName.slice(-3).toLowerCase() === '.ts') return moduleName.slice(0, -3);
//       return moduleName;
//     }
//   },
// });

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
  // const x = sourceFile1?.getVariableDeclaration('config');
  // console.log('x', sourceFile1?.getText());
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
    // const m = (outputFileEntry as PropertyAssignment).getInitializerIfKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);
    // console.log('m', (outputFileEntry as PropertyAssignment).getName());
    return (outputFileEntry as PropertyAssignment).getName().slice(1, -1);
  });
  // console.log(
  //   'x',
  //   // outputFiles?.print(),
  //   // outputFiles?.getKindName(),
  //   outputFileNames
  //   // y.getProperties().map(p => p.print())
  // );
  return outputFileNames;

  // const sourceFile = ts.createSourceFile(
  //   configPath,
  //   readFileSync(configPath, 'utf8').toString(),
  //   ts.ScriptTarget.ES2015,
  //   /* setParentNodes */ true
  // );

  // // TODO instead of finding by fixed indexes, traverse and look for config.outputFiles
  // const configNode = sourceFile.getChildAt(0).getChildAt(0).getChildAt(0).getChildAt(1).getChildAt(0);
  // const outputFilesNode = configNode.getChildAt(2).getChildAt(1).getChildAt(6);
  // const outputFilesValueNode = outputFilesNode.getChildAt(2).getChildAt(1);
  // // const x = outputFilesNode.getChildCount();
  // // console.log('x:', x);

  // return outputFilesValueNode
  //   .getChildren()
  //   .map(node => {
  //     if (ts.isVariableStatement(node)) {
  //       // console.log('x', x.getChildAt(0).getChildAt(0).getText());
  //     }
  //     // console.log(x.getChildren().map(n => n.getChildAt(0)?.getText()));
  //     // return node.getChildAt(2)?.getChildren()?.map(n => n.getChildAt(2)?.getChildAt(2)?.getText());
  //     return node.getChildAt(0)?.getText();
  //   })
  //   .filter(isDefined)
  //   .map(name => name.slice(1, -1));
};

// TODO downpass log instead of using console.log
export const checkDuplicateRtkqNames = async () => {
  // project.addSourceFileAtPath('./openapi-config.ts');
  // console.log(project.getRootDirectories(), project.getDirectories(), project.getFileSystem());

  const generatedFiles = getOutputFiles();

  const hooknamesByFileName = generatedFiles.map(getHookNamesForFileName);

  const hooknamesAndDuplicates = hooknamesByFileName.reduce<HooknamesAndDuplicates>(reduceDuplicates, {
    all: [],
    duplicate: [],
    ignoredDuplicate: [],
    origins: {},
  });

  if (hooknamesAndDuplicates.ignoredDuplicate.length > 0) {
    console.error(
      `${chalk.yellow(`WARNING: ${hooknamesAndDuplicates.ignoredDuplicate.length} ignored duplicate endpoint name(s) found!`)}
${hooknamesAndDuplicates.ignoredDuplicate.join('\n')}`
    );
  }

  if (hooknamesAndDuplicates.duplicate.length > 0) {
    console.error(
      `${chalk.red(`ERROR: ${hooknamesAndDuplicates.duplicate.length} duplicate endpoint name(s) found!`)}
${hooknamesAndDuplicates.duplicate.join('\n')}`
    );
    process.exit(1);
  }
};
