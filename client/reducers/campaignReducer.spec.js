import { expect } from 'chai';

import {
  requestPostCreateCampaign,
  completePostCreateCampaign,
  requestPostCreateTemplate,
  completePostCreateTemplate,
  requestGetCampaign,
  completeGetCampaign,
  completeDeleteCampaigns,
  requestGetTemplates,
  completeGetTemplates,
  completeDeleteTemplates,
  requestPostSendCampaign,
  completePostSendCampaign,
  requestPostSendTestEmail,
  completePostSendTestEmail
} from '../actions/campaignActions';

import initialState from './initialState';

import {
  createCampaign,
  createTemplate,
  manageCampaign,
  manageTemplates,
  sendCampaign,
  sendTest
 } from './campaignReducer';

describe('(Reducer/Action Creator) campaign', () => {

// createCampaign reducer

  it('should handle REQUEST_POST_CREATECAMPAIGN', () => {
    expect(
      createCampaign(undefined, requestPostCreateCampaign())
    ).to.deep.equal({
      ...initialState.createCampaign,
      isPosting: true
    });
  });

  it('should handle COMPLETE_POST_CREATECAMPAIGN', () => {
    expect(
      createCampaign(undefined, completePostCreateCampaign())
    ).to.deep.equal({
      ...initialState.createCampaign,
      isPosting: false
    });
  });

// createTemplate reducer

  it('should handle REQUEST_POST_CREATETEMPLATE', () => {
    expect(
      createTemplate(undefined, requestPostCreateTemplate())
    ).to.deep.equal({
      ...initialState.createTemplate,
      isPosting: true
    });
  });

  it('should handle COMPLETE_POST_CREATETEMPLATE', () => {
    expect(
      createTemplate(undefined, completePostCreateTemplate())
    ).to.deep.equal({
      ...initialState.createTemplate,
      isPosting: false
    });
  });

// manageCampaign reducer

  it('should handle REQUEST_GET_CAMPAIGNS', () => {
    expect(
      manageCampaign(undefined, requestGetCampaign())
    ).to.deep.equal({
      ...initialState.manageCampaign,
      isGetting: true
    });
  });

  it('should handle COMPLETE_GET_CAMPAIGNS', () => {
    const mockCampaigns = 'something';
    expect(
      manageCampaign(undefined, completeGetCampaign(mockCampaigns))
    ).to.deep.equal({
      ...initialState.manageCampaign,
      campaigns: mockCampaigns,
      isGetting: false
    });
  });

  it('should handle COMPLETE_DELETE_CAMPAIGNS', () => {
    const mockCampaigns = 'something';
    expect(
      manageCampaign(undefined, completeDeleteCampaigns(mockCampaigns))
    ).to.deep.equal({
      ...initialState.manageCampaign,
      campaigns: mockCampaigns
    });
  });

// manageTemplates reducer

  it('should handle REQUEST_GET_TEMPLATES', () => {
    expect(
      manageTemplates(undefined, requestGetTemplates())
    ).to.deep.equal({
      ...initialState.manageTemplates,
      isGetting: true
    });
  });

  it('should handle COMPLETE_GET_TEMPLATES', () => {
    const mockTemplates = 'something';
    expect(
      manageTemplates(undefined, completeGetTemplates(mockTemplates))
    ).to.deep.equal({
      ...initialState.manageTemplates,
      templates: mockTemplates,
      isGetting: false
    });
  });

  it('should handle COMPLETE_DELETE_TEMPLATES', () => {
    const mockTemplates = 'something';
    expect(
      manageTemplates(undefined, completeDeleteTemplates(mockTemplates))
    ).to.deep.equal({
      ...initialState.manageTemplates,
      templates: mockTemplates
    });
  });

// sendCampaign reducer

  it('should handle REQUEST_POST_SENDCAMPAIGN', () => {
    expect(
      sendCampaign(undefined, requestPostSendCampaign())
    ).to.deep.equal({
      ...initialState.sendCampaign,
      isPosting: true
    });
  });

  it('should handle REQUEST_POST_SENDCAMPAIGN', () => {
    const mockSendCampaignResponse = 'something1';
    const mockSendCampaignStatus = 'something2';
    expect(
      sendCampaign(undefined, completePostSendCampaign(mockSendCampaignResponse, mockSendCampaignStatus))
    ).to.deep.equal({
      ...initialState.sendCampaign,
      isPosting: false,
      sendCampaignResponse: mockSendCampaignResponse,
      sendCampaignStatus: mockSendCampaignStatus
    });
  });

// sendTest reducer

  it('should handle REQUEST_POST_SENDTESTEMAIL', () => {
    expect(
      sendTest(undefined, requestPostSendTestEmail())
    ).to.deep.equal({
      ...initialState.sendTest,
      isPosting: true
    });
  });

  it('should handle COMPLETE_POST_SENDTESTEMAIL', () => {
    const mockSendTestEmailResponse = 'something1';
    const mockSendTestEmailStatus = 'something2';
    expect(
      sendTest(undefined, completePostSendTestEmail(mockSendTestEmailResponse, mockSendTestEmailStatus))
    ).to.deep.equal({
      ...initialState.sendTest,
      isPosting: false,
      sendTestEmailResponse: mockSendTestEmailResponse,
      sendTestEmailStatus: mockSendTestEmailStatus
    });
  });

});