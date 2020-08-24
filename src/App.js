import React from 'react';
import SavedPage from './component/SavedPage';
import HomePage from './component/HomePage';
import { Tabs, Tab,  } from 'react-bootstrap';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        savedJobs: JSON.parse(localStorage.getItem("savedJobs"))
      }
    this.onSaveClick = this.onSaveClick.bind(this)
  }
  onSaveClick(event) {
    event.isSaved = true;
    //localStorage.clear()
    var savedJobs = [];
    savedJobs.push(event);
    //console.log(savedJobs);
    var oldSavedJobs = JSON.parse(localStorage.getItem("savedJobs"));
    if ( oldSavedJobs ) {
      for (var i = oldSavedJobs.length - 1; i >= 0; i--) {
        if ( event.uuid !== oldSavedJobs[i].uuid ) {
          savedJobs.push(oldSavedJobs[i]);
        }
      }
    }
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    this.setState({
      savedJobs: JSON.parse(localStorage.getItem("savedJobs"))
    });
  }
  render () {
    return (
      <div className="main-page">
        <div className="heading">
          <h4 className="job-heading">Find your next job faster</h4>
        </div>
        <Tabs>
          <Tab eventKey="home" title="Home">
            <HomePage onSaveClick={this.onSaveClick} savedJobs={this.state.savedJobs}/>
          </Tab>
          <Tab eventKey="saved" title="Saved">
            <SavedPage savedJobs={this.state.savedJobs}/>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default App;
