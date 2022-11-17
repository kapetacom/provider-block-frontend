import { BlockConfig } from "@blockware/ui-web-types";
import FrontendBlockEditorComponent from './FrontendBlockEditorComponent';
import FrontendBlockValidation from './FrontendBlockValidation';
const blockDefinition = require('../../blockware.yml');

const blockType:BlockConfig = {
    kind: blockDefinition.metadata.name,
    name: blockDefinition.metadata.title,
    validate: FrontendBlockValidation,
    componentType: FrontendBlockEditorComponent
};

export default blockType;