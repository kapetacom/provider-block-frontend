import React, {useMemo, useState} from 'react';
import {
    SchemaKind,
    ILanguageTargetProvider
} from '@kapeta/ui-web-types';
import {BlockDefinition, BlockServiceSpec, Metadata} from '@kapeta/schemas';
import {BlockTargetProvider} from '@kapeta/ui-web-context';
import {FrontendBlockEditorComponent} from '../src/web/FrontendBlockEditorComponent';

import '@kapeta/ui-web-components/styles/index.less';
import {FormContainer} from '@kapeta/ui-web-components';
import {EntityType} from "@kapeta/schemas/dist/cjs";


const BLOCK_KIND = 'kapeta/block-type-frontend';

const targetConfig: ILanguageTargetProvider = {
    kind: 'kapeta/my-language-target',
    version: '1.0.0',
    title: 'My Language Target',
    blockKinds: [
        BLOCK_KIND
    ],
    definition: {
        metadata: {
            name: 'kapeta/test'
        }
    }
};

const blockData: SchemaKind<BlockServiceSpec, Metadata> = {
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
                type: 'kapeta-dsl',
                value: ''
            },
            types: [
                {
                    type: EntityType.Dto,
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

    const initial = useMemo(() => {
        return {
            kind: BLOCK_KIND,
            metadata: {name: ''},
            spec: {target: {kind: ''}}
        };
    }, [])

    const [definition, setDefinition] = useState(initial);

    return (
        <FormContainer initialValue={initial}
                       onChange={(data) => {
                           console.log('data changed', data);
                           setDefinition(data as BlockDefinition);
                       }}>
            <FrontendBlockEditorComponent creating={true}/>
        </FormContainer>
    )
};

export const EditEditor = () => {

    const [definition, setDefinition] = useState(blockData);

    return (
        <FormContainer initialValue={blockData}
                       onChange={(data) => {
                           console.log('data changed', data);
                           setDefinition(data as BlockDefinition);
                       }}>
            <FrontendBlockEditorComponent creating={false}/>
        </FormContainer>
    )
};
