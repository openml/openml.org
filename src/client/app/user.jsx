import React from 'react';
import ReactMarkdown from 'react-markdown';

export class UserItem extends React.Component{



    render(){

      return <React.Fragment>
        <div className="userPanel">
                <div className="userPanelDetails">
                      <div className="leftContentSection">
                            {this.props.object.image ?
                            (<img src={this.props.object.image} width="130" height="130" className="userImage"></img>):
                            (<img src="images/anonymousMan.png" width="130" height="130" className="userImage" ></img>) }
                      </div>
                      <div className="rightContentSection">
                            <h1>{this.props.object.first_name} {this.props.object.last_name}</h1>
                            <div className="smallContentSection"> {this.props.object.bio}</div>
                            <div className="smallContentSection">
                                  <span><span className="fa fa-university"/>{this.props.object.affiliation}  </span>
                                  <span><span className="fa fa-map-marker-alt" aria-hidden="true" />{this.props.object.country}  </span>
                                  <span><span className="fa fa-clock" aria-hidden="true" />{this.props.object.date}  </span>
                            </div>
                       </div>
                 </div>
               <div className="userPanelStats">
                    <div className="smallContentSection">Uploads</div>
                    <div className="smallContentSection">
                      <span><span className="fa fa-database"/>{this.props.object.datasets_uploaded}</span>
                      <span><span className="fa fa-cogs flow"/>{this.props.object.flows_uploaded}</span>
                      <span><span className="fa fa-trophy"/>{this.props.object.tasks_uploaded}</span>
                      <span><span className="fa fa-star"/>{this.props.object.runs_uploaded}</span>
                    </div>
              </div>
         </div>
         <div>
               <table className="userTable">
                    <tbody>
                       <tr>
                          <td className="itemName"><span><span className="fa fa-database"/> Datasets</span></td>
                          <td className="itemDetail-small" ><span><span className="fa fa-cloud-upload-alt"/>{this.props.object.datasets_uploaded}</span></td>
                          <td className="itemDetail-small"><span><span className="fa fa-cloud-download-alt"/>{this.props.object.downloads_received_data}</span></td>
                          <td className="itemDetail-small" ><span><span className="fa fa-heart"/>{this.props.object.likes_received_data}</span></td>
                          <td className="itemDetail-small" ><span><span className="fa fa-spinner"/>{this.props.object.runs_on_datasets}</span></td>
                       </tr>
                       <tr>
                          <td className="itemName"><span><span className="fa fa-cogs flow"/> Flows</span></td>
                          <td><span><span className="fa fa-cloud-upload-alt"/>{this.props.object.flows_uploaded}</span></td>
                          <td><span><span className="fa fa-cloud-download-alt"/>{this.props.object.downloads_received_flow}</span></td>
                          <td><span><span className="fa fa-heart"/>{this.props.object.likes_received_flow}</span></td>
                          <td><span><span className="fa fa-spinner"/>{this.props.object.runs_on_flows}</span></td>
                       </tr>
                       <tr>
                          <td className="itemName"><span><span className="fa fa-trophy"/> Tasks</span></td>
                          <td><span><span className="fa fa-cloud-upload-alt"/>{this.props.object.tasks_uploaded}</span></td>
                          <td><span><span className="fa fa-cloud-download-alt"/>{this.props.object.downloads_received_task}</span></td>
                          <td><span><span className="fa fa-heart"/>{this.props.object.likes_received_task}</span></td>
                       </tr>
                       <tr>
                          <td className="itemName"><span><span className="fa fa-star"/> Runs</span></td>
                          <td><span><span className="fa fa-cloud-upload-alt"/>{this.props.object.runs_uploaded}</span></td>
                          <td><span><span className="fa fa-cloud-download-alt"/>{this.props.object.downloads_received_run}</span></td>
                          <td><span><span className="fa fa-heart"/>{this.props.object.likes_received_run}</span></td>
                       </tr>
                    </tbody>
               </table>
         </div>



      </React.Fragment>
    }
  }
