import { BlockConfig } from "@blockware/ui-web-types";
import {FrontendBlockEditorComponent} from './FrontendBlockEditorComponent';
import FrontendBlockValidation from './FrontendBlockValidation';
const blockDefinition = require('../../blockware.yml');
const packageJson = require('../../package.json');

const blockType:BlockConfig = {
    kind: blockDefinition.metadata.name,
    version: packageJson.version,
    title: blockDefinition.metadata.title,
    validate: FrontendBlockValidation,
    componentType: FrontendBlockEditorComponent
};

export default blockType;