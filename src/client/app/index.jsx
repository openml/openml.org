import React from 'react';
import {render} from 'react-dom';

class SearchElement extends React.Component {
		render() {
			return <div className="searchresult">
				<div className="iteamHead"/>
				<div className="teaser"/>
				<div className="stats"/>
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
		if (this.props.results){
			results = this.props.results.map(
				result => <SearchElement value={result}/>
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
    return (<div><Sidebar/><TopBar/><MainPanel results={[[], []]}/></div>);
  }
}
render(<App/>, document.getElementById('app'));