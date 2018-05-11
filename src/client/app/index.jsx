import React from 'react';
import {render} from 'react-dom';

class StatsScreen extends React.Component {
	render () {
		console.log(this.props.stat);
		let stats = this.props.stat.map(
			item=><span className="stat">
			{item.icon?(<img src={item.icon}/>):undefined}
			<span className="statValue">{item.value}</span>
			&nbsp;
			<span className="statUnit">{item.unit}</span>
			</span>
		);
		return <div>{stats}</div>
	}
}

class SearchElement extends React.Component {
		render() {
			return <div className="searchresult">
				<div className="itemHead">
					<img src="icons/database.svg"/>
				</div>
				<div className="itemName">
					{this.props.name + ''}
				</div>
				<div className="itemInfo">
					<div className="itemTeaser">
					{this.props.teaser+''}
					</div>
					<div className="itemStats itemStatsBig">
						<StatsScreen stat={this.props.stats}/>
					</div>
					<div className="itemStats itemStatsSmall">
					
					</div>
				</div>
			</div>
		}
}

class Sidebar extends React.Component {
	render() {
		return <div className="sidebar">sidebar</div>
	}
}

class MainPanel extends React.Component {

	
	render() {
		console.log(this.props.results);
		let results;
		console.log(JSON.stringify(this.props.results));
		if (this.props.results){
			results = this.props.results.map(
				result => <SearchElement name={result.name} teaser={result.teaser} stats={result.stats}/>
			)
		}
		else {
			results = [];
		}
		return <div className="mainbar">{results}</div>
	}
}

class TopBar extends React.Component {
	render() {
		return <div className="topbar">Top bar</div>
	}
}

class App extends React.Component {
  render () {
	let results = [
		{
			"name": "Test for an item with a name so ridiculously extreme that my layout could look ugly possibly",
			"teaser": "This teaser is supposed to be quite long, and thus to copy random jargon"+
			" from openML it probably uses some kind of cost matrix with 24 unique values and a p value below 0.2",
			"stats": [
				{"value": "5,000,000", "unit": "runs", "icon": "icons/star.svg"},
				{"value": "2,000", "unit": "likes", "icon": "icons/heart.svg"},
				{"value": "14,000", "unit": "downloads", "icon": "icons/cloud.svg"} 
			]
		},
		{
			"name": "credit-g (1)",
			"teaser": "This dataset classifies people described by a set of attributes as good or bad compared to",
			"stats": [{"value": "5", "unit": "mm"}]
		},
		{
			"name": "monk-problems-2 (1)",
			"teaser": "Once upon a time, in July 1991, the monks of Corsendonk Priory were faced with",
			"stats": [{"value": "5", "unit": "mm"}]
		}];
    return (<div><Sidebar/><TopBar/><MainPanel results={results}/></div>);
  }
}
render(<App/>, document.getElementById('app'));