import React from 'react';
import {SizeLimiter} from './sizeLimiter.jsx';
import {FeatureDetail} from './itemDetail.jsx';
import {QualityDetail} from './itemDetail.jsx';
import ReactMarkdown from 'react-markdown';

export class TaskItem extends React.Component{
  render(){
    return <React.Fragment>
                <h1 className={"sectionTitle"}><span className={"fa fa-trophy fa-lg"}/>{this.props.object.tasktype.name} on {this.props.object.source_data.name} </h1>
                <div className="subtitle">uploaded at {this.props.object.date}</div>
                <div className="dataStats">
                  <span><span className="fa fa-trophy"/> Task {this.props.object.task_id}</span>
                  <span><span className="fa fa-flag"/>{this.props.object.tasktype.name}</span>
                  <span><span className="fa fa-database"/>{this.props.object.source_data.name}</span>
                  <span><span className="fa fa-star"/>{this.props.object.runs} runs submitted</span>
                  <span><span className="fa fa-heart"/>{this.props.object.nr_of_likes} likes</span>
                  <span><span className="fa fa-cloud"/>{this.props.object.nr_of_downloads} downloads</span>
                  <span><span className="fa fa-exclamation-triangle"/>{this.props.object.nr_of_issues} issues</span>
                  <span><span className="fa fa-tag"/>{this.props.tags}</span>
                </div>
                <h1>Task</h1>
                <div className={"subtitle"}>Task visualization not currently supported</div>
            </React.Fragment>
        }
    }
