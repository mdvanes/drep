const config = {
  schemaFile: '', // mandatory field, but each outputFile has a specific schemaFile in our case
  apiFile: '', // mandatory field, but each outputFile has a specific apiFile in our case
  apiImport: 'emptySplitApi',
  outputFiles: {
    './apps/demo/demoApi.ts': {
      apiFile: './apps/demo/demoApi.ts',
      schemaFile: './definitions/demo.json',
      exportName: 'demoApi',
    },
    './apps/demo/demoApi1.ts': {
      apiFile: './apps/demo/demoApi1.ts',
      schemaFile: './definitions/demo1.json',
      exportName: 'demo1Api',
    },
  },
  hooks: true,
};

export default config;
