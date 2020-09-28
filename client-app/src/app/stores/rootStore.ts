import ActivityStore from "./activityStore";
import UserStore from './userStore';
import { createContext } from 'react';
import { configure } from "mobx";
import CommonStore from "./commonStore";
import ModelStore from "./modalStore";
import ProfileStore from "./profileStore";

configure({enforceActions: 'always'});
export class RootStore {
    activityStore:ActivityStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modelStore: ModelStore;
    profileStore: ProfileStore;
    constructor(){
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.modelStore = new ModelStore(this);
        this.profileStore = new ProfileStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());