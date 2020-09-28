import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid, GridColumn, FormGroup } from "semantic-ui-react";
import { RouteComponentProps } from "react-router";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { ActivityFormValues } from "../../../app/models/activity";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput  from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/categoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from "revalidate"
import { RootStoreContext } from "../../../app/stores/rootStore";

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired({message: 'Category'}),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
})

interface IDetailForm {
  id: string;
}
const ActivityForm: React.FC<RouteComponentProps<IDetailForm>> = ({
  match,
  history
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
  } = rootStore.activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then(activity => {
          setActivity(new ActivityFormValues(activity));
        })
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };
  
  return (
    <Grid>
      <GridColumn width={10}>
        <Segment clearing>
          <FinalForm
          validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  component={TextAreaInput}
                  rows={3}
                  placeholder="Description"
                  name="description"
                  value={activity.description}
                />
                <Field
                  component={SelectInput}
                  options={category}
                  placeholder="Category"
                  name="category"
                  value={activity.category}
                />
                <FormGroup widths="equal">
                  <Field
                    component={DateInput}
                    placeholder="Date"
                    name="date"
                    value={activity.date}
                    date={true}
                  />
                  <Field
                    component={DateInput}
                    placeholder="Time"
                    name="time"
                    value={activity.time}
                    time={true}
                  />
                </FormGroup>

                <Field
                  component={TextInput}
                  placeholder="City"
                  name="city"
                  value={activity.city}
                />
                <Field
                  component={TextInput}
                  placeholder="Venue"
                  name="venue"
                  value={activity.venue}
                />
                <Button
                  loading={submitting}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push("/activities")
                  }
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
              </Form>
            )}
          />
        </Segment>
      </GridColumn>
    </Grid>
  );
};
export default observer(ActivityForm);