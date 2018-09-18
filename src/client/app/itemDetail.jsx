import React from 'react';
import {SizeLimiter} from './sizeLimiter.jsx';
import {getItem} from './api.js';
//items
import {DatasetItem} from './dataset.jsx';
import {TaskItem} from './task.jsx';
import {FlowItem} from './flow.jsx';
import {RunItem} from './run.jsx';
import ReactMarkdown from 'react-markdown';

export class FeatureDetail extends React.Component {
    render() {
        let icon = "";
        switch (this.props.item.type) {
            case "numeric":
                icon = "fa-ruler-horizontal";
                break;
            case "nominal":
                icon = "fa-tag";
                break;
          //fix icons from here
            case "discrete":
                icon = "fa-tag";
                break;
            case "logical":
                icon = "fa-tag";
                break;
            case "integer":
                icon = "fa-tag";
                break;
            case "numericvector":
                icon = "fa-tag";
                break;
            default:
                icon = "fa-question-circle";
                break;
        }
        return <div className="contentSection item">
            <div className={"itemHead"}><span className={"fa "+icon}/></div>
            <div className={"itemName"}>{this.props.item.name}
                {this.props.item.target?(<span className={"subtitle"}>(target)</span>):""}</div>
            <div className={"itemDetail-small"}>{this.props.item.distinct} distinct values<br/>
                {this.props.item.missing} missing attributes</div>
        </div>
    }
}

export class QualityDetail extends React.Component {
    constructor() {
        super();
    }

    fixUpperCase(str){
        let o = ""
        for (let i=0; i<str.length; i++){
            if (str[i].toLowerCase()!==str[i]){
                o += " "+str[i].toLowerCase();
            }
            else {
                o+=str[i];
            }
        }
        return o;
    }

    render() {
        return <div className={"contentSection item"}>
            <div className={"itemHead"}><span className={"fa fa-chart-bar"}/></div>
            <div className={"itemName"}>{this.fixUpperCase(this.props.item.name)}</div>
            <div className={"itemDetail-small"}>{this.props.item.value}{this.props.item.default_value}</div>
        </div>
    }
}

export class EntryDetails extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.state["obj"] = null;
        this.state["error"] = null;
    }
    componentDidMount() {
        getItem(this.props.type,this.props.entry)
            .then(
                (data)=>{
                    this.setState({"obj": data})
                }
            ).catch(
            (error)=> {
                this.setState({
                    "obj": undefined,
                    "error": error+""
                })
            }

        )
    }

    render(){
        if (this.state.error !== null){
            return <div className="mainBar">
                        <h1>An error occured</h1>
                        <p>{""+this.state.error}</p>
                    </div>
        }
        else if (this.state.obj === null) {
            return <div className="mainBar">
                <h2>Loading...</h2></div>
        }
        else {
            let tags = this.state.obj.tags.map(
                t => <span className="tag" key={"tag_"+t.tag}><span className="fa fa-tag"/>{""+t.tag}</span>
            );
       switch (this.props.type){
                   case "data":
                   return <DatasetItem object={this.state.obj} tags={tags}></DatasetItem>
                   break;
                   case "task":
                   return <TaskItem object={this.state.obj} tags={tags}></TaskItem>
                   break;
                   case "flow":
                   return <FlowItem object={this.state.obj} tags={tags}></FlowItem>
                   break;
                   case "run":
                   return <RunItem object={this.state.obj} tags={tags}></RunItem>
                   break;
                   default:
                   return <DatasetItem object={this.state.obj} tags={tags}></DatasetItem>
                   break;
        }
    }
  }
}
