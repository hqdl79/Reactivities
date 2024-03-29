import React from "react";
import { combineValidators, isRequired } from "revalidate";
import { IProfile } from "../../app/models/profile";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";

const validate = combineValidators({
  displayName: isRequired('displayName'),
});
interface IProps {
  updateProfile: (profile: Partial<IProfile>) => void;
  profile: IProfile;
}


const ProfileEditForm: React.FC<IProps> = ({ updateProfile, profile }) => {
  return (
    <FinalForm
      onSubmit={updateProfile}
      validate={validate}
      initialValues={profile}
      render={({ handleSubmit, invalid, pristine, submitting }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            name="displayName"
            component={TextInput}
            placeholder="Dispaly name"
            value={profile!.displayName}
          />
          <Field
            name="bio"
            component={TextAreaInput}
            Row={3}
            placeholder="Bio"
            value={profile!.bio}
          />
          <Button
            loading={submitting}
            disabled={invalid || pristine}
            floated="right"
            positive
            type="submit"
            content="Update Profile"
          />
        </Form>
      )}
    ></FinalForm>
  );
};
export default observer(ProfileEditForm);
