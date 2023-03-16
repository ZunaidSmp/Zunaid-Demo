import { LightningElement, wire } from 'lwc';
import getCases from '@salesforce/apex/CaseController.getCases';
import updateCase from '@salesforce/apex/CaseController.updateCase';

const columns = [
    { label: 'Case Number', fieldName: 'CaseNumber', type: 'text' },
    { label: 'Subject', fieldName: 'Subject', type: 'text' },
    { label: 'Status', fieldName: 'Status', type: 'text' },
    {
        label: 'Is Spam', type: 'button', initialWidth: 100,
        typeAttributes: {
            label: { fieldName: 'isSpamLabel' },
            name: 'spam',
            variant: { fieldName: 'isSpamVariant' },
            title: { fieldName: 'isSpamTitle' }
        }
    }
];

export default class CaseList extends LightningElement {
    cases = [];
    columns = columns;

    @wire(getCases)
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data.map(caseItem => ({
                ...caseItem,
                isSpamLabel: caseItem.IsSpam ? 'Mark Not Spam' : 'Mark Spam',
                isSpamVariant: caseItem.IsSpam ? 'destructive' : 'brand',
                isSpamTitle: caseItem.IsSpam ? 'Mark as Not Spam' : 'Mark as Spam'
            }));
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
            const isSpam = !row.IsSpam;
            updatedCases[index].IsSpam = isSpam;
            updatedCases[index].isSpamLabel = isSpam ? 'Mark Not Spam' : 'Mark Spam';
            updatedCases[index].isSpamVariant = isSpam ? 'destructive' : 'brand';
            updatedCases[index].isSpamTitle = isSpam ? 'Mark as Not Spam' : 'Mark as Spam';

            updateCase({ caseId: row.Id, isSpam: isSpam })
                .then(() => {
                    this.cases = updatedCases;
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
}
