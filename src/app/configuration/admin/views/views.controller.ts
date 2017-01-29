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

class ViewsController {
  private viewsToCreate: any[];
  private viewsToUpdate: any[];
  private initialViews: any[];
  private views: any[];

  constructor(
    private ViewService,
    private NotificationService,
    private $q,
    private $mdEditDialog,
    private $mdDialog,
  ) {
    'ngInject';


    //this.loadViews();
    this.viewsToCreate = [];
    this.viewsToUpdate = [];
  }

  /*loadViews() {
    this.ViewService.list().then(response =>{
      this.views = response.data;
      _.each(this.views, function(view) {
        delete view.totalApis;
      });
      this.initialViews = _.cloneDeep(this.views);
    });
  }*/

  newView(event) {
    event.stopPropagation();

    this.$mdEditDialog
      .small({
        placeholder: 'Add a name',
        save: input =>{
          const view = {name: input.$modelValue};
          this.views.push(view);
          this.viewsToCreate.push(view);
        },
        targetEvent: event,
        validators: {
          'md-maxlength': 30
        }
      })
      .then((ctrl) => {
        const input = ctrl.getInput();

        input.$viewChangeListeners.push(() => {
          input.$setValidity('empty', input.$modelValue.length !== 0);
          input.$setValidity('duplicate', !_.includes(_.map(this.views, 'name'), input.$modelValue));
        });
      });
  }

  editName(event, view) {
    event.stopPropagation();

    var that = this;

    var promise = this.$mdEditDialog.small({
      modelValue: view.name,
      placeholder: 'Add a name',
      save: function (input) {
        view.name = input.$modelValue;
        if (!_.includes(that.viewsToCreate, view)) {
          that.viewsToUpdate.push(view);
        }
      },
      targetEvent: event,
      validators: {
        'md-maxlength': 30
      }
    });

    promise.then(function (ctrl) {
      var input = ctrl.getInput();

      input.$viewChangeListeners.push(function () {
        input.$setValidity('empty', input.$modelValue.length !== 0);
      });
    });
  }

  editDescription(event, view) {
    event.stopPropagation();

    var that = this;

    this.$mdEditDialog.small({
      modelValue: view.description,
      placeholder: 'Add a description',
      save: function (input) {
        view.description = input.$modelValue;
        if (!_.includes(that.viewsToCreate, view)) {
          that.viewsToUpdate.push(view);
        }
      },
      targetEvent: event,
      validators: {
        'md-maxlength': 160
      }
    });
  }

  saveViews() {
    var that = this;

    this.$q.all([
      this.ViewService.create(that.viewsToCreate),
      this.ViewService.update(that.viewsToUpdate)
    ]).then(function () {
      that.NotificationService.show("Views saved with success");
      // that.loadViews();
      that.viewsToCreate = [];
      that.viewsToUpdate = [];
    });
  }

  deleteView(view) {
    var that = this;
    this.$mdDialog.show({
      controller: 'DeleteViewDialogController',
      templateUrl: 'app/configuration/admin/views/delete.view.dialog.html',
      view: view
    }).then(function (deleteView) {
      if (deleteView) {
        if (view.id) {
          that.ViewService.delete(view).then(function () {
            that.NotificationService.show("View '" + view.name + "' deleted with success");
            _.remove(that.views, view);
          });
        } else {
          _.remove(that.viewsToCreate, view);
          _.remove(that.views, view);
        }
      }
    });
  }

  reset() {
    this.views = _.cloneDeep(this.initialViews);
    this.viewsToCreate = [];
    this.viewsToUpdate = [];
  }
}

export default ViewsController;
