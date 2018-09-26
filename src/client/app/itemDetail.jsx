import React from 'react';
import {SizeLimiter} from './sizeLimiter.jsx';
import {getItem} from './api.js';
//items
import {DatasetItem} from './dataset.jsx';
import {TaskItem} from './task.jsx';
import {FlowItem} from './flow.jsx';
import {RunItem} from './run.jsx';
import {StudyItem} from './study.jsx';
import {UserItem} from './user.jsx';

import ReactMarkdown from 'react-markdown';


function fixUpperCase(str){
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
            default:
                icon = "fa-question-circle";
                break;
        }
        return <div className="contentSection item">
            <div className={"itemHead"}><span className={"fa "+icon}/></div>
            <div className={"itemName"}>{this.props.item.name}
                {this.props.item.target?(<span className={"subtitle"}>(target)</span>):""}</div>
           <div className={"itemDetail-small"}>{this.props.item.type}</div>
            <div className={"itemDetail-small"}>{this.props.item.distinct} distinct values<br/>
                {this.props.item.missing} missing attributes</div>
        </div>
    }
}

export class QualityDetail extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <div className={"contentSection item"}>
            <div className={"itemHead"}><span className={"fa fa-chart-bar"}/></div>
            <div className={"itemName"}>{fixUpperCase(this.props.item.name)}</div>
            <div className={"itemDetail-small"}>{this.props.item.value}</div>
        </div>
    }
}
export class ParameterDetail extends React.Component {
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
             <div className={"itemName"}>{fixUpperCase(this.props.item.name)}</div>
             <div className={"itemDetail-small"}>{this.props.item.default_value}</div>
         </div>
       }
}
export class EvaluationDetail extends React.Component {
    constructor() {
        super();
    }

    render(){
       if (this.props.item.array_data != null){
         let classes = this.props.target_values.map(item => <td key={"key_"+item}> {item} </td> );
         //same values result in same keys, counter is used to prevent it
         var ID=0;
         let values = this.props.item.array_data.map(item => <td key={ID++}> {item} </td> );
       return <div className="evaluationContentSection">
        <div className="leftContentSection">{this.props.item.evaluation_measure}</div>
        <div className="rightContentSection">
        <div className="smallContentSection">{this.props.item.value}</div>
        <div className="smallContentSection">
            <table>
                 <tbody>
                    <tr>{classes}</tr>
                    <tr>{values}</tr>
                 </tbody>
            </table>
        </div>
        <div className="smallContentSection">Cross-validation details (10-fold Crossvalidation)</div>
        </div>
      </div>
    }
    else {
      return <div className="evaluationContentSection">
       <div className="leftContentSection">{this.props.item.evaluation_measure}</div>
       <div className="rightContentSection">
           <div className="smallContentSection">{this.props.item.value}</div>
           <div className="smallContentSection">Cross-validation details (10-fold Crossvalidation)</div>
       </div>
     </div>

    }
    }
  }
export class FlowDetail extends React.Component {
    constructor() {
        super();
    }
    render() {
         return <div className={"contentSection item"}>
             <div className={"itemName"}>{fixUpperCase(this.props.item.parameter)}</div>
             <div className={"itemDetail-small"}>{this.props.item.value}</div>
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
          if(this.props.type === "data" || this.props.type === "task" || this.props.type ==="flow" || this.props.type === "run"){
            var tags = this.state.obj.tags.map(
                t => <span className="tag" key={"tag_"+t.tag}><span className="fa fa-tag"/>{""+t.tag}</span>
            );
          }

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
                   case "study":
                   return <StudyItem object={this.state.obj} ></StudyItem>
                   break;
                   case "user":
                   return <UserItem object={this.state.obj} ></UserItem>
                   break;
                   default:
                   return <DatasetItem object={this.state.obj} tags={tags}></DatasetItem>
                   break;
        }
    }
  }
}
