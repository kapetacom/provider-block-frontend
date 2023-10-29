/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, {useMemo, useState} from 'react';
import {
    ILanguageTargetProvider
} from '@kapeta/ui-web-types';
import {BlockDefinition} from '@kapeta/schemas';
import {BlockTargetProvider} from '@kapeta/ui-web-context';
import {FrontendBlockEditorComponent} from '../src/web/FrontendBlockEditorComponent';

import '@kapeta/ui-web-components/styles/index.less';
import {FormContainer} from '@kapeta/ui-web-components';
import {EntityType} from "@kapeta/schemas";


const BLOCK_KIND = 'kapeta/block-type-frontend';

const targetConfig: ILanguageTargetProvider = {
    kind: 'kapeta/my-language-target',
    title: 'My Language Target',
    version: '1.2.3',
    blockKinds: [
        BLOCK_KIND
    ],
    definition: {
        kind: 'kapeta/language-target',
        metadata: {
            name: 'kapeta/my-language-target',
        }
    }
};


const targetConfig2: ILanguageTargetProvider = {
    kind: 'kapeta/my-other-target',
    title: 'My Other Target',
    version: '1.2.3',
    blockKinds: [
        BLOCK_KIND
    ],
    definition: {
        kind: 'kapeta/language-target',
        metadata: {
            name: 'kapeta/my-other-target',
            title: 'Other target'
        }
    }
};

const blockData: BlockDefinition = {
    kind: BLOCK_KIND,
    metadata: {
        name: 'My block'
    },
    spec: {
        target: {
            kind: targetConfig.kind + ':1.0.0',
        },
        configuration: {
            source: {
                type: 'kapeta-dsl',
                value: ''
            },
            types: [
                {
                    name: 'CoreConfig',
                    type: EntityType.Dto,
                    properties: {
                        apiKey: {
                            type: 'string',
                            secret: true
                        },
                        name: {
                            type: 'string',
                            required: true,
                            defaultValue: '"My Block"'
                        },
                        enabled: {
                            type: 'boolean',
                            defaultValue: 'true'
                        },
                    }
                }
            ]
        },
        entities: {
            source: {
                type: 'kapeta-dsl',
                value: ''
            },
            types: [
                {
                    name: 'MyEntity',
                    type: EntityType.Dto,
                    properties: {
                        id: {
                            type: 'string'
                        },
                        'tags': {
                            type: 'string[]'
                        },
                        'children': {
                            ref: 'MyEntity[]'
                        }
                    }
                }
            ]
        },
    }
};

BlockTargetProvider.register(targetConfig);
BlockTargetProvider.register(targetConfig2);

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
