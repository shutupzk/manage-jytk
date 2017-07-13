import React, { Component } from 'react'
import div from 'next/link'
import {theme, Modal, ModalHeader, ModalFooter} from 'components'

class DepartmentList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showTipModal: true
    }
  }

  renderModal() {
    let modalHtml;
    modalHtml = <Modal showModalState={this.state.showTipModal || this.state.showFilterModal}>
      <ModalHeader classChild='modalheaderTip'>挂号须知</ModalHeader>
      <div style={{padding: 20, color: theme.fontcolor}}>
        <p>尊敬的患者：</p>
        <p>您好，如果您交费后有退费要求时，应根据不同的退费情况提供所需单据。</p>
        <p>1.退检查、治疗、化验、CT、核磁等费用时需具备：</p>
        <p>(1)由医生开出的退款凭证；</p>
        <p>(2)盖过收费章的原交费单。</p>
        <p>2.退未取药的药费处方需具备：</p>
        <p>(1)原申请单或处方单。</p>
        <p>谢谢您的合作！</p>
      </div>
      <ModalFooter>
        <button className='modalBtn modalOnlyBtn' onClick={(e) => {this.setState({showTipModal: false})}}>确定</button>
      </ModalFooter>
    </Modal>
    return modalHtml
  }

  render () {
    var deps = this.props.deps
    return (
      <div style={{backgroundColor: '#ffffff'}}>
        {this.renderModal()}
        {
          deps.map((dep) => {
            return (
              <div
                key={dep.id} onClick={(deps) => {
                  this.props.selectDepartment(dep)
                }}
                className='item'>
                <div dangerouslySetInnerHTML={{__html: this.props.searchKey(dep.deptName)}} />
                <style jsx>{`
                  .item{
                    margin-left: ${theme.lrmargin};
                    border-bottom: 1px solid ${theme.bordercolor};
                    line-height: .4rem;
                    color: ${theme.mainfontcolor};
                    font-size: ${theme.fontsize};
                  }
                  .item:last-child{
                    border-bottom: 0px solid ${theme.bordercolor};
                  }
                `}</style>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default DepartmentList
