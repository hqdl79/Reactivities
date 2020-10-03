
import React  from 'react'
import { Tab } from 'semantic-ui-react'
import ProfileActivities from './ProfileActivities'
import ProfileDescription from './ProfileDescription'
import ProfileFollowings from './ProfileFollowings'
import ProfilePhotos from './ProfilePhotos'

const panes = [
{menuItem: 'About', render: () => <ProfileDescription />},
    {menuItem: 'Photos', render: () => <ProfilePhotos/>},
    {menuItem: 'Activities', render: () => <ProfileActivities />},
{menuItem: 'Followers', render: () => <ProfileFollowings/>},
    {menuItem: 'Following', render: () => <ProfileFollowings/>}
]
interface IProps{
    setActivityTab: (atctiveIndex: any) => void;
}
const ProfileContent: React.FC<IProps> = ({setActivityTab}) => {
    return (
        <Tab 
            menu = {{fluid: true, vertical: true}}
            menuPosition ='right'
            panes={panes}
            onTabChange = {(e,data) => setActivityTab(data.activeIndex)}
        />
    )
}
export default ProfileContent;
