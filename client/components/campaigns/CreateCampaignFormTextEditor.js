import React from 'react';
import RichTextEditor from 'react-rte';

const CreateCampaignForm = (props) => {
    const { value, onChange } = props.input;
    const RteEmpty = RichTextEditor.createEmptyValue();

    return <RichTextEditor value={RteEmpty} onChange={onChange} />;
}

export default CreateCampaignForm;
