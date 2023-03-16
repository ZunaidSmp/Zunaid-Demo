import { LightningElement, wire } from 'lwc';
import getCases from '@salesforce/apex/CaseController.getCases';
import updateCase from '@salesforce/apex/CaseController.updateCase';

const columns = [
    { label: 'Case Number', fieldName: 'CaseNumber', type: 'text' },
    { label: 'Subject', fieldName: 'Subject', type: 'text' },
    { label: 'Status', fieldName: 'Status', type: 'text' },
    { label: 'Is Spam', type: 'button-icon', initialWidth: 100,
        typeAttributes: { iconName: 'utility:blocked', name: 'spam', variant: 'border-filled', title: 'Mark as Spam' }
    }
];

export default class CaseList extends LightningElement {
    cases = [];
    columns = columns;

    @wire(getCases)
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'spam') {
            const updatedCases = [...this.cases];
            const index = updatedCases.findIndex(caseItem => caseItem.Id === row.Id);
            updatedCases[index].IsSpam = !row.IsSpam;

            updateCase({ caseId: row.Id, isSpam: !row.IsSpam })
                .then(() => {
                    this.cases = updatedCases;
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
}
