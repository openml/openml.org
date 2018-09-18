import React from 'react';
import {SizeLimiter} from './sizeLimiter.jsx';
import {FeatureDetail} from './itemDetail.jsx';
import {QualityDetail} from './itemDetail.jsx';
import ReactMarkdown from 'react-markdown';

export class RunItem extends React.Component{
  render(){
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
                <FeatureDetail key={"fd_"+m.name} item={m}>
                </FeatureDetail>
            ))
        }
        </SizeLimiter>


        <h1>Tasks</h1>
        <div className={"subtitle"}>Task visualization not currently supported</div>
    </React.Fragment>
  }
}
