import React from 'react';
import {SizeLimiter} from './sizeLimiter.js';
import {ParameterDetail} from './ItemDetail.js';
import ReactMarkdown from 'react-markdown';

export class FlowItem extends React.Component{
  render(){
    return <React.Fragment>
        <h1 className={"sectionTitle"}><span className={"fa fa-cogs"}/>{this.props.object.name}</h1>
        <div className="dataStats">
        <div className="subtitle"></div>
            <span><span className="fa fa-eye-slash"/>Visibility:{this.props.object.visibility}</span>
            <span><span className="fa fa-cloud-upload"/>uploaded {this.props.object.date} by {this.props.object.uploader}</span>
            <span><span className="fa fa-cloud-upload"/>{this.props.object.dependencies}</span>

            <span><span className="fa fa-star"/>{this.props.object.runs} runs</span>
            <span><span className="fa fa-heart"/>{this.props.object.nr_of_likes} likes</span>
            <span><span className="fa fa-cloud"/>downloaded by {this.props.object.nr_of_downlaods} </span>
            <span><span className="fa fa-exclamation-triangle"/>{this.props.object.nr_of_issues} issues</span>
            <span><span className="fa fa-thumbs-down"/>{this.props.object.nr_of_downvotes} downvotes</span>
            <span><span className="fa fa-thumbs-down"/>{this.props.object.total_downloads}total downloads</span>
            <span><span className="fa fa-tags"/>{this.props.tags}</span>
        </div>
        <div className="contentSection">
            <ReactMarkdown source={this.props.object.description} />
        </div>
        <h1>Parameters</h1>
        <SizeLimiter maxLength={7}>
        {
            this.props.object.parameters.map(m => (
                <ParameterDetail key={"fd_"+m.name} item={m}>
                </ParameterDetail>
            ))
        }
        </SizeLimiter>
        <h1>{this.props.object.runs} Runs</h1>
        <div className={"subtitle"}>Run visualization not currently supported</div>
    </React.Fragment>
  }
}
