import { Node, Project, StatementStructures } from "ts-morph";
import {
  DirectExportableSymbol,
  EXPORTS_FILE_FRONTMATTER,
  ExportableSymbol,
  ExportsFileDefinition,
  ParsedExportSource,
  ReferenceLocator,
} from "./common";
import path from "path";
import { merge } from "./merge";
import { mergeExportableSymbol } from "./mergeSyntax";

export async function emitExportsFile(
  project: Project,
  esm: boolean,
  definition: ExportsFileDefinition
): Promise<void> {
  const output = project.createSourceFile(definition.outputPath, undefined, { overwrite: true });
  console.log("Emitting", output.getFilePath());

  const sources: ParsedExportSource[] = definition.sources.map((source) => ({
    ...source,
    source: project.getSourceFileOrThrow(source.path),
  }));

  const symbolNameToExport = new Map<string, ExportableSymbol>();

  // 1. Go through all the source files and gather exports
  for (const source of sources) {
    console.log("  Processing", source.path);
    for (const [symbolName, declarations] of source.source.getExportedDeclarations()) {
      if (source.omit && source.omit.includes(symbolName)) {
        console.log(`Omitting exported symbol ${symbolName} from ${source.path}`);
        continue;
      }

      if (declarations.length !== 1) {
        console.warn(
          "    Multiple declarations named " +
            symbolName +
            ". Using the first one. This may cause unexpected issues."
        );
      }

      const declaration = declarations[0];

      const structure = (declaration as any).getStructure() as StatementStructures;

      const references: ReferenceLocator[] = Node.isReferenceFindable(declaration)
        ? declaration
            .findReferencesAsNodes()
            .map((ref) => ref.getFirstAncestor(Node.isExportable))
            .filter((x) => x)
            .filter(Node.isNamed)
            .map((node) => ({
              sourceFilePath: path.relative(process.cwd(), node.getSourceFile().getFilePath()),
              symbolName: node.getName(),
            }))
        : [];

      const exportableSymbol: ExportableSymbol = {
        kind: "directExport",
        name: symbolName,
        sourcePath: source.path,
        structure,
        references,
      };

      if (symbolNameToExport.has(symbolName)) {
        const combination = merge(
          mergeExportableSymbol,
          symbolNameToExport.get(symbolName)!,
          exportableSymbol
        );
        console.log(
          `    Combining`,
          symbolName,
          `(got ${combination.kind}, ${
            combination.kind === "directExport" ? combination.sourcePath : "emitted"
          })`
        );
        symbolNameToExport.set(symbolName, combination);
      } else {
        symbolNameToExport.set(symbolName, exportableSymbol);
      }
    }
  }

  let directExports = Array.from(symbolNameToExport.values()).filter(
    (x) => x.kind === "directExport"
  ) as DirectExportableSymbol[];
  const emitExports = Array.from(symbolNameToExport.values()).filter(
    (x) => x.kind === "emit"
  ) as ExportableSymbol[];

  // Inspect references for our direct exports. If anything references an emitted type, then the direct export itself should be emitted.
  // This should be done recursively.
  while (true) {
    const directExportsReferencingEmittedExports = directExports.filter((directExport) =>
      emitExports.some((emitExport) =>
        emitExport.references.find((reference) => reference.symbolName === directExport.name)
      )
    );

    if (directExportsReferencingEmittedExports.length === 0) {
      break;
    }

    for (const directExport of directExportsReferencingEmittedExports) {
      // mark as emit
      emitExports.push({ ...directExport, kind: "emit" });
    }

    directExports = directExports.filter(
      (x) => !directExportsReferencingEmittedExports.includes(x)
    );
  }

  // 2. For things which we are now emitting, emit the expected output.
  for (const exp of emitExports) {
    output.addStatements([exp.structure]);
  }

  // 3. For things we can export directly ('directExport', everything at the moment), group by file name and emit a single export statement per file
  const fileToExportSymbols = new Map<string, string[]>();
  for (const exp of directExports) {
    if (exp.kind !== "directExport") continue;

    const list = fileToExportSymbols.get(exp.sourcePath) ?? [];
    fileToExportSymbols.set(exp.sourcePath, [...list, exp.name]);
  }

  for (const [fileName, symbolNames] of fileToExportSymbols) {
    // Path is originally relative to the base dir but we don't want that for the exports file
    const relativePath = path.relative(path.dirname(definition.outputPath), fileName);
    output.addExportDeclaration({
      moduleSpecifier: `./${relativePath.replace(/\.ts$/, esm ? ".js" : "")}`,
      namedExports: symbolNames,
    });
  }

  // Add the disclaimer
  output.insertText(0, EXPORTS_FILE_FRONTMATTER);
  output.fixMissingImports();
}
