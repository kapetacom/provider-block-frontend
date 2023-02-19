import React, {useState} from 'react';
import {
    BlockKind,
    BlockMetadata,
    BlockServiceSpec,
    SchemaEntityType,
    SchemaKind,
    TargetConfig
} from '@blockware/ui-web-types';
import {BlockTargetProvider} from '@blockware/ui-web-context';
import {FrontendBlockEditorComponent} from '../src/web/FrontendBlockEditorComponent';

import '@blockware/ui-web-components/styles/index.less';
import {FormContainer} from '@blockware/ui-web-components';

const BLOCK_KIND = 'blockware/block-type-frontend';

const targetConfig: TargetConfig = {
    kind: 'blockware/my-language-target',
    version: '1.0.0',
    title: 'My Language Target',
    blockKinds: [
        BLOCK_KIND
    ]
};

const blockData: SchemaKind<BlockServiceSpec, BlockMetadata> = {
    kind: BLOCK_KIND,
    metadata: {
        name: 'My block'
    },
    spec: {
        target: {
            kind: targetConfig.kind + ':1.0.0'
        },
        entities: {
            source: {
                type: 'blockware-dsl',
                value: ''
            },
            types: [
                {
                    type: SchemaEntityType.DTO,
                    name: 'MyEntity',
                    properties: {
                        'id': {
                            type: 'string'
                        },
                        'tags': {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        'children': {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    childId: {
                                        type: 'integer'
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        }
    }
};

BlockTargetProvider.register(targetConfig);

export default {
    title: 'Frontend Block'
};

export const CreateEditor = () => {

    const [definition, setDefinition] = useState({
        kind: BLOCK_KIND,
        metadata: {name: ''},
        spec: {target: {kind: ''}}
    });

    return (
        <FormContainer initialValue={definition}
                       onChange={(data) => {
                           console.log('data changed', data);
                           setDefinition(data as BlockKind);
                       }}>
            <FrontendBlockEditorComponent creating={true}/>
        </FormContainer>
    )
};

export const EditEditor = () => {

    const [definition, setDefinition] = useState(blockData);

    return (
        <FormContainer initialValue={definition}
                       onChange={(data) => {
                           console.log('data changed', data);
                           setDefinition(data as BlockKind);
                       }}>
            <FrontendBlockEditorComponent creating={false}/>
        </FormContainer>
    )
};
