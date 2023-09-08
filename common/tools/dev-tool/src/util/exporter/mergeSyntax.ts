import {
  ClassDeclarationStructure,
  InterfaceDeclarationStructure,
  StatementStructures,
  Structure,
} from "ts-morph";
import {
  MergeStrategy,
  mergeIntoSet,
  assertSame,
  mergeShape,
  useRightValue,
  useLiteralValue,
  tryMerge,
  widen,
} from "./merge";
import { ExportableSymbol } from "./common";

type Named = { name: string };
function mergeOverName<T extends Named>(): MergeStrategy<T[]> {
  return mergeIntoSet<T>((a, b) => a.name === b.name);
}

function mergeInterface(): MergeStrategy<InterfaceDeclarationStructure> {
  return mergeShape<InterfaceDeclarationStructure>({
    name: assertSame(),
    methods: mergeOverName(),
    properties: mergeOverName(),
  });
}

function mergeClasses(): MergeStrategy<ClassDeclarationStructure> {
  return mergeShape<ClassDeclarationStructure>({
    name: assertSame(),
    methods: mergeOverName(),
    properties: mergeOverName(),

    // there can only be one constructor signature so just use the customized one
    ctors: useRightValue(),
  });
}

function mergeStructures(): MergeStrategy<StatementStructures> {
  return tryMerge<StatementStructures>(
    widen<StatementStructures, InterfaceDeclarationStructure>(
      Structure.isInterface,
      mergeInterface()
    ),
    widen<StatementStructures, ClassDeclarationStructure>(Structure.isClass, mergeClasses())
  );
}

const mergeByEmitting: MergeStrategy<ExportableSymbol> = mergeShape<ExportableSymbol>({
  // Force kind = emit since we are now emitting the output instead of exporting another symbol
  kind: useLiteralValue("emit"),
  structure: mergeStructures(),
  references: mergeIntoSet(
    (a, b) => a.sourceFilePath === b.sourceFilePath && a.symbolName === b.symbolName
  ),
});

export const mergeExportableSymbol = tryMerge<ExportableSymbol>(mergeByEmitting, useRightValue());
