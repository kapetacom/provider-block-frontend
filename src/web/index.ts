import { BlockConfig } from "@blockware/ui-web-types";
import FrontendBlockEditorComponent from './FrontendBlockEditorComponent';
import FrontendBlockValidation from './FrontendBlockValidation';
const blockDefinition = require('../../blockware.yml');

const blockType:BlockConfig = {
    kind: blockDefinition.metadata.id,
    name: blockDefinition.metadata.name,
    validate: FrontendBlockValidation,
    componentType: FrontendBlockEditorComponent
};

export default blockType;