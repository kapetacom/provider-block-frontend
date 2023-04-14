import { IBlockTypeProvider } from "@kapeta/ui-web-types";
import {FrontendBlockEditorComponent} from './FrontendBlockEditorComponent';
import FrontendBlockValidation from './FrontendBlockValidation';
const blockDefinition = require('../../kapeta.yml');
const packageJson = require('../../package.json');

const blockTypeProvider:IBlockTypeProvider = {
    kind: blockDefinition.metadata.name,
    version: packageJson.version,
    title: blockDefinition.metadata.title || blockDefinition.metadata.name,
    validate: FrontendBlockValidation,
    componentType: FrontendBlockEditorComponent,
    definition: blockDefinition
};

export default blockTypeProvider;
