const InstanceComponent: ng.IComponentOptions = {
  bindings: {
    instance: '<'
  },
  controller: function($scope) {
    console.log($scope.instance);
    console.log(this.instance);
//    $rootScope.currentResource = this.instance.hostname;
  },
  template: require('./instance.html')
};

export default InstanceComponent;
