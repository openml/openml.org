import React from 'react';
import {SizeLimiter} from './sizeLimiter.jsx';
import {getItem} from './api.js'
import ReactMarkdown from 'react-markdown';

class FeatureDetail extends React.Component {
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
            <div className={"itemDetail-small"}>{this.props.item.distinct} distinct values<br/>
                {this.props.item.missing} missing attributes</div>
        </div>
    }
}

class QualityDetail extends React.Component {
    constructor() {
        super();
    }

    fixUpperCase(str){
        let o = ""
        for (let i=0; i<str.length; i++){
            if (str[i].toLowerCase()!=str[i]){
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
        getItem(this.props.entry)
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
            return <React.Fragment>
                <h1 className={"sectionTitle"}><span className={"fa fa-database"}/>{this.state.obj.name}</h1>
                <div className="subtitle">uploaded by {this.state.obj.uploader} at {this.state.obj.date}</div>
                <div className="dataStats">
                    <span><span className="fa fa-table"/>{this.state.obj.format}</span>
                    <span><span className="fa fa-closed-captioning"/>{this.state.obj.licence}</span>
                    <span><span className="fa fa-heart"/>{this.state.obj.nr_of_likes} likes</span>
                    <span><span className="fa fa-cloud"/>{this.state.obj.nr_of_downlaods} downloads</span>
                    <span><span className="fa fa-exclamation-triangle"/>{this.state.obj.nr_of_issues} issues</span>
                    <span><span className="fa fa-thumbs-down"/>{this.state.obj.nr_of_downvotes} downvotes</span>
                    {tags}
                </div>
                <div className="contentSection">
                    <ReactMarkdown source={this.state.obj.description} />
                </div>
                <h1>Features</h1>
                <div className={"subtitle"}>{this.state.obj.features.length} total features</div>
                <SizeLimiter maxLength={7}>
                {
                    this.state.obj.features.map(m => (
                        <FeatureDetail key={"fd_"+m.name} item={m}>
                        </FeatureDetail>
                    ))
                }
                </SizeLimiter>
                <h1>Qualities</h1>
                <div className={"subtitle"}>{Object.keys(this.state.obj.qualities).length} total qualities</div>
                <SizeLimiter maxLength={7}>
                    {Object.keys(this.state.obj.qualities).map(m => (
                        <QualityDetail key={"q_"+m} item={{"name": m, "value": this.state.obj.qualities[m]}}/>
                    ))}
                </SizeLimiter>

                <h1>Tasks</h1>
                <div className={"subtitle"}>Task visualization not currently supported</div>
            </React.Fragment>
        }
    }
}