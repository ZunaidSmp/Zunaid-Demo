public with sharing class UserDependenciesController {
    @AuraEnabled(cacheable=true)
    public static List<String> getUserDependencies(String userId) {
        List<String> dependencies = new List<String>();
        if (userId == null) {
            return dependencies;
        }
        Schema.DescribeSObjectResult userDescribe = Schema.SObjectType.User;
        Map<String, Schema.SObjectField> fields = userDescribe.fields.getMap();
        Schema.SObjectField userIdField = fields.get('Id');
        Map<String, Schema.SObjectField> dependentFields = userIdField.getDescribe().getDependentFields();
        for (String fieldApiName : dependentFields.keySet()) {
            dependencies.add(fieldApiName);
        }
        return dependencies;
    }
}
