// Reexport the native module. On web, it will be resolved to ContentTransitionTextModule.web.ts
// and on native platforms to ContentTransitionTextModule.ts
export { default } from './ContentTransitionTextModule';
export * from './ContentTransitionText.types';
