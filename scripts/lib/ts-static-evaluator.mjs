import fs from "node:fs";
import ts from "typescript";

export const parseTypeScriptSourceFile = (filePath) => {
  const sourceText = fs.readFileSync(filePath, "utf8");

  return ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
};

export const findConstInitializer = (sourceFile, constName) => {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== constName) {
        continue;
      }

      if (!declaration.initializer) {
        throw new Error(`Constant "${constName}" is missing an initializer.`);
      }

      return declaration.initializer;
    }
  }

  throw new Error(`Could not find constant "${constName}".`);
};

const getPropertyName = (name, sourceFile) => {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  throw new Error(
    `Unsupported property name "${name.getText(sourceFile)}" in ${sourceFile.fileName}.`
  );
};

const getCallExpressionName = (expression, sourceFile) => {
  if (ts.isIdentifier(expression)) {
    return expression.text;
  }

  throw new Error(
    `Unsupported call expression "${expression.getText(sourceFile)}" in ${sourceFile.fileName}.`
  );
};

export const evaluateStaticExpression = (
  node,
  { sourceFile, callHandlers = {} } = {}
) => {
  const evaluate = (child) => evaluateStaticExpression(child, { sourceFile, callHandlers });

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element) => evaluate(element));
  }

  if (ts.isObjectLiteralExpression(node)) {
    return node.properties.reduce((result, property) => {
      if (ts.isPropertyAssignment(property)) {
        const propertyName = getPropertyName(property.name, sourceFile);
        result[propertyName] = evaluate(property.initializer);
        return result;
      }

      throw new Error(
        `Unsupported object property "${property.getText(sourceFile)}" in ${sourceFile.fileName}.`
      );
    }, {});
  }

  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) {
    return evaluate(node.expression);
  }

  if (ts.isPrefixUnaryExpression(node)) {
    const operand = evaluate(node.operand);

    if (node.operator === ts.SyntaxKind.MinusToken) {
      return -Number(operand);
    }

    if (node.operator === ts.SyntaxKind.PlusToken) {
      return Number(operand);
    }
  }

  if (ts.isTemplateExpression(node)) {
    return node.head.text + node.templateSpans.map((span) => {
      return `${evaluate(span.expression)}${span.literal.text}`;
    }).join("");
  }

  if (ts.isCallExpression(node)) {
    const callName = getCallExpressionName(node.expression, sourceFile);
    const callHandler = callHandlers[callName];

    if (!callHandler) {
      throw new Error(
        `Unsupported call "${callName}" in ${sourceFile.fileName}.`
      );
    }

    return callHandler({
      node,
      evaluate,
      sourceFile
    });
  }

  throw new Error(
    `Unsupported syntax "${node.getText(sourceFile)}" in ${sourceFile.fileName}.`
  );
};
