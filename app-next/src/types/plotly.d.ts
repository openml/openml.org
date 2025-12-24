declare module "react-plotly.js" {
  import { Component } from "react";
  import Plotly from "plotly.js";

  interface PlotParams {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    frames?: Plotly.Frame[];
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    onInitialized?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onUpdate?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onPurge?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onError?: (error: Error) => void;
    divId?: string;
    onClick?: (event: Plotly.PlotMouseEvent) => void;
    onHover?: (event: Plotly.PlotMouseEvent) => void;
    onUnhover?: (event: Plotly.PlotMouseEvent) => void;
    onSelected?: (event: Plotly.PlotSelectionEvent) => void;
    onRelayout?: (event: Plotly.PlotRelayoutEvent) => void;
    onRestyle?: (event: Plotly.PlotRestyleEvent) => void;
    onRedraw?: () => void;
    onAnimated?: () => void;
    onAfterPlot?: () => void;
    revision?: number;
  }

  export default class Plot extends Component<PlotParams> {}
}

declare module "plotly.js" {
  export interface Data {
    type?: string;
    x?: (string | number | Date)[];
    y?: (string | number | Date)[];
    z?: number[][] | number[];
    text?: string | string[];
    name?: string;
    mode?: string;
    marker?: Partial<{
      color: string | string[] | number[];
      size: number | number[];
      symbol: string | string[];
      line: Partial<{
        color: string;
        width: number;
      }>;
      colorscale: string | [number, string][];
    }>;
    line?: Partial<{
      color: string;
      width: number;
      dash: string;
    }>;
    fill?: string;
    fillcolor?: string;
    hovertemplate?: string;
    hoverinfo?: string;
    opacity?: number;
    orientation?: "v" | "h";
    textposition?: string;
    colorscale?: string | [number, string][];
    zmin?: number;
    zmax?: number;
    showscale?: boolean;
  }

  export interface Layout {
    title?: string | Partial<{ text: string; font: Partial<Font> }>;
    autosize?: boolean;
    width?: number;
    height?: number;
    margin?: Partial<{
      l: number;
      r: number;
      t: number;
      b: number;
      pad: number;
    }>;
    paper_bgcolor?: string;
    plot_bgcolor?: string;
    font?: Partial<Font>;
    xaxis?: Partial<Axis>;
    yaxis?: Partial<Axis>;
    showlegend?: boolean;
    legend?: Partial<Legend>;
    barmode?: "stack" | "group" | "overlay" | "relative";
    bargap?: number;
    bargroupgap?: number;
    hovermode?: "x" | "y" | "closest" | false;
    annotations?: Partial<Annotation>[];
    shapes?: Partial<Shape>[];
  }

  export interface Font {
    family: string;
    size: number;
    color: string;
  }

  export interface Axis {
    title: string | Partial<{ text: string; font: Partial<Font> }>;
    type: "linear" | "log" | "date" | "category";
    autorange: boolean | "reversed";
    range: [number, number];
    tickmode: "auto" | "linear" | "array";
    tickvals: number[];
    ticktext: string[];
    tickangle: number;
    showgrid: boolean;
    gridcolor: string;
    zeroline: boolean;
    zerolinecolor: string;
    automargin: boolean;
  }

  export interface Legend {
    x: number;
    y: number;
    xanchor: "auto" | "left" | "center" | "right";
    yanchor: "auto" | "top" | "middle" | "bottom";
    orientation: "v" | "h";
    bgcolor: string;
    bordercolor: string;
    borderwidth: number;
    font: Partial<Font>;
  }

  export interface Annotation {
    x: number;
    y: number;
    text: string;
    showarrow: boolean;
    arrowhead: number;
    ax: number;
    ay: number;
    font: Partial<Font>;
  }

  export interface Shape {
    type: "rect" | "circle" | "line" | "path";
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    line: Partial<{
      color: string;
      width: number;
      dash: string;
    }>;
    fillcolor: string;
    opacity: number;
  }

  export interface Config {
    responsive?: boolean;
    displayModeBar?: boolean | "hover";
    displaylogo?: boolean;
    modeBarButtonsToRemove?: string[];
    modeBarButtonsToAdd?: string[];
    scrollZoom?: boolean;
    editable?: boolean;
    staticPlot?: boolean;
    toImageButtonOptions?: Partial<{
      format: "png" | "svg" | "jpeg" | "webp";
      filename: string;
      height: number;
      width: number;
      scale: number;
    }>;
  }

  export interface Frame {
    name: string;
    data: Partial<Data>[];
    layout?: Partial<Layout>;
  }

  export interface Figure {
    data: Data[];
    layout: Layout;
    frames?: Frame[];
  }

  export interface PlotMouseEvent {
    points: Array<{
      x: number | string;
      y: number | string;
      pointIndex: number;
      curveNumber: number;
      data: Data;
    }>;
    event: MouseEvent;
  }

  export interface PlotSelectionEvent {
    points: Array<{
      x: number | string;
      y: number | string;
      pointIndex: number;
      curveNumber: number;
    }>;
    range?: {
      x: [number, number];
      y: [number, number];
    };
  }

  export interface PlotRelayoutEvent {
    [key: string]: number | string | boolean | undefined;
  }

  export interface PlotRestyleEvent {
    [key: string]: unknown;
  }
}
