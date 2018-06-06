import React from 'react';
import {JsonRequest} from './ajax';
import {render} from 'react-dom';
import ReactMarkdown from 'react-markdown';

export class EntryDetails extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.state["obj"] = null;
        this.state["error"] = null;
    }
    componentDidMount() {
        JsonRequest("https://www.openml.org/es/openml/data/"+this.props.entry,
            undefined,
            /*{
                "query":
                    {
                        "ids":
                            {
                                "values": [this.props.entry]
                            }
                    },
                "query":
                    {

                        "types":
                            {
                                "values": ["data"]
                            }
                    }
            },*/
            function(json) {
                console.log("success");
                console.log(json);
                if (json["found"]===true) {
                    this.setState({"obj": json._source});
                }
                else {
                    this.setState({"obj": undefined,
                    "error": "No dataset with id "+this.props.entry+" can be found, it may have been moved or deleted."});
                }
            }.bind(this),
            function(json){
                console.log(json);
                this.setState({"error": "[HTTP Error "+json.status+"] "+json.statusText+". Please try again later."
                    +json.responseText});
            }.bind(this))
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
            /**/
            let tags = this.state.obj.tags.map(
                t => <span className="tag"><span className="fa fa-tag"/>{""+t.tag}</span>
            );
            console.log(tags);
            return <div className="mainBar">
                <h1 className={"sectionTitle"}>{this.state.obj.name}</h1>
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
            </div>
        }
    }
}