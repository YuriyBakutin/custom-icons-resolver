interface ImportInfo {
  name?: string;
  importName?: string;
  path: string;
}
declare type SideEffectsInfo = (ImportInfo | string)[] | ImportInfo | string | undefined;
interface ComponentInfo extends ImportInfo {
  sideEffects?: SideEffectsInfo;
}
declare type ComponentResolveResult = string | ComponentInfo;
declare type ComponentResolver = (name: string) => ComponentResolveResult | null | undefined | void;

export function customIconsResolver(options?: {
  prefix?: string,
  iconsFolderPath?: string,
}): ComponentResolver
