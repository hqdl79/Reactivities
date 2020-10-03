import React from 'react';
import { List, Image, Popup } from 'semantic-ui-react';
import { IAttendee } from '../../../app/models/activity';

interface IProps{
    attendees: IAttendee[];
}
const style = 
{
    borderColor: 'orange',
    borderWidth: 2
}
const  ActivityListItemAddendees: React.FC<IProps> = ({attendees}) => {
    return (
        <List horizontal>
            {attendees.map(attendees => (
                <List.Item key ={attendees.username}>
                    <Popup 
                        header={attendees.displayName}
                        trigger ={
                            <Image size="mini" circular src={attendees.image || '/assets/user.png'}
                            bordered
                            style={attendees.following ? style : null} />
                        } />
                  
                </List.Item>
            ))}
        </List>
    )
}

export default ActivityListItemAddendees