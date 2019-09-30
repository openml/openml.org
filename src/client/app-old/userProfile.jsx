import React from "react";
import {Link} from "react-router-dom";


export class UserProfilePanel extends React.Component {
  render() {
    return  <React.Fragment>
        <div className="userPanel">
                <div className="userPanelDetails">
                      <div className="leftContentSection">
                          <img src="images/anonymousMan.png" width="130" height="130" className="userImage" ></img>
                      </div>
                      <div className="rightContentSection">
                            <h1>First name last name</h1>
                            <div className="smallContentSection"></div>
                            <div className="smallContentSection">
                                  <span><span className="fa fa-university"/>  </span>
                                  <span><span className="fa fa-map-marker-alt" aria-hidden="true" /> </span>
                                  <span><span className="fa fa-clock" aria-hidden="true" />  </span>
                            </div>
                       </div>
                 </div>
               <div className="userPanelStats">
                    <div className="smallContentSection">Uploads</div>
                    <div className="smallContentSection">
                      <span><span className="fa fa-database"/></span>
                      <span><span className="fa fa-cogs flow"/></span>
                      <span><span className="fa fa-trophy"/></span>
                      <span><span className="fa fa-star"/></span>
                    </div>
              </div>
         </div>
         <div>
               <table className="userTable">
                    <tbody>
                       <tr>
                          <td className="itemName"><span><span className="fa fa-database"/> Datasets</span></td>
                          <td className="itemDetail-small" ><span><span className="fa fa-cloud-upload-alt"/></span></td>
                          <td className="itemDetail-small"><span><span className="fa fa-cloud-download-alt"/></span></td>
                          <td className="itemDetail-small" ><span><span className="fa fa-heart"/></span></td>
                          <td className="itemDetail-small" ><span><span className="fa fa-spinner"/></span></td>
                       </tr>
                       <tr>
                          <td className="itemName"><span><span className="fa fa-cogs flow"/> Flows</span></td>
                          <td><span><span className="fa fa-cloud-upload-alt"/></span></td>
                          <td><span><span className="fa fa-cloud-download-alt"/></span></td>
                          <td><span><span className="fa fa-heart"/></span></td>
                          <td><span><span className="fa fa-spinner"/></span></td>
                       </tr>
                       <tr>
                          <td className="itemName"><span><span className="fa fa-trophy"/> Tasks</span></td>
                          <td><span><span className="fa fa-cloud-upload-alt"/></span></td>
                          <td><span><span className="fa fa-cloud-download-alt"/></span></td>
                          <td><span><span className="fa fa-heart"/></span></td>
                       </tr>
                       <tr>
                          <td className="itemName"><span><span className="fa fa-star"/> Runs</span></td>
                          <td><span><span className="fa fa-cloud-upload-alt"/></span></td>
                          <td><span><span className="fa fa-cloud-download-alt"/></span></td>
                          <td><span><span className="fa fa-heart"/></span></td>
                       </tr>
                    </tbody>
               </table>
         </div>
      </React.Fragment>
  }
}
