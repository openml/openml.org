import React from 'react';
import {SizeLimiter} from './sizeLimiter.jsx';
import {FeatureDetail} from './itemDetail.jsx';
import {QualityDetail} from './itemDetail.jsx';
import ReactMarkdown from 'react-markdown';

export class DatasetItem extends React.Component{
  render(){
    return <React.Fragment>
        <h1 className={"sectionTitle"}><span className={"fa fa-database"}/>{this.props.object.name}</h1>
        <div className="subtitle">uploaded by {this.props.object.uploader} at {this.props.object.date}</div>
        <div className="dataStats">
            <span><span className="fa fa-table"/>{this.props.object.format}</span>
            <span><span className="fa fa-closed-captioning"/>{this.props.object.licence}</span>
            <span><span className="fa fa-heart"/>{this.props.object.nr_of_likes} likes</span>
            <span><span className="fa fa-cloud"/>{this.props.object.nr_of_downlaods} downloads</span>
            <span><span className="fa fa-exclamation-triangle"/>{this.props.object.nr_of_issues} issues</span>
            <span><span className="fa fa-thumbs-down"/>{this.props.object.nr_of_downvotes} downvotes</span>
            <span><span className="fa fa-tags"/>{this.props.tags}</span>
        </div>
        <div className="contentSection">
            <ReactMarkdown source={this.props.object.description} />
        </div>
        <h1>Features</h1>
        <div className={"subtitle"}>{this.props.object.features.length} total features</div>
        <SizeLimiter maxLength={7}>
        {
            this.props.object.features.map(m => (
                <FeatureDetail key={"fd_"+m.name} item={m} type={m.type}>
                </FeatureDetail>
            ))
        }
        </SizeLimiter>
        <h1>Qualities</h1>
        <div className={"subtitle"}>{Object.keys(this.props.object.qualities).length} total qualities</div>
        <SizeLimiter maxLength={7}>
            {Object.keys(this.props.object.qualities).map(m => (
                <QualityDetail key={"q_"+m} item={{"name": m, "value": this.props.object.qualities[m]}}/>
            ))}
        </SizeLimiter>

        <h1>Tasks</h1>
        <div className={"subtitle"}>Task visualization not currently supported</div>
    </React.Fragment>
  }
}
