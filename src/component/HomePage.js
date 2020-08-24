import React from 'react';
import '../App.css';
import { Accordion, Card, Button } from 'react-bootstrap';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import dateFormat from 'dateformat';

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionToggle(eventKey, () =>
    console.log('totally custom!', children),
  );

  return (
    <button
      type="button"
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

function CreateMarkup(data) {
  return {__html: data};
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);
   
    this.state = {
      users: [],
      numberOfItems: 10,
      expanded: false,
      exampleItems: [],
      pageOfItems: [],
      total: null,
      per_page: null,
      current_page: null,
      totalPages: null,
      open: false
    }

    this.showButton = this.showButton.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
  }

  onChangePage(pageOfItems) {
    this.setState({ pageOfItems: pageOfItems });
  }

  componentDidMount() {
    this.makeHttpRequestWithPage(1);
  }

  makeHttpRequestWithPage = async pageNumber => {
    var page_number;
    if (pageNumber === 'previous') {
      page_number = (this.state.current_page !== null || this.state.current_page > 1 )? (this.state.current_page - 1) : 1;
    } else if (pageNumber === 'next') {
      page_number = (this.state.current_page == null || this.state.current_page < this.state.totalPage )? (this.state.current_page + 1) : 1;
    } else {
      page_number = pageNumber;
    }
    let response = await fetch(`https://arbeidsplassen.nav.no/public-feed/api/v1/ads?size=10&page=${page_number}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwdWJsaWMudG9rZW4udjFAbmF2Lm5vIiwiYXVkIjoiZmVlZC1hcGktdjEiLCJpc3MiOiJuYXYubm8iLCJpYXQiOjE1NTc0NzM0MjJ9.jNGlLUF9HxoHo5JrQNMkweLj_91bgk97ZebLdfx3_UQ',
      }
    });

    const data = await response.json();
    let savedArray = JSON.parse(localStorage.getItem("savedJobs")),
        dataArray = data.content.map(function (data) {
          let isSavedJob = savedArray.find(function (job){
            return job.uuid === data.uuid;
          });
          data.isSaved = isSavedJob ? true : false;
          return data;
        });

    this.setState({
      users: dataArray,
      total: data.totalElements,
      per_page: data.pageSize,
      current_page: data.pageNumber,
      totalPage: data.totalPages
    });
  }

  showButton() {
    this.state.numberOfItems === 10 ? (
    this.setState({ numberOfItems: this.state.users.length, expanded: true })
      ) : (
      this.setState({ numberOfItems: 10, expanded: false })
    )
  }

  render() {
    let renderPageNumbers;
    const pageNumbers = [];
    if (this.state.total !== null) {
      for (let i = 1; i <= Math.ceil(this.state.total / this.state.per_page); i++) {
        pageNumbers.push(i);
      }

      renderPageNumbers = pageNumbers.map(number => {
        let classes = this.state.current_page === number ? "active" : '';

        if (number === 1 || number === this.state.total || (number >= this.state.current_page - 2 && number <= this.state.current_page + 2)) {
          return (
            <span key={number} className={classes} onClick={() => this.makeHttpRequestWithPage(number)}>{number}</span>
          );
        }
      });
    }

    return (
      <React.Fragment>
        <div className="job-tables">
          <ul className="list-group job-table">
            {this.state.users.slice(0, this.state.numberOfItems).map((user, i) => (
              <li className="list-group-item" key={i}>
                <Accordion defaultActiveKey="0">
                  <div className="employer-name">
                    <div dangerouslySetInnerHTML={CreateMarkup(user.employer.name)} /><br/>
                  </div>
                  <div className="employer-details">
                    <div>
                      <label><b>Job Publish Date: </b></label>
                      {dateFormat(user.published, "d.mm.yyyy")}
                    </div>
                    <div>
                      <label><b>Job Ad Title: </b></label>
                      {user.title}
                    </div>
                    <div>
                      <label><b>Employer Organisation: </b></label>
                      {user.employer.orgnr}
                    </div>
                  </div>
                  <Accordion defaultActiveKey="0">
                    <div className="job-save-button">
                    {user.isSaved ? <button disabled><span>Saved</span></button>
                      : <button className="save-button" onClick={() => this.props.onSaveClick(user)}><span className="save-button-text">Save</span></button>
                    }
                    </div>
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          <label className="card-button">Click me for more info!</label>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <div className="item-more-info">
                            <div className="item-more-info-content">
                              <label><b>Description: </b></label>
                              <div dangerouslySetInnerHTML={CreateMarkup(user.description)} /><br/>
                              <label><b>Employer Description: </b></label>
                              <div dangerouslySetInnerHTML={CreateMarkup(user.employer.description)} /><br/>
                              <label><b>Employer Homepage: </b></label>
                              <div dangerouslySetInnerHTML={CreateMarkup(user.employer.homepage)} /><br/>
                              <label><b>Application Due: </b></label>
                              <div dangerouslySetInnerHTML={CreateMarkup(user.applicationDue)} /><br/>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </Accordion>
              </li>
            ))}
          </ul>
          <div className="text-center">
            <div className="pagination">
              <span onClick={() => this.makeHttpRequestWithPage('previous')}>&laquo;</span>
                {renderPageNumbers}
              <span onClick={() => this.makeHttpRequestWithPage('next')}>&raquo;</span>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default HomePage;