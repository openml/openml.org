import React from 'react';
import {SizeLimiter} from './sizeLimiter.jsx';
import {EvaluationDetail} from './itemDetail.jsx';
import {FlowDetail} from './itemDetail.jsx';
import ReactMarkdown from 'react-markdown';



export class RunItem extends React.Component{
  render(){
    //remove evaluations that do not have 'value' property from the retrieved api data
    var evaluations=[];
    for(let i=0; i< this.props.object.evaluations.length; i++){
       if(this.props.object.evaluations[i].value!=null){
            evaluations.push(this.props.object.evaluations[i]);
      }
    }
    //parameter with the same names result in FlowDetail objects with the same keys,counter is used to prevent it
    var parameterID=0;
    //ID counter for evaluations
    var evaluationID=0;
    return <React.Fragment>
        <h1 className={"sectionTitle"}><span className={"fa fa-trophy"}/>Run {this.props.object.run_id}</h1>
        <div className="subtitle"> </div>
        <div className="dataStats">
            <span><span className="fa fa-trophy"/>Task {this.props.object.run_task.task_id} {this.props.object.run_task.name} </span>
            <span><span className="fa fa-database"/> {this.props.object.run_task.source_data.name}</span>
            <span><span className="fa fa-cloud-upload"/>uploaded {this.props.object.date} by {this.props.object.uploader}</span>
            <span><span className="fa fa-heart"/>{this.props.object.nr_of_likes} likes</span>
            <span><span className="fa fa-cloud"/>{this.props.object.nr_of_downloads} downloads</span>
            <span><span className="fa fa-exclamation-triangle"/>{this.props.object.nr_of_issues} issues</span>
            <span><span className="fa fa-thumbs-down"/>{this.props.object.nr_of_downvotes} downvotes</span>
            <span><span className="fa fa-tags"/>{this.props.tags}</span>
        </div>
        <h1>Flow</h1>
        <SizeLimiter maxLength={7}>
        {
            this.props.object.run_flow.parameters.map(m => (
                <FlowDetail key={parameterID++} item={m}>
                </FlowDetail>
            ))
        }
        </SizeLimiter>
        <h1> {this.props.object.evaluations.length} Evaluation measures</h1>
        {
            evaluations.map(m => (
                <EvaluationDetail key={evaluationID++} item={m} target_values={this.props.object.run_task.target_values}>
                </EvaluationDetail>
            )
          )
        }
        <h1>Tasks</h1>
        <div className={"subtitle"}>Task visualization not currently supported</div>
    </React.Fragment>
  }
}
