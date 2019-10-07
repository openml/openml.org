import React from 'react';

export class SizeLimiter extends React.Component {
    constructor() {
        super();
        this.state={"expanded": false};
    }
    render() {
        let maxlen = this.props.maxLength===undefined?this.props.maxLength:7;
        if (this.props.children.length <= maxlen) {
            return <div>
                {this.props.children}
            </div>
        }
        else {
            if (this.state.expanded){
                return <div>
                    {this.props.children}
                    <div className={"expand"} onClick={()=>(this.setState({"expanded": false}))}>
                        <span className={"fa fa-caret-up"}/> Show less
                    </div>
                </div>
            }
            else {
                return <div>
                    {this.props.children.slice(0, maxlen)}
                    <div className={"expand"} onClick={()=>(this.setState({"expanded": true}))}>
                        <span className={"fa fa-caret-down"}/> Show more
                    </div>
                </div>
            }
        }
    }
}
