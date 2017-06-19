import React, { Component } from 'react'

class SearchDoctorList extends Component {
  render () {
    const doctors = this.props.doctors
    return (
      <div>
        {
          doctors.map((doc) => {
            return (
              <div key={doc.id} style={{backgroundColor: '#fff', marginBottom: 1, display: 'flex', padding: 10}}
                onClick={() => { this.props.selectDoctor() }}
              >
                <div><img width='60' height='60' src='/static/icons/doctor_head.png' /></div>
                <div style={{padding: 10}}>
                  <div style={{marginBottom: 3}}>
                    <span style={{fontSize: 16}} dangerouslySetInnerHTML={{__html: this.props.searchKey(doc.doctorName)}} /> <span style={{color: '#D4D4D4'}}>广东省人民医院</span>
                  </div>
                  <div>
                    {doc.departmentHasDoctors[0].department.deptName} | {doc.title}
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default SearchDoctorList
