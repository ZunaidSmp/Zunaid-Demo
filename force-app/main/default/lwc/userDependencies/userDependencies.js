import { LightningElement, api, wire } from 'lwc';
import { getUserObjectInformations } from 'lightning/uiObjectInfoApi';
import USER_ID_FIELD from '@salesforce/schema/User.Id';

export default class UserDependencies extends LightningElement {
    @api recordId;
    dependentFields = [];
    showDependencies = false;

    async handleUserChange(event) {
        const userId = event.target.value;
        if (!userId) {
            this.showDependencies = false;
            return;
        }
        const userObjectInfo = await getUserObjectInformations({ objectApiName: 'User' });
        this.dependentFields = userObjectInfo.fields[USER_ID_FIELD.fieldApiName].dependentFields;
        this.showDependencies = true;
    }
}
