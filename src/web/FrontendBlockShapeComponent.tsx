import { BlockDefinition } from "@kapeta/schemas";
import { BlockTypeShapeProps } from "@kapeta/ui-web-types";
import {
  BlockHandle,
  BlockInstanceName,
  BlockName,
  BlockStatus,
  BlockVersion,
  useBlock,
} from "@kapeta/ui-web-components";
import React from "react";

export const FrontendBlockShapeComponent = <TBlockType extends BlockDefinition>(
  props: BlockTypeShapeProps<TBlockType>
) => {
  // Scaling the topbar svg to fit the block
  const block = useBlock();
  const svgWidth = 192;
  const svgHeight = 170 * (props.width / svgWidth);

  return (
    <g
      className="block-node"
      style={{ cursor: block.readOnly ? "default" : "move" }}
    >
      {/* Background */}
      <rect width={props.width} height={props.height} rx="6" fill="white" />
      {/* Border */}
      <rect
        x="0.5"
        y="0.5"
        width={props.width - 1}
        height={props.height - 1}
        rx="5.5"
        fill="none"
        stroke="black"
        strokeOpacity="0.12"
      />
      {/* Topbar */}
      <svg
        width={props.width}
        height={svgHeight}
        viewBox="0 0 192 170"
        fill="none"
      >
        <path
          d="M1 6C1 3.23858 3.23858 1 6 1H186C188.761 1 191 3.23858 191 6V24H1V6Z"
          fill="black"
          fillOpacity="0.12"
        />
        <path
          opacity="0.9"
          d="M34 12C34 10.8954 34.8954 10 36 10H166C167.105 10 168 10.8954 168 12C168 13.1046 167.105 14 166 14H36C34.8954 14 34 13.1046 34 12Z"
          fill="white"
        />
        <path
          opacity="0.9"
          d="M8 12C8 10.8954 8.89543 10 10 10C11.1046 10 12 10.8954 12 12C12 13.1046 11.1046 14 10 14C8.89543 14 8 13.1046 8 12Z"
          fill="white"
        />
        <path
          opacity="0.9"
          d="M15 12C15 10.8954 15.8954 10 17 10C18.1046 10 19 10.8954 19 12C19 13.1046 18.1046 14 17 14C15.8954 14 15 13.1046 15 12Z"
          fill="white"
        />
        <path
          opacity="0.9"
          d="M22 12C22 10.8954 22.8954 10 24 10C25.1046 10 26 10.8954 26 12C26 13.1046 25.1046 14 24 14C22.8954 14 22 13.1046 22 12Z"
          fill="white"
        />
      </svg>

      <svg fill="none" x={props.width - 20} y={-30}>
        <BlockStatus />
      </svg>
      {/* Offset if block has error */}
      <svg
        fill="none"
        x={props.width / 2}
        y={35}
        width={props.width - 20}
        viewBox="0 0 150 150"
      >
        <BlockInstanceName />
      </svg>
      <svg fill="none" x={props.width / 2} y={75}>
        <BlockName />
      </svg>

      <svg x={props.width / 2} y={95}>
        <BlockHandle />
      </svg>

      <svg y={props.height - 20} x={props.width / 2}>
        <BlockVersion />
      </svg>
    </g>
  );
};
