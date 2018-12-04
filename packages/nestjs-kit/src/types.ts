import {IUser} from './db-models';

export interface INotificationsService {
    sendNotification(viewer: IUser, notification: {type: string, payload: any});
}

export const NOTIFICATION_SERVICE_NAME = "NOTIFICATION_SERVICE_NAME";
