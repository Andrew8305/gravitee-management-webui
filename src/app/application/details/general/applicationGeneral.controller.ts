/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as _ from 'lodash';

class ApplicationGeneralController {

  private application: any;
  private groups: any[];
  private initialApplication: any;
  constructor(
    private resolvedApplication,
    private ApplicationService,
    private NotificationService,
    private GroupService,
    private UserService,
    private $state,
    private $scope,
    private $mdDialog,
    private $rootScope
  ) {
    'ngInject';
    this.application = resolvedApplication.data;

    if (!this.application.group) {
      this.application.group = GroupService.getEmptyGroup();
    }
    this.groups = [this.application.group];
    this.initialApplication = _.cloneDeep(this.application);
    this.ApplicationService = ApplicationService;
    this.NotificationService = NotificationService;
    this.GroupService = GroupService;
    this.UserService = UserService;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
  }

  get(applicationId) {
    this.ApplicationService.get(applicationId).then(response => {
      this.application = response.data;
      this.initialApplication = _.cloneDeep(this.application);
    });
  }

  update(application) {
    this.ApplicationService.update(application).then(() => {
      this.initialApplication = _.cloneDeep(application);
      this.$scope.formApplication.$setPristine();
      this.NotificationService.show('Application ' + application.name + ' has been updated');
      this.$rootScope.currentResource = this.application.name;
    });
  }

  delete(application) {
    this.ApplicationService.delete(application).then(() => {
      this.NotificationService.show('Application ' + application.name + ' has been deleted');
      this.$state.go('applications.list', {}, {reload: true});
    });
  }

  reset() {
    this.application = _.cloneDeep(this.initialApplication);
    this.$scope.formApplication.$setPristine();
  }

  loadApplicationGroups() {
    if (this.UserService.isUserInRoles(['ADMIN'])) {
      this.GroupService.list("APPLICATION").then((groups) => {
        this.groups = _.union(
          [this.GroupService.getEmptyGroup()],
          groups.data);
      });
    }
  }

  showDeleteApplicationConfirm(ev) {
    ev.stopPropagation();
    var self = this;
    this.$mdDialog.show({
      controller: 'DialogConfirmController',
      controllerAs: 'ctrl',
      templateUrl: 'app/components/dialog/confirmWarning.dialog.html',
      clickOutsideToClose: true,
      title: 'Would you like to delete your application?',
      msg: "",
      locals: {
        confirmButton: 'Remove'
      }
    }).then(function (response) {
      if (response) {
        self.delete(self.application);
      }
    });
  }
}

export default ApplicationGeneralController;
