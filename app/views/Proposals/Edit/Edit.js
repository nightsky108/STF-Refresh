import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import Introduction from './Introduction/Introduction'
// import Contacts from './Contacts/Contacts'
// import Project from './Project/Project'
// import Manifest from './Manifest/Manifest'
// import Signatures from './Signatures/Signatures'

import { Icon, Spin, Tabs } from 'antd'
const TabPane = Tabs.TabPane

import styles from './Edit.css'
@compose(
  connect(state => ({ proposal: state.entities.proposal })),
  connectRequest(props => api.get('proposal', {
    id: props.params.id,
    join: ['contacts', 'body', 'manifests']
  }))
)
class Edit extends React.Component {
  render ({ proposal } = this.props) {
    return (
      <article className={styles['page']}>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h1>{`Editing: ${proposal && proposal.title ? proposal.title : 'New Proposal'}`}</h1>
            <h6>{`ID: ${proposal._id}`}</h6>
          <hr />
            <Tabs tabPosition='right' defaultActiveKey='1'>
              <TabPane key='1'
                tab={<span><Icon type='team' />Introduction</span>
              }>
                <Introduction />
              </TabPane>
              <TabPane key='2'
                tab={<span><Icon type='team' />Contacts</span>
              }>
                <div>Contacts</div>
              </TabPane>
              <TabPane key='3'
                tab={<span><Icon type='book' />Project</span>
              }>
                <div>Project</div>
              </TabPane>
              <TabPane key='4'
                tab={<span><Icon type='wallet' />Manifest</span>
              }>
                <div>Manifest</div>
              </TabPane>
              <TabPane key='5'
                tab={<span><Icon type='edit' />Signatures</span>
              }>
                <div>Signatures</div>
              </TabPane>
            </Tabs>
          </div>
        }
      </article>
    )
  }
}
Edit.propTypes = {
  proposal: PropTypes.object,
  api: PropTypes.object
}
export default Edit
