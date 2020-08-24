import React from 'react';
import '../App.css';
import dateFormat from 'dateformat';

class SavedPage extends React.Component {
  render() {
	if (!this.props.savedJobs) {
      return <p>No Data was returned!</p>;
    } else {
	  return (
		<React.Fragment>
		  <ul className="list-group">
			{this.props.savedJobs.map((listitem, i) => (
			  <li className="list-group-item" key={i}>
			    <div className="employer-name">
                  {listitem.employer.name}
                </div>
				<div className="employer-details">
				  <div>
				    <label><b>Job Publish Date: </b></label>
				    {dateFormat(listitem.published, "d.mm.yyyy")}
				  </div>
				  <div>
				    <label><b>Job Ad Title: </b></label>
				    {listitem.title}
				  </div>
				  <div>
                    <label><b>Employer Organisation: </b></label>
                    {listitem.employer.orgnr}
                  </div>
                </div>
			  </li>
			))}
		  </ul>
	    </React.Fragment>
	  );
	}
  }
}

export default SavedPage;
