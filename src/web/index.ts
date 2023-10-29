/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { IBlockTypeProvider } from "@kapeta/ui-web-types";
import { FrontendBlockEditorComponent } from "./FrontendBlockEditorComponent";
import FrontendBlockValidation from "./FrontendBlockValidation";
import { FrontendBlockShapeComponent } from "./FrontendBlockShapeComponent";
const blockDefinition = require("../../kapeta.yml");
const packageJson = require("../../package.json");

const blockTypeProvider: IBlockTypeProvider = {
  kind: blockDefinition.metadata.name,
  version: packageJson.version,
  title: blockDefinition.metadata.title || blockDefinition.metadata.name,
  validate: FrontendBlockValidation,
  editorComponent: FrontendBlockEditorComponent,
  definition: blockDefinition,
  shapeWidth: 150,
  getShapeHeight: (resourceHeight: number) =>
    Math.max(140, resourceHeight + 50),
  shapeComponent: FrontendBlockShapeComponent,
};

export default blockTypeProvider;
