const InstanceHeaderComponent: ng.IComponentOptions = {
  bindings: {
    instance: '<'
  },
  controller: function() {
    console.log('instance-header');
  },
  template: require('./instance-header.html')
};

export default InstanceHeaderComponent;
