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
class ApiAdminController {
  constructor (resolvedApi, $state, $scope, $rootScope, $mdDialog, ApiService, NotificationService, resolvedApiState) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;
    this.api = resolvedApi.data;

    $rootScope.currentResource = this.api.name;

    this.ApiService = ApiService;
    this.NotificationService = NotificationService;
    this.apiJustDeployed = false;
    this.apiIsSynchronized = resolvedApiState.data.is_synchronized;
    this.$scope.apiReadMode = false;
    this.$scope.apiEditMode = true;
    this.init();
  }

  init() {
    var self = this;
    this.$scope.$on("apiPictureChangeSuccess", function(event, args) {
      self.api.picture = args.image;
      self.updatePicture(self.api);
    });
    this.$scope.$on("apiChangeSuccess", function() {
      self.checkAPISynchronization(self.api);
      self.$rootScope.$broadcast("apiChangeSucceed");
    });
  }

  checkAPISynchronization(api) {
    this.ApiService.isAPISynchronized(api.id).then(response => {
      this.apiJustDeployed = false;
      if (response.data.is_synchronized) {
        this.apiIsSynchronized = true;
      } else {
        this.apiIsSynchronized = false;
      }
      this.$rootScope.$broadcast("checkAPISynchronizationSucceed");
    });
  }

  showDeployAPIConfirm(ev, api) {
    ev.stopPropagation();
    let self = this;
    this.$mdDialog.show({
      controller: 'DialogConfirmController',
      controllerAs: 'ctrl',
      templateUrl: 'app/components/dialog/confirm.dialog.html',
      clickOutsideToClose: true,
      title: "Would you like to deploy your API ?",
      msg: "",
      confirmButton: "OK"
    }).then(function (response) {
      if (response) {
        self.deploy(api);
      }
    });
  }

  deploy(api) {
    this.ApiService.deploy(api.id).then((deployedApi) => {
      this.NotificationService.show("API deployed");
      this.api = deployedApi.data;
      this.api.picture_url = api.picture_url;
      this.apiJustDeployed = true;
      this.$rootScope.$broadcast("apiChangeSuccess");
    });
  }

  updatePicture(api) {
    var self = this;
    this.ApiService.update(api).then(updatedApi => {
      self.api = updatedApi.data;
      self.NotificationService.show('API \'' + self.api.name + '\' saved');
    });
  }

  isOwner() {
    return this.api.permission && (this.api.permission === 'owner' || this.api.permission === 'primary_owner');
  }
}

export default ApiAdminController;
