import React, {ComponentType, useMemo} from "react";

import type {ILanguageTargetProvider} from "@kapeta/ui-web-types";
import { parseKapetaUri } from '@kapeta/nodejs-utils';

import {
    DataTypeEditor,
    ConfigurationEditor,
    DSL_LANGUAGE_ID,
    DSLConverters,
    DSLEntity,
    TabContainer,
    TabPage,
    useFormContextField,
    FormAvatarEditorField,
    AssetVersionSelector,
    AssetVersionSelectorEntry,
} from "@kapeta/ui-web-components";

import {BlockTargetProvider} from "@kapeta/ui-web-context";

import './FrontendBlockEditorComponent.less';

interface Props {
    creating?:boolean
}

export const FrontendBlockEditorComponent = (props:Props) => {

    const kindField = useFormContextField('kind');
    const targetKindField = useFormContextField('spec.target.kind');
    const entitiesField = useFormContextField('spec.entities');
    const configurationField = useFormContextField('spec.configuration');

    const targetKind = targetKindField.get();
    const kind = kindField.get();

    const assetTypes:AssetVersionSelectorEntry[] = useMemo(() => {
        const mapper = (targetConfig:ILanguageTargetProvider):AssetVersionSelectorEntry => {
            const ref = `${targetConfig.kind}:${targetConfig.version}`;
            const title = targetConfig.title ?
                `${targetConfig.title} [${targetConfig.kind.toLowerCase()}:${targetConfig.version}]` :
                `${targetConfig.kind}:${targetConfig.version}`;

            return {
                ref: ref,
                kind: targetConfig.definition?.kind ?? targetConfig.kind,
                title,
                icon: targetConfig.icon ?? targetConfig.definition?.spec?.icon
            }
        };

        const targetUri = targetKind ? parseKapetaUri(targetKind) : null;
        const out = BlockTargetProvider.listAll(kind).map(mapper);
        if (targetUri &&
            !out.some(e => parseKapetaUri(e.ref).equals(targetUri))) {
            //Always add the current target if not already added.
            //This usually happens if block uses an older version
            try {
                const currentTarget = BlockTargetProvider.get(targetKind, kind);
                if (currentTarget) {
                    out.push(mapper(currentTarget))
                }
            } catch (e) {
                console.warn('Failed to select target', e);
            }
        }
        return out;
    }, [kind, targetKind]);

    const TargetConfigComponent: ComponentType | null = useMemo(() => {
        if (targetKind) {
            try {
                const currentTarget = BlockTargetProvider.get(targetKind, kind);

                if (currentTarget && currentTarget.editorComponent) {
                    return currentTarget.editorComponent;
                }
            } catch (e) {
                console.warn('Failed to select target', e);
            }
        }
        return null;
    }, [targetKind]);

    const renderTargetConfig = () => {
        if (!TargetConfigComponent) {
            return <div></div>;
        }

        return (
            <div className="form-section">
                <h3>Target configuration</h3>
                <TargetConfigComponent />
            </div>
        );
    }

    const renderConfiguration = () => {

        const configuration = configurationField.get();
        const result = {
            code: configuration?.source?.value || '',
            entities: configuration?.types?.map ? configuration?.types?.map(DSLConverters.fromSchemaEntity) : []
        };

        return (
            <div className={'configuration-editor'}>
                <p className='info'>Define configuration data types for this block</p>
                <ConfigurationEditor value={result} onChange={(result) => {
                    result.entities && setConfiguration(result.code, result.entities);
                }} />
            </div>
        )
    }

    const setConfiguration = (code:string, results: DSLEntity[]) =>  {
        const types = results.map(DSLConverters.toSchemaEntity);
        console.log('updates', results, types);
        const configuration = {
            types,
            source: {
                type: DSL_LANGUAGE_ID,
                value: code
            }
        };
        configurationField.set(configuration);
    }

    const renderEntities = () => {

        const entities = entitiesField.get();

        const result = {
            code: entities?.source?.value || '',
            entities: entities?.types?.map ? entities?.types?.map(DSLConverters.fromSchemaEntity) : []
        };

        return (
            <div className={'entity-editor'}>
                <p className='info'>Entities define external data types to be used by the resources for this block</p>
                <DataTypeEditor value={result} onChange={(result) => {
                    result.entities && setEntities(result.code, result.entities);
                }} />
            </div>
        )
    }

    const setEntities = (code:string, results: DSLEntity[]) =>  {
        const types = results.map(DSLConverters.toSchemaEntity);
        const entities = {
            types,
            source: {
                type: DSL_LANGUAGE_ID,
                value: code
            }
        };
        entitiesField.set(entities);
    }

    return (
        <div className={'frontend-block-config'}>
            <TabContainer defaultTab={'general'}>
                <TabPage id={'general'} title={'General'}>
                    <p className='info'>Frontend block that describes a web-based UI such as React or Angular apps</p>
                    <FormAvatarEditorField
                        name={'spec.icon'}
                        label={'Icon'}
                        maxFileSize={1024 * 50}
                        help={'Select an icon for this block to make it easier to identify. Max 50 kb - and we recommend using a square SVG image.'}
                        fallbackIcon={'kap-icon-block'}
                    />

                    <AssetVersionSelector
                        name={"spec.target.kind"}
                        label={"Target"}
                        validation={['required']}
                        help={"This tells the code generation process which target programming language to use."}
                        assetTypes={assetTypes}
                    />

                    {renderTargetConfig()}
                </TabPage>

                {!props.creating &&
                    <>
                        <TabPage id={'entities'} title={'Entities'}>
                            {renderEntities()}
                        </TabPage>
                        <TabPage id={'configuration'} title={'Configuration'}>
                            {renderConfiguration()}
                        </TabPage>
                    </>
                }

            </TabContainer>

        </div>
    )
};
