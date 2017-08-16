import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../../util/form'
import api from '../../../../../services'

import { Spin, Form, Row, Col, Switch, Checkbox, Slider, Input, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

//  Questions to ask for metrics
const questions = ['Proposal Quality', 'Academic Merit']

@compose(
  connect(
    (state, props) => ({
      proposal: state.db.manifests[props.index].proposal._id,
      manifest: state.db.manifests[props.index],
      decision: state.db.manifests[props.index].decision,
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Decision extends React.Component {
  componentDidMount () {
    const { form, decision } = this.props
    if (form && decision) {
      const { body, approved } = decision
      form.setFieldsValue({ body, approved })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, proposal, manifest, decision, user } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.warn('Submitting', values)
        const submission = Object.assign({
          proposal,
          manifest: manifest._id,
          author: user._id
        }, values)
        console.warn('Review', submission)
        //  TODO: Add custom update func
        review._id
          ? api.patch('review', submission, { id: review._id })
          .then(message.success('Review updated!'))
          .catch(err => {
            message.warning('Review failed to update - Unexpected client error')
            console.warn(err)
          })
          : api.post('review', submission)
          .then(message.success('Review posted!'))
          .catch(err => {
            message.warning('Review failed to post - Unexpected client error')
            console.warn(err)
          })
      }
    })
  }
  render (
    { form, manifest } = this.props
  ) {
    const { decisions } = manifest.docket
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <Form onSubmit={this.handleSubmit}>
            <h1>Committee Decision</h1>
            <h4>{decisions ? 'Issue the final decision. Be forewarned, these decisions go into effect immediately!' : 'Decision submissions are closed'}</h4>
            <FormItem label='Remarks (Public)' {...layout} >
              {form.getFieldDecorator('body')(
                <Input disabled={!decisions}type='textarea' rows={4} />
              )}
            </FormItem>
            <FormItem label='Approved' {...layout}>
              {form.getFieldDecorator('approved', { valuePropName: 'checked' })(
                //  Valueprop is a selector for antd switches, it's in the docs.
                <Checkbox disabled={!decisions} size='large' />
              )}
            </FormItem>
            <FormItem>
              <Button size='large' type='primary'
                htmlType='submit' ghost disabled={!decisions}
                >Issue Decision</Button>
            </FormItem>
          </Form>
          }
      </section>
    )
  }
}
Decision.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  proposal: PropTypes.string,
  manifest: PropTypes.object,
  review: PropTypes.object,
  user: PropTypes.object
}
export default Decision
