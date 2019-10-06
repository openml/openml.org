import React from 'react';
import {SizeLimiter} from './sizeLimiter.js';
import {FeatureDetail} from './ItemDetail.js';
import {QualityDetail} from './ItemDetail.js';
import ReactMarkdown from 'react-markdown';
import { Chip, Avatar } from '@material-ui/core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class DatasetItem extends React.Component{
  render(){
    return <React.Fragment>
        <h1 className={"sectionTitle"}><span className={"fa fa-database"}/>{this.props.object.name}</h1>
        uploaded by <Chip size="small" variant="outlined" color="primary" avatar={<Avatar>{this.props.object.uploader.charAt(0)}</Avatar>} label={this.props.object.uploader}/> at <FontAwesomeIcon icon="clock"/> {this.props.object.date}
        <div className="dataStats">
            <span><FontAwesomeIcon icon="table"/> {this.props.object.format}</span>
            <span><FontAwesomeIcon icon="closed-captioning"/>{this.props.object.licence}</span>
            <span><FontAwesomeIcon icon="heart"/>{this.props.object.nr_of_likes} likes</span>
            <span><FontAwesomeIcon icon="cloud"/>{this.props.object.nr_of_downloads} downloads</span>
            <span><FontAwesomeIcon icon="exclamation-triangle"/>{this.props.object.nr_of_issues} issues</span>
            <span><FontAwesomeIcon icon="thumbs-down"/>{this.props.object.nr_of_downvotes} downvotes</span><br />
            <span><FontAwesomeIcon icon="tags"/>{this.props.tags}</span>
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
                <QualityDetail key={"q_"+m} item={{"name": m, "value": this.props.object.qualities[m]}} />
            ))}
        </SizeLimiter>

        <h1>Tasks</h1>
        <div className={"subtitle"}>Task visualization not currently supported</div>
    </React.Fragment>
  }
}
