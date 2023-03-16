public with sharing class CaseController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getCases() {
        return [SELECT Id, CaseNumber, Subject, Status, isMarkedAsSpam__c FROM Case];
    }

    @AuraEnabled
    public static void updateCase(Id caseId, Boolean isSpam) {
        Case caseRecord = new Case(Id=caseId, isMarkedAsSpam__c=isSpam);
        update caseRecord;
    }
}
