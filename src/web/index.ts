import { BlockConfig } from "@blockware/ui-web-types";
import ServiceBlockEditorComponent from './FrontendBlockEditorComponent';
import ServiceBlockValidation from './FrontendBlockValidation';
const blockDefinition = require('../../blockware.yml');

const blockType:BlockConfig = {
    kind: blockDefinition.metadata.id,
    name: blockDefinition.metadata.name,
    validate: ServiceBlockValidation,
    componentType: ServiceBlockEditorComponent
};

export default blockType;