import React, {Component} from "react";
import _ from "lodash";
import {action, makeObservable, observable, toJS} from "mobx";
import {observer} from "mobx-react";

import {
    Type,
    BlockMetadata,
    BlockServiceSpec,
    BlockType,
    TargetConfigProps,
    EntityConfigProps,
    SchemaProperties, SchemaEntryType,
} from "@blockware/ui-web-types";


import {
    TabContainer,
    TabPage,
    SidePanel,
    PanelAlignment,
    PanelSize,
    EntityForm,
    FormButtons,
    FormContainer,
    SingleLineInput,
    DropdownInput,
    Button,
    ButtonType,
    ButtonStyle,
    DSLDataTypeProperty, DSLDataType, DSLEntityType, DataTypeEditor
} from "@blockware/ui-web-components";

import {
    BlockTargetProvider
} from "@blockware/ui-web-context";

import './FrontendBlockEditorComponent.less';


function fromSchemaType(type:any):string {
    if (!type) {
        return 'void'
    }
    return type && type.$ref ? type.$ref : type;
}

function toSchemaType(type:string):SchemaEntryType {
    if (!type) {
        return ''
    }

    if (type[0].toUpperCase() === type[0]) {
        return {$ref: type};
    }

    return type;
}


function fromSchema(properties:SchemaProperties):DSLDataTypeProperty[] {
    return Object.entries(properties).map(([name, value]):DSLDataTypeProperty => {
        // @ts-ignore
        const stringType = fromSchemaType(value.type);

        if (stringType === 'array') {
            return {
                name,
                type: fromSchemaType(value.items?.type),
                list: true,
                properties: value.items?.properties ? fromSchema(value.items?.properties) : undefined
            }
        }

        return {
            name,
            type: stringType,
            list: stringType.endsWith('[]'),
            properties: value.properties ? fromSchema(value.properties) : undefined
        }
    });
}

function toSchema(properties:DSLDataTypeProperty[]):SchemaProperties {
    const out = {};

    properties.forEach(property => {

        const type = toSchemaType(property.type);

        if (property.list) {
            out[property.name] = {
                type: 'array',
                items: {
                    type,
                    properties: property.properties ? toSchema(property.properties) : null
                }
            }
        } else {
            out[property.name] = {
                type,
                properties: property.properties ? toSchema(property.properties) : null
            }
        }

    })

    return out;
}

@observer
export default class FrontendBlockEditorComponent extends Component<EntityConfigProps<BlockMetadata, BlockServiceSpec>, any> {
    
    @observable
    private readonly metadata:BlockMetadata;

    @observable
    private readonly spec:BlockServiceSpec;

    constructor(props:EntityConfigProps){
        super(props);
        makeObservable(this);

        this.metadata = !_.isEmpty(this.props.metadata) ? _.cloneDeep(this.props.metadata) : {
            name: '',
            version: '0.0.1'
        };


        this.spec = !_.isEmpty(this.props.spec) ? _.cloneDeep(this.props.spec) : {
            target: {
                kind: '',
                options: {},
                
            },type:BlockType.SERVICE
        };
    }
    
    private stateChanged() {
        this.props.onDataChanged(toJS(this.metadata), toJS(this.spec));
    }

    @action
    private handleTargetConfigurationChange(config:Object) {
        this.spec.target.options = config;

        this.stateChanged();
    }

    @action
    private handleMetaDataChanged(name: string,input: string) {
        this.metadata[name] = input.trim();

        this.stateChanged();
    }

    @action
    createDropdownOptions() {
        let options : { [key: string]: string } = {};
        BlockTargetProvider.list(this.props.kind).forEach((targetConfig) => options[targetConfig.kind.toLowerCase()]= targetConfig.name );
        return options;
    }

    @action
    private handleTargetKindChanged = (name:string,value:string) => {
        if (this.spec.target.kind === value) {
            return;
        }
        this.spec.target.kind = value;
        this.spec.target.options = {};

        this.stateChanged();
    }

    private renderTargetConfig() {
        let TargetConfigComponent: Type<Component<TargetConfigProps, any>> | null = null;
        if (this.spec.target.kind) {
            const currentTarget = BlockTargetProvider.get(this.spec.target.kind, this.props.kind);

            if (currentTarget && currentTarget.componentType) {
                TargetConfigComponent = currentTarget.componentType;
            }
        }

        if (!TargetConfigComponent) {
            return <div></div>;
        }

        return (
            <div className="form-section">
                <h3>Target configuration</h3>
                <TargetConfigComponent
                    value={this.spec.target.options ? toJS(this.spec.target.options) : {}}
                    onOptionsChanged={(config:Object) => { this.handleTargetConfigurationChange(config) }} />
            </div>
        );
    }

    private renderForm() {
        return (
            <>
                <SingleLineInput 
                    name={"name"}
                    value={this.metadata.name}
                    label={"Name"}
                    validation={['required']}
                    help={"Specifiy the name of your block. E.g. My Block Name"}
                    onChange={(name,input)=>this.handleMetaDataChanged(name,input)}
                />
                
                <SingleLineInput 
                    name={"version"}
                    value={this.metadata.version}
                    label={"Version"}
                    validation={['required']}
                    help={"The version is automatically calculated for you using semantic versioning."}
                    onChange={(name,input)=>this.handleMetaDataChanged(name,input)}
                    disabled={true}
                />

                <DropdownInput
                    name={"targetKind"}
                    value={this.spec.target.kind.toLowerCase()}
                    label={"Target"}
                    validation={['required']}
                    help={"This tells the code generation process which target programming language to use."}
                    onChange={this.handleTargetKindChanged}
                    options={this.createDropdownOptions()}
                />


                {this.renderTargetConfig()}
            </>
        )
    }

    private renderEntities() {
        const entities = this.spec.entities || [];

        const result = {
            code: '',
            entities: entities.map((entity):DSLDataType => {
                return {
                    type: DSLEntityType.DATATYPE,
                    name: entity.name,
                    properties: fromSchema(entity.properties)
                }
            })
        };

        return (
            <div className={'entity-editor'}>
                <DataTypeEditor value={result} onChange={(result) => {
                    result.entities && this.setEntities(result.entities);
                }} />
            </div>
        )
    }

    @action
    private setEntities(results: DSLDataType[]) {
        const newEntities = results.map((entity:DSLDataType) => {
            return {
                name: entity.name,
                properties: toSchema(entity.properties)
            }
        });

        if (!_.isEqual(this.spec.entities, newEntities)) {
            this.spec.entities = newEntities
            this.stateChanged();
        }
    }

    render() {

        return (
            <div className={'frontend-block-config'}>
                <TabContainer defaultTab={'general'}>
                    <TabPage id={'general'} title={'General'}>
                        {this.renderForm()}
                    </TabPage>

                    {!this.props.creating &&
                        <TabPage id={'entities'} title={'Entities'}>
                            {this.renderEntities()}
                        </TabPage>
                    }

                </TabContainer>

            </div>
        )
    }
};